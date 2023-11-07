// ****************************************
// 03-inject.js
// ****************************************

/* global cdnUrl, document */

// eslint-disable-next-line no-unused-vars
function injectCDNResourceTags() {
    injectLinkTagsForCDNCustomCSS()
    injectScriptTagForCDNCustomJS();
}

function injectScriptTagForCDNCustomJS() {
    // We have decided to rename CDN custom.{css,js} files to external.{css,js}.
    // We may not be able to deploy the package and CDN code simultaneously, so
    // we are setting up a transition phase where we inject script tags for
    // both custom.js and external.js.  After the CDN has been updated with
    // new filenames, we will delete the custom.js <script> tag.s
    const scriptCustom = document.createElement( 'script' );
    scriptCustom.setAttribute( 'src', `${ cdnUrl }/js/custom.js` );
    document.body.appendChild( scriptCustom )

    const scriptExternal = document.createElement( 'script' );
    scriptExternal.setAttribute( 'src', `${ cdnUrl }/js/external.js` );
    document.body.appendChild( scriptExternal );
}

function injectLinkTagsForCDNCustomCSS() {
    [
        'app-colors.css',
        // We have decided to rename CDN custom.{css,js} files to external.{css,js}.
        // We may not be able to deploy the package and CDN code simultaneously, so
        // we are setting up a transition phase where we inject link tags for
        // both custom.css and external.css.  After the CDN has been updated with
        // new filenames, we will delete the custom.css <link> tag.
        'custom.css',
        'external.css',
    ].forEach( file => {
        const link = document.createElement( 'link' );
        link.type = 'text/css';
        link.rel = 'stylesheet';

        document.head.appendChild( link );

        link.href = `${ cdnUrl }/css/${ file }`;
    } );
}
