import * as fs from 'node:fs';
import { EOL } from 'node:os';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname, '..' );

const CDN_ROOT = path.join( ROOT, 'cdn', 'primo-customization' );
const CUSTOM_PACKAGE_JS_FILE = path.join( ROOT, 'custom/00_common/js/05-autogenerated-custom-directives.js' );
const EXLIBRIS_TEMPLATE_CACHE_CODE_FILE = path.join( ROOT, 'scripts/exlibris-template-cache-code.txt' );
const PARENT_CTRL_ATTRIBUTE_REGEXP = new RegExp( /parent-ctrl="\$ctrl"/ );

const CDN_VIEWS = [
    '01NYU_INST-NYU',
    '01NYU_INST-NYU_DEV',
    '01NYU_INST-TESTWS01',
];

const EXCLUDED_CUSTOM_DIRECTIVES = {
    'prm-search-result-availability-line-after' : {
        excludeFromCdn: false,
    },
};

const lines = fs.readFileSync( EXLIBRIS_TEMPLATE_CACHE_CODE_FILE, { encoding: 'utf8' } )
    .toString()
    .split( EOL );

const idsObject = {};
lines.forEach( line => {
    if ( !line.startsWith( '$templateCache.put' ) ) {
        return;
    }

    if ( line.match( PARENT_CTRL_ATTRIBUTE_REGEXP ) ) {
        const extractedIds = extractIds( line );
        if ( extractedIds.length > 0 ) {
            extractedIds.forEach( extractedId => {
                idsObject[ extractedId ] = true;
            } );
        }
    }
} );

const ids = Object.keys( idsObject ).sort();

writeCustomPackageJsFile( CUSTOM_PACKAGE_JS_FILE, ids );

CDN_VIEWS.forEach( cdnView => {
    writeCdnHtmlFiles( CDN_ROOT, cdnView, ids );
} );

// Source: answer by kanine
// https://stackoverflow.com/questions/57556471/convert-kebab-case-to-camelcase-with-javascript
function convertKebabCaseToCamelCase( string ) {
    return string.replace( /-./g, x => x[ 1 ].toUpperCase() );
}

function extractIds( line ) {
    const [ html ] = line.match( /<.*>/ );

    const elements = html.match( /<.*?>/g );

    const idsObject = {};
    for ( let i = 0; i < elements.length; i++ ) {
        const element = elements[ i ];

        // Example: <prm-account-after parent-ctrl="$ctrl">
        if ( element.match( PARENT_CTRL_ATTRIBUTE_REGEXP ) ) {
            const [ skip, id ] = element.match( /^<([a-zA-Z-]+) / );

            idsObject[ id ] = true;
        }
    }

    return Object.keys( idsObject ).sort();
}

function writeCdnHtmlFiles( cdnRoot, view, ids ) {
    const htmlDir = path.join( cdnRoot, view, 'html' );
    const existingHtmlFiles = fs.readdirSync( htmlDir );

    ids.forEach( id => {
        const htmlFile = `${ id }.html`;
        const filePath = path.join( htmlDir, htmlFile );

        if ( existingHtmlFiles.includes( htmlFile ) ) {
            // Delete if existing HTML file is no longer allowed.
            if ( EXCLUDED_CUSTOM_DIRECTIVES[ id ]?.excludeFromCdn ) {
                fs.unlinkSync( filePath );
            }

            return;
        }

        if ( EXCLUDED_CUSTOM_DIRECTIVES[ id ]?.excludeFromCdn ) {
            return;
        }

        fs.closeSync( fs.openSync( filePath, 'w' ) )
    } );
}

function writeCustomPackageJsFile( customPackageJsFile, ids ) {
    let js = `// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// SEE README.MD FOR INSTRUCTIONS ON HOW TO REGENERATE THIS FILE.

function generateAllPossibleCustomDirectives() {
`;

    ids.forEach( id => {
        if ( id in EXCLUDED_CUSTOM_DIRECTIVES ) {
            return;
        }

        const camelCaseId = convertKebabCaseToCamelCase( id );

        // Updating and re-deploying customization packages is a laborious process
        // that can't be fully automated (which is why we are using this particular
        // customization system).  We don't want to have to go through that process
        // every time we edit code comments, so we keep the comments for the generated
        // code here in the script.  Notes:
        //
        // - It is a common convention to use `vm` alias for `this` in the
        //   controller constructor.  The aliasing is necessary for avoid `this`
        //   problems when defining behaviors.  In templates, `$ctrl` is a
        //   commonly used alias as it is the default when using AngularJS
        //   "controller as" syntax.
        //
        // - `parentCtrl` is added to `vm` after the constructor function creates
        //   the new controller instance for the component, and thus us referenced
        //   as `$ctrl.parentCtrl` in the template.
        //
        // - We inject `$scope` and `$rootScope` are in case we ever need them in
        //   the templates.  While it is considered good practice to avoid using
        //   them, and in fact we don't yet have a known use case which requires
        //   them, because we are prioritizing keeping editing and re-deployment
        //   of customization packages to an absolute minimum, we proactively
        //   inject them on the off chance we might need them later.  Note that
        //   currently `$rootScope == $scope.$root`, but we provide both `$scope`
        //   and `$rootScope` separately for both convenience, and again,
        //   "just in case" (the `$root` pointer disappears, or changes from a
        //   reference to a copy, etc.).
        //
        // - Templates can access `pnx` through `$ctrl.parentCtrl.item.pnx`,
        //   but we provide `getPnx` anyway for convenience.  Note that `item.pnx`
        //   is not defined for all custom components, so we use try/catch to
        //   prevent access errors from potentially breaking customization, and
        //   we for now we also log the error for easy identification of components
        //   where `pnx` read errors occur.
        const componentJs =
            `    app.component( '${ camelCaseId }', {
        bindings  : { parentCtrl: '<' },
        controller: function( $scope, $rootScope ) {
            const vm = this;

            vm.getPnx = () => {
                try {
                    const pnx = vm.parentCtrl.item.pnx;

                    return pnx;
                } catch ( err ) {
                    console.log( '${ camelCaseId }: error accessing \`vm.parentCtrl.item.pnx\`' );

                    return null;
                }
            };

            vm.rootScope = $rootScope;
            vm.scope = $scope;
        },
        templateUrl: \`\${ cdnUrl }/html/${ id }.html\`,
    } );`;

        js += `    // ${ id.toUpperCase() }
${ componentJs }

`
    } );

    js += `
}

generateAllPossibleCustomDirectives();
`

    fs.writeFileSync( customPackageJsFile, js, { encoding: 'utf8' } );
}
