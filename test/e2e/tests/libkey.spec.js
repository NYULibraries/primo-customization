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

        test( 'has LibKey links', async ( { page } ) => {
            // TODO: Find a better waitFor condition.
            await page.waitForTimeout( 5_000 );

            let libkeyLinksFound = false;
            for ( let i = 0; i < LIBKEY_LINK_SELECTORS.length; i++ ) {
                const libkeyLinksCount = await page.locator( LIBKEY_LINK_SELECTORS[ i ] ).count();

                if ( libkeyLinksCount > 0 ) {
                    libkeyLinksFound = true;

                    break;
                }
            }

            expect(
                libkeyLinksFound,
                'No elements found matching any of the following: ' +
                    LIBKEY_LINK_SELECTORS.join( ', ' )
            ).toBe( true );
        } );
    } );
}






