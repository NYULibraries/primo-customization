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
    const scriptExternal = document.createElement( 'script' );
    scriptExternal.setAttribute( 'src', `${ cdnUrl }/js/external.js` );
    document.body.appendChild( scriptExternal );
}

function injectLinkTagsForCDNCustomCSS() {
    [
        'app-colors.css',
        'external.css',
    ].forEach( file => {
        const link = document.createElement( 'link' );
        link.type = 'text/css';
        link.rel = 'stylesheet';

        document.head.appendChild( link );

        link.href = `${ cdnUrl }/css/${ file }`;
    } );
}
