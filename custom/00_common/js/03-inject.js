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
    const script = document.createElement( 'script' );
    script.setAttribute( 'src', `${ cdnUrl }/js/custom.js` );
    document.body.appendChild( script );
}

function injectLinkTagsForCDNCustomCSS() {
    [ 'app-colors.css', 'custom.css' ].forEach( file => {
        const link = document.createElement( 'link' );
        link.type = 'text/css';
        link.rel = 'stylesheet';

        document.head.appendChild( link );

        link.href = `${ cdnUrl }/css/${ file }`;
    } );
}
