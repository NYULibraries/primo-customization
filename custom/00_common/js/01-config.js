// ****************************************
// 01-config.js
// ****************************************

const searchParams = new URLSearchParams( window.location.search );
const vid = searchParams.get( 'vid' );
const cdnUrl = getCdnUrl( vid );

console.log( `[DEBUG] cdnUrl = ${ cdnUrl }` );

// All the code in our customization package is run inside an IIFE (Immediately
// Invoked Function Expression), which means any variables defined here are not
// accessible to the CDN JS code.  The only way for the CDN JS code to know the
// CDN URL without duplicating `getCdnUrl()` there is to attach it to an object
// it has access to, or to inject it in a <script> or DOM element on the page.
// We choose to attach it to the global `window` object since we are already
// allowing the Third Iron code to attach the `browzine` object to `window` for
// LibKey functionality, and it seems safe enough using the `nyulibraries`
// namespace.
window.nyulibraries = {
    cdnUrl,
};

// This is necessary to allow the `templateURL` method to fetch cross-domain
// from the CDN.
app.config( function ( $sceDelegateProvider ) {
    $sceDelegateProvider.trustedResourceUrlList(
        [
            'self',
            // Keeping this here commented out as a reminder that "*" can
            // be used in domain name for wildcarding.
            // 'https://cdn*.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01/**',
            `${ cdnUrl }/**`,
        ],
    );
} );
