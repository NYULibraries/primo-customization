/* global document, process, require, setTimeout */

const { test, expect } = require( '@playwright/test' );

import { getViewConfig, modifyCSPHeader, parseVid, setPathAndQueryVid } from '../testutils';

const BROWZINE_PRIMO_ADAPTER_SCRIPT_URL =
    'https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js';
// This is not necessarily a comprehensive list.
const LIBKEY_LINK_SELECTORS = [
    'a.browzine-article-link',
    'a.browzine-direct-to-pdf-link',
    'a.browzine-web-link',
    'a.browzine-web-link-text',
    'a.unpaywall-article-pdf-link',
];

const view = process.env.VIEW;
const vid = parseVid( view );

const testCases = getViewConfig( 'libkey', view ).testCases;

for ( let i = 0; i < testCases.length; i++ ) {
    const testCase = testCases[ i ];

    test.describe( `${ view }: ${ testCase.name }`, () => {
        // Tests running in container sometimes take longer and require a
        // higher timeout value.  These tests have timed out in containers in
        // both `test.beforeEach()` and the test itself, so we need to increase
        // the timeout for everything in `test.describe()`.
        if ( process.env.CONTAINER_MODE ) {
            test.slow();
        }

        test.beforeEach( async ( { page } ) => {
            if ( process.env.CONTAINER_MODE ) {
                await modifyCSPHeader( page );
            }

            // Simulate slow response to request for Browzine Primo adapter script.
            if ( testCase.browzinePrimoAdapterExecutionDelay ) {
                await page.route(
                    BROWZINE_PRIMO_ADAPTER_SCRIPT_URL,
                    async route => {
                        await new Promise(
                            fn => setTimeout( fn, testCase.browzinePrimoAdapterExecutionDelay ),
                        );
                        await route.continue();
                    },
                );
            }

            await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );
        } );

        let testTitle = 'has a clickable LibKey link';
        if ( testCase.browzinePrimoAdapterExecutionDelay ) {
            testTitle += ` w/ ${ Math.floor( testCase.browzinePrimoAdapterExecutionDelay / 1_000 ) }s Browzine delay`;
        }

        test( testTitle, async ( { page } ) => {
            await testHasAClickableLibKeyLink( page );
        } );
    } );
}

async function testHasAClickableLibKeyLink( page ) {
    const waitForLibKeyLinksFunction = ( libKeySelectors ) => {
        let result = false;

        for ( let i = 0; i < libKeySelectors.length; i++ ) {
            if ( document.querySelector( libKeySelectors[ i ] ) ) {
                result = true;

                break;
            }
        }

        return result;
    }

    // Continuously search for at least one element matching any selector
    // in LIBKEY_LINK_SELECTORS.
    // Note that we can't save the element for later when we test click
    // behavior because `waitForFunction` functions run in the browser,
    // not in Playwright's Node context.
    await page.waitForFunction( waitForLibKeyLinksFunction, LIBKEY_LINK_SELECTORS );

    // Since we can't make a reproducible LibKey link click test
    // due to the fact that we are testing live search results
    // which are not stable, we might as well increase our coverage
    // by selecting a link at random each time we test.
    // As mentioned above, we can't re-use the link found by
    // `waitForLibKeyLinksFunction`, so we have to loop through and
    // find one again.  Despite the repetition, it is advantageous to do
    // the previous `waitFor` test because we can not be assured that
    // when we use `page.locator` to find LibKey links we do not have to
    // specify long timeouts, because if `page.locator` fails, we can
    // be confident that it's due to the absence of links matching that
    // selector being returned by the LibKey code, and not due to LibKey
    // links not having to appear yet.  If we didn't have this assurance,
    // we'd have to allow each `page.locator` call to run a long time,
    // or do an awkward warm-up step first.
    let libKeyLinks = [];
    for ( let i = 0; i < LIBKEY_LINK_SELECTORS.length; i++ ) {
        const links = await page.locator( LIBKEY_LINK_SELECTORS[ i ] ).all();

        libKeyLinks = [ ...libKeyLinks, ...links ];
    }

    let randomLibKeyLinkTestResult = {
        errorMessage : null,
        linkHref     : null,
        newPageUrl   : null,
        result       : false,
    };

    await randomLibKeyLinkTest(
        page,
        libKeyLinks,
        randomLibKeyLinkTestResult,
    );

    expect(
        randomLibKeyLinkTestResult.result,
        randomLibKeyLinkTestResult.errorMessage,
    ).toBe( true );
}

async function randomLibKeyLinkTest( page, libKeyLinks, testResult ) {
    // Test a random LibKey link to see if clicking on it opens a new tab and
    // loads the correct URL.  We do this to make sure we don't have a situation
    // similar to `prm-brief-result-after`, where clicks on links were being
    // intercepted by a handler which triggered opening to full display view and
    // blocked the opening of new tabs.
    const randomLibKeyLink =
        libKeyLinks[ Math.floor( Math.random() * libKeyLinks.length ) ]

    testResult.linkHref = await randomLibKeyLink.getAttribute( 'href' );

    // It appears to be the case the clicking a LibKey link will always open a
    // new tab.  However, in the case of download PDF links, this new tab might
    // either load the PDF in a PDF viewer in the tab or trigger a download of
    // the PDF file.  We currently don't have a way of determining in advance
    // which of these behaviors will result from the click, so we test for both.

    // First test to see if a new tab opens up with content: either a regular
    // web page or a PDF in a viewer.
    // https://playwright.dev/docs/pages#handling-new-pages
    const pagePromise = page.context().waitForEvent( 'page' );

    await randomLibKeyLink.click();

    const newPage = await pagePromise;

    // Originally, we tested the URL of the new tab using `newPage.url()`.
    // However, it is often the case that the newly opened tabs redirected
    // through a chain of URLs, leading to a race condition where sometimes
    // the URL returned by `newPage.url()` was not the initial URL of the
    // tab/page/frame but one later in the redirect chain, leading to test
    // failure.
    // Here is where the Playwright frame URL gets changed by redirects:
    // https://github.com/microsoft/playwright/blob/60696ef493fe5e35de00efcded77d60b81548599/packages/playwright-core/src/client/frame.ts#L87
    // The example code for `on('page')` -- https://playwright.dev/docs/api/class-browsercontext#browser-context-event-page.
    // ...seems to suggest that a viable method for capturing the initial
    // URL of a tab is to call `newPage.evaluate('location.href')`
    // immediately after the `page` event is emitted, before it has even
    // fully loaded.
    testResult.newPageUrl = await newPage.evaluate( 'location.href' );
    if ( testResult.newPageUrl === testResult.linkHref ) {
        testResult.result = true;
    } else {
        if ( testResult.newPageUrl === 'about:blank' ) {
            // This might be a direct download link.  Test to see if we have a blank
            // new tab and a download event with a filename ending in ".pdf".
            await testIsDirectDownloadLink( page, randomLibKeyLink, testResult );
        } else {
            // It wasn't a direct download link, and it opened a tab with the wrong URL.
            testResult.result = false;
            testResult.errorMessage =
                `Randomly selected LibKey link with href "${ testResult.linkHref }"` +
                ' did not correctly open a new tab.' + (
                    testResult.newPageUrl ? ` New tab loaded with incorrect URL "${ testResult.newPageUrl }".` : ''
                );
        }
    }
}

async function testIsDirectDownloadLink( page, randomLibKeyLink, testResult ) {
    const EXPECTED_FILE_EXTENSION = '.pdf';

    // https://playwright.dev/docs/downloads
    // https://playwright.dev/docs/api/class-download
    const downloadPromise = page.waitForEvent( 'download' );

    await randomLibKeyLink.click();

    const download = await downloadPromise;

    const downloadSuggestedFilename = download.suggestedFilename();
    if ( downloadSuggestedFilename.toLocaleLowerCase().endsWith( EXPECTED_FILE_EXTENSION ) ) {
        testResult.result = true;
    } else {
        testResult.result = false;

        if ( !testResult.errorMessage ) {
            testResult.errorMessage =
                `Clicking randomly selected LibKey link with href "${ testResult.linkHref }"` +
                ` triggered the download of file "${ downloadSuggestedFilename }", which does` +
                ` does not have the expected filename extension "${ EXPECTED_FILE_EXTENSION }".`;
        }
    }
}
