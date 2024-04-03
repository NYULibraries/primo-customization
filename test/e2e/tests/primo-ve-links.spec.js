// Currently in the `homepage_en.html` files we have Primo VE links with hardcoded
// `vid` values in the `href` URLs, and occasionally the URLs have been absolute
// instead of relative URLs.  Ideally we'd like to eliminate URL `vid`-based
// differences between `homepage_en.html` files, setting or overriding the `vid`
// values at page load time, but until then, we need to protect against bad
// URLs that might inadvertently send the user to the wrong Primo VE view.

/* global process, require */

const { test, expect } = require( '@playwright/test' );

import { getViewConfig, modifyCSPHeader, parseVid } from '../testutils';

const view = process.env.VIEW;
const vid = parseVid( view );

const linksToTest =
    getViewConfig( 'primo-ve-links', view ).getLinksToTest( vid );
if ( linksToTest.length > 0 ) {
    // We need to wait for home page to fully load before running the test.
    // There is already a home page test in the `static` test suite for all
    // views which has the selector for the element we need to wait for.  For
    // now, we just grab it from there.
    // This is a bit brittle, because conceivably we might one day remove the
    // home page test for a view, or change the `key` for the test case to a
    // different string.  Once we get a sense of which selectors are needed
    // across test suites, we could perhaps extract them to library code.  We
    // might also switch to using page objects, in which case the selectors will
    // be nicely encapsulated there.
    const homePageWaitForSelector =
        getViewConfig( 'static', view ).testCases.find(
            element => element.key === 'home-page',
        ).waitForSelector;

    test( 'Primo VE links in home page', async ( { page } ) => {
        if ( process.env.CONTAINER_MODE ) {
            await modifyCSPHeader( page );
        }

        await page.goto( `?vid=${ vid }` );

        await page.locator( homePageWaitForSelector ).waitFor();

        const linkTestFailures = {};
        for ( let i = 0; i < linksToTest.length; i++ ) {
            const linkToTest = linksToTest[ i ];

            const link = await page.locator( `a:has-text("${ linkToTest.text }")` );

            const href = await link.getAttribute( 'href' );

            if ( href !== linkToTest.expectedHref ) {
                linkTestFailures[ linkToTest.text ] = {
                    expected : linkToTest.expectedHref,
                    actual   : href,
                };
            }
        }

        const failMessage = 'FAILED LINKS:\n' +
                            Object.keys( linkTestFailures ).sort().map( linkText => {
                                const testFailure = linkTestFailures[ linkText ];
                                return `* "${ linkText }" link FAIL: expected "${ testFailure.expected }", got "${ testFailure.actual }"`
                            } ).join( '\n' );

        expect( Object.keys( linkTestFailures ).length === 0, failMessage ).toBe( true );
    } );
}







