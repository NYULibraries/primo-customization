function injectCDNResourceTags() {
    injectLinkTagForCDNCustomCSS()
    injectScriptTagForCDNCustomJS();
}

function injectScriptTagForCDNCustomJS() {
    const script = document.createElement( 'script' );
    script.setAttribute( 'src', `${ cdnUrl }/js/custom.js` );
    document.body.appendChild( script );
}

function injectLinkTagForCDNCustomCSS() {
    const link = document.createElement( 'link' );
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild( link );

    link.href = `${ cdnUrl }/css/custom.css`;
}
