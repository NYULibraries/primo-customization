async function generateCustomDirectivesForCdnTemplateHtmlFiles() {
    const listFilesFunctionUrl = `${ cdnUrl }/html/list-files`;

    const response = await fetch( listFilesFunctionUrl );

    const customDirectiveIds = await response.json();

    // Source: answer by kanine
    // https://stackoverflow.com/questions/57556471/convert-kebab-case-to-camelcase-with-javascript
    function convertKebabCaseToCamelCase( string ) {
        return string.replace( /-./g, x => x[ 1 ].toUpperCase() );
    }

    customDirectiveIds.forEach( customDirectiveId => {
        const componentName = convertKebabCaseToCamelCase( customDirectiveId );

        if ( EXCLUDED_IDS[ customDirectiveId ] ) {
            return;
        }

        app.component( componentName, {
            bindings   : { parentCtrl: '<' },
            templateUrl: `${ cdnUrl }/html/${ customDirectiveId }.html`,
        } );
    } );
}

generateCustomDirectivesForCdnTemplateHtmlFiles();


