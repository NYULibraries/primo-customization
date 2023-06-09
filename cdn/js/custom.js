function injectStylesheetLinkElement() {
    const link = document.createElement( 'link' );
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild( link );

    link.href = `${ cdnUrl }/css/custom.css`;
}

injectStylesheetLinkElement();
