const { test, expect } = require( '@playwright/test' );

// This is not necessarily a comprehensive list.
const LIBKEY_LINK_SELECTORS = [
    'a.browzine-article-link',
    'a.browzine-direct-to-pdf-link',
    'a.browzine-web-link',
    'a.unpaywall-article-pdf-link',
];

const view = process.env.VIEW;
const vid = view.replaceAll( '-', ':' );

const testCases = [
    {
        key         : 'art',
        name        : 'Art',
        queryString : 'query=any,contains,art&tab=Unified_Slot&search_scope=ARTICLES&offset=0',
    },
    // {
    //     key         : 'ids-of-stable-test-records',
    //     name        : '[TODO: IDS OF STABLE TEST RECORDS]',
    //     queryString : '[TODO]',
    // },
];

for ( let i = 0; i < testCases.length; i++ ) {
    const testCase = testCases[ i ];

    test.describe( testCase.name, () => {
        test.beforeEach( async ( { page } ) => {
            let fullQueryString = `?vid=${ vid }`;
            if ( testCase.queryString ) {
                fullQueryString += `&${ testCase.queryString }`;
            }
            await page.goto( fullQueryString );
        } );

        test( 'has at least 1 clickable LibKey link', async ( { page } ) => {
            const waitForLibKeyLinksFunction = ( libKeySelectors ) => {
                let result = false;

                for ( let i = 0; i < libKeySelectors.length; i++ ) {
                    if ( !!document.querySelector( libKeySelectors[ i ] ) ) {
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
                result: false,
                linkHref: null,
                newPageUrl: null,
            };
            await randomLibKeyLinkTest(
                page,
                libKeyLinks,
                randomLibKeyLinkTestResult,
            );

            expect(
                randomLibKeyLinkTestResult.result,
                `Randomly selected LibKey link with href "${ randomLibKeyLinkTestResult.linkHref }"` +
                ` did not correctly open a new tab.` +
                (
                    randomLibKeyLinkTestResult.newPageUrl ?
                    ` New tab loaded with incorrect URL "${ randomLibKeyLinkTestResult.newPageUrl }".` :
                    ''
                )
            ).toBe( true );
        } );
    } );
}

async function randomLibKeyLinkTest( page, libKeyLinks, testResult ) {
    // Test a random LibKey link to see if clicking on it loads
    // the right URL in a new tab.
    const randomLibKeyLink =
        libKeyLinks[ Math.floor( Math.random() * libKeyLinks.length ) ]

    testResult.linkHref = await randomLibKeyLink.getAttribute( 'href' );

    // https://playwright.dev/docs/pages#handling-new-pages
    // Start waiting for new page before clicking. Note no await.
    const pagePromise = page.context().waitForEvent( 'page' );
    await randomLibKeyLink.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    testResult.newPageUrl = await newPage.url();

    if ( testResult.newPageUrl === testResult.linkHref ) {
        testResult.result = true;
    }
}
