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
            // This is the maximum amount of time we expect it take for everything
            // including the LibKey links to load.
            let waitForEverythingToLoad = 10_000;
            // Tests running in container take longer and often require a longer
            // timeout value.
            if ( process.env.IN_CONTAINER ) {
                waitForEverythingToLoad = 90_000;
            }
            // Our `waitForFunction` function loops through all LIBKEY_LINK_SELECTORS
            // to check if any links of those types are present.  Since it could
            // be the case that the only links present are of the very first type
            // checked, we have to allow for time for those to appear.
            // If no links of the first type are present, but links of subsequent
            // types are, we are waiting longer than we have to.
            // In theory, we could do a `page.waitForTimeout( waitForEveryThingToLoad )`,
            // but it's generally considered bad practice to rely on timeouts,
            // which are brittle.  `page.waitForTimeout` itself is deprecated for that reason.
            const allowForTimeToCheckForAllLibKeyLinkSelectors = LIBKEY_LINK_SELECTORS.length * waitForEverythingToLoad;
            test.setTimeout( allowForTimeToCheckForAllLibKeyLinkSelectors );

            const waitForLibKeySelectorsFunction = ( libKeySelectors ) => {
                let result = false;

                for ( let i = 0; i < libKeySelectors.length; i++ ) {
                    if ( !!document.querySelector( libKeySelectors[ i ] ) ) {
                        result = true;

                        break;
                    }
                }

                return result;
            }
            await page.waitForFunction( waitForLibKeySelectorsFunction, LIBKEY_LINK_SELECTORS );

            let libKeyLinksFound = false;
            let randomLibKeyLinkTestResult = {
                result: false,
                linkHref: null,
                newPageUrl: null,
            };
            for ( let i = 0; i < LIBKEY_LINK_SELECTORS.length; i++ ) {
                const libKeyLinks = await page.locator( LIBKEY_LINK_SELECTORS[ i ] ).all();

                if ( libKeyLinks.length > 0 ) {
                    libKeyLinksFound = true;

                    // Since we can't make a reproducible LibKey link click test
                    // due to the fact that we are testing live search results
                    // which are not stable, we might as well increase our coverage
                    // by selecting a link at random each time we test.
                    await randomLibKeyLinkTest(
                        page,
                        libKeyLinks,
                        randomLibKeyLinkTestResult
                    );

                    break;
                }
            }

            expect(
                libKeyLinksFound,
                'No elements found matching any of the following: ' +
                    LIBKEY_LINK_SELECTORS.join( ', ' )
            ).toBe( true );

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
