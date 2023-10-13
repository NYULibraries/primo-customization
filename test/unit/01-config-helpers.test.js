/* global process, URL */

// ======================================
// Notes about use of eval() in this test
// ======================================
//
// eval() is always a last resort -- see MDN's "Never use eval!":
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
//
// We need to use it here to test customization package code, which unfortunately
// is not organized in a way that it can be imported using `require` or `import`.
// The `gulp` build performed by `primo-explore-devenv` concatenates all the view
// custom JS files into an IIFE in `custom.js`, which is then loaded via <script>
// tag.
//
// The risk of using eval() in our test is very low, as we are executing code
// from a file that we control, and the code is browser JS, so it doesn't perform
// any filesystem operations.

import * as fs from 'node:fs';
import path from 'node:path';
import * as url from 'url';

import { describe, expect, test } from 'vitest'

const __dirname = url.fileURLToPath( new URL( '..', import.meta.url ) );

const ROOT = path.join( __dirname, '..' );
const fileToTest = process.env.CONTAINER_MODE ?
    path.join( '01-config-helpers.js' ) :
    path.join( ROOT, 'custom', '00_common', 'js', '01-config-helpers.js' );

const testCases = {
    'https://hslcat.med.nyu.edu/discovery/search?vid=01NYU_HS:HSL&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_HS-HSL',
    'https://hslcat.med.nyu.edu/discovery/search?vid=01NYU_HS:HSL_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_HS-HSL_DEV',

    'https://localhost:3000/discovery/search?vid=01NYU_INST:NYU&offset=0'      : 'http://localhost:3000/primo-customization/01NYU_INST-NYU',
    'https://localhost:3000/discovery/search?vid=01NYU_INST:NYU_DEV&offset=0'  : 'http://localhost:3000/primo-customization/01NYU_INST-NYU_DEV',
    'https://localhost:3000/discovery/search?vid=01NYU_INST:TESTWS01&offset=0' : 'http://localhost:3000/primo-customization/01NYU_INST-TESTWS01',

    'https://nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU&offset=0'      : 'https://cdn.library.nyu.edu/primo-customization/01NYU_INST-NYU',
    'https://nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU_DEV&offset=0'  : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-NYU_DEV',
    'https://nyu.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:TESTWS01&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01',

    'https://sandbox02-na.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU&offset=0'      : 'https://d290kawcj1dea9.cloudfront.net/primo-customization/01NYU_INST-NYU',
    'https://sandbox02-na.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:NYU_DEV&offset=0'  : 'https://d290kawcj1dea9.cloudfront.net/primo-customization/01NYU_INST-NYU_DEV',
    'https://sandbox02-na.primo.exlibrisgroup.com/discovery/search?vid=01NYU_INST:TESTWS01&offset=0' : 'https://d290kawcj1dea9.cloudfront.net/primo-customization/01NYU_INST-TESTWS01',

    'https://search.abudhabi.library.nyu.edu/discovery/search?vid=01NYU_AD:AD&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_AD-AD',
    'https://search.abudhabi.library.nyu.edu/discovery/search?vid=01NYU_AD:AD_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_AD-AD_DEV',

    'https://search.library.cooper.edu/discovery/search?vid=01NYU_CU:CU&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_CU-CU',
    'https://search.library.cooper.edu/discovery/search?vid=01NYU_CU:CU_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_CU-CU_DEV',

    'https://search.library.newschool.edu/discovery/search?vid=01NYU_TNS:TNS&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_TNS-TNS',
    'https://search.library.newschool.edu/discovery/search?vid=01NYU_TNS:TNS_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_TNS-TNS_DEV',

    'https://search.library.nyhistory.org/discovery/search?vid=01NYU_NYHS:NYHS&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_NYHS-NYHS',
    'https://search.library.nyhistory.org/discovery/search?vid=01NYU_NYHS:NYHS_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_NYHS-NYHS_DEV',

    'https://search.library.nysid.edu/discovery/search?vid=01NYU_NYSID:NYSID&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_NYSID-NYSID',
    'https://search.library.nysid.edu/discovery/search?vid=01NYU_NYSID:NYSID_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_NYSID-NYSID_DEV',

    'https://search.library.nyu.edu/discovery/search?vid=01NYU_INST:NYU&offset=0'      : 'https://cdn.library.nyu.edu/primo-customization/01NYU_INST-NYU',
    'https://search.library.nyu.edu/discovery/search?vid=01NYU_INST:NYU_DEV&offset=0'  : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-NYU_DEV',
    'https://search.library.nyu.edu/discovery/search?vid=01NYU_INST:TESTWS01&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01',

    'https://search.shanghai.library.nyu.edu/discovery/search?vid=01NYU_US:US&offset=0'     : 'https://cdn.library.nyu.edu/primo-customization/01NYU_US-US',
    'https://search.shanghai.library.nyu.edu/discovery/search?vid=01NYU_US:US_DEV&offset=0' : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_US-US_DEV',
};

// Stub for code under test
const window = {
    location : {
        hostname : '',
    },
};

const codeUnderTest = fs.readFileSync( fileToTest, { encoding : 'utf8' } );
// According to MDN documentation for eval(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
// ...using a direct eval is supposed to leak function declarations to the surrounding
// scope.  That doesn't seem to be happening here - perhaps because we're in a Node
// and not browser context?  Indirect eval does leak `getCdnUrl` to global scope,
// but then the code under test loses access to the `window` stub we provide here.
// We stick with direct eval and simply "export" `getCdnUrl` by making it the completion
// value for the eval'ed string.  This is then returned by eval() for us to use
// in our tests.
const getCdnUrl = eval( codeUnderTest + 'getCdnUrl' );

describe( 'getCdnUrl()', () => {
    Object.keys( testCases ).sort().forEach( url => {
        const expected = testCases[ url ];

        // Primo VE is apparently case-sensitive and will not consider a vid like
        // "01nyu_inst:nyu_dev" to be valid (user gets loading diamonds on a
        // white screen of death).
        // Just to be on the safe side, we made `getCdnUrl` case-insensitive,
        // so we need to test all cases.
        describe( url, () => {
            test( `original case: ${ url }`, () => {
                testUrl( url, expected );
            } );

            const urlUpperCase = url.toLocaleUpperCase();
            test( `uppercase: ${ urlUpperCase }`, () => {
                testUrl( urlUpperCase, expected );
            } );

            const urlLowerCase = url.toLocaleLowerCase();
            test( `lowercase: ${ urlLowerCase }`, () => {
                testUrl( urlLowerCase, expected );
            } );
        } );
    } );
} );

function testUrl( url, expected ) {
    const urlObject = new URL( url );
    const domain = urlObject.host;
    const searchParams = urlObject.searchParams;
    // URL might be in all uppercase or lowercase
    const extractedVid = searchParams.get( 'vid' ) || searchParams.get( 'VID' );

    window.location.hostname = domain.replace( ':3000', '' );

    const got = getCdnUrl( extractedVid )

    expect( got ).toBe( expected );
}
