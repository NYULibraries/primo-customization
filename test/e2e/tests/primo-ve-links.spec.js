// Currently in the `homepage_en.html` files we have Primo VE links with hardcoded
// `vid` values in the `href` URLs, and occasionally the URLs have been absolute
// instead of relative URLs.  Ideally we'd like to eliminate URL `vid`-based
// differences between `homepage_en.html` files, setting or overriding the `vid`
// values at page load time, but until then, we need to protect against bad
// URLs that might inadvertently send the user to the wrong Primo VE view.

/* global process, require */

const { test, expect } = require( '@playwright/test' );

const view = process.env.VIEW;
const vid = view.replaceAll( '-', ':' );

const linksToTest = [
    {
        text         : 'browse journals by title',
        expectedHref : `/discovery/jsearch?vid=${ vid }`,
    },
    {
        text         : 'find an article by citation',
        expectedHref : `/discovery/citationlinker?vid=${ vid }`,
    },
];

test( 'Primo VE links in home page', async ( { page } ) => {
    // Tests running in container sometimes take longer and require a
    // higher timeout value.
    if ( process.env.IN_CONTAINER ) {
        test.slow();
    }

    await page.goto( `?vid=${ vid }` );

    await page.locator( 'md-card[ data-cy="home-need-help" ]' ).waitFor();

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







