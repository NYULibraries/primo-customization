const CDN_MANIFEST_FILE = 'manifest.json';

async function getCdnManifest() {
    const cndManifestUrl = `${ cdnUrl }/${ CDN_MANIFEST_FILE }`;

    const response = await fetch( cndManifestUrl );

    return await response.json();
}

async function generateCustomDirectivesForCdnTemplateHtmlFiles() {
    const manifest = await getCdnManifest();

    const customDirectiveIds = manifest.html.map( htmlFile => {
        return htmlFile.replace( /\.html$/, '' );
    } );

    // Source: answer by kanine
    // https://stackoverflow.com/questions/57556471/convert-kebab-case-to-camelcase-with-javascript
    function convertKebabCaseToCamelCase( string ) {
        return string.replace( /-./g, x => x[ 1 ].toUpperCase() );
    }

    customDirectiveIds.forEach( customDirectiveId => {
        const componentName = convertKebabCaseToCamelCase( customDirectiveId );

        app.component( componentName, {
            bindings   : { parentCtrl: '<' },
            templateUrl: `${ cdnUrl }/html/${ customDirectiveId }.html`,
        } );
    } );
}

generateCustomDirectivesForCdnTemplateHtmlFiles();


