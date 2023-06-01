// Append <script src='[OUR CUSTOMIZATION SCRIPT]'> tag to the end of <body>.
app.run( injectScriptTagForCDNCustomJS );

function injectScriptTagForCDNCustomJS() {
    const script = document.createElement( 'script' );
    script.setAttribute( 'src', `${ cdnUrl }/js/custom.js` );
    document.body.appendChild( script );
}
