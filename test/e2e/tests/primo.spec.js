import * as fs from 'node:fs';

import { execSync } from 'child_process';
import { updateGoldenFiles, } from '../testutils/index.js';

const beautifyHtml = require( 'js-beautify' ).html;
const { test, expect } = require( '@playwright/test' );

const view = process.env.VIEW;
const vid = view.replaceAll( '-', ':' );

const testCases = [
    {
        key         : 'libkey-article-search-art',
        name        : 'LibKey for article search: "art"',
        queryString : 'query=any,contains,art&tab=Unified_Slot&search_scope=ARTICLES&offset=0',
    },
    {
        key         : 'home-page',
        name        : 'Home page',
        queryString : '',
    },
    {
        key         : 'no-search-results',
        name        : 'gasldfjlak===asgjlk&&&&!!!!',
        queryString : 'query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&vid=01NYU_INST:NYU_DEV&offset=0',
    },
];

for ( let i = 0; i < testCases.length; i++ ) {
    const testCase = testCases[ i ];

    test.describe( `${testCase.name}`, () => {
        test.beforeEach( async ( { page } ) => {
            let fullQueryString = `?vid=${ vid }`;
            if ( testCase.queryString ) {
                fullQueryString += `&${ testCase.queryString }`;
            }
            await page.goto( fullQueryString );
        } );

        test( 'page HTML matches expected', async ( { page } ) => {
            // Clean actual/ and diffs/ files
            // NOTE:
            // We don't bother with error handling because these files get overwritten
            // anyway, and if there were no previous files, or if a previous cleaning/reset
            // script or process already deleted the previous files, we don't want the errors
            // causing distraction.
            // If deletion fails on existing files, there's a good chance there will
            // be errors thrown later, which will then correctly fail the test.
            const actualFile = `tests/actual/${ view }/${testCase.key}.html`;
            try {
                fs.unlinkSync( actualFile );
            } catch ( error ) {
            }
            const diffFile = `tests/diffs/${ view }/${testCase.key}.txt`;
            try {
                fs.unlinkSync( diffFile );
            } catch ( error ) {
            }

            // await page.waitForSelector( 'a:has-text("Download PDF (via Unpaywall)")' );
            await page.waitForLoadState( 'load' );

            const actual = beautifyHtml( await page.content() );

            const goldenFile = `tests/golden/${ view }/${testCase.key}.html`;
            if ( updateGoldenFiles() ) {
                fs.writeFileSync( goldenFile, actual );

                console.log( `Updated golden file ${goldenFile}` );

                return;
            }
            const golden = beautifyHtml( fs.readFileSync( goldenFile, { encoding : 'utf8' } ) );

            fs.writeFileSync( actualFile, actual );

            const ok = actual === golden;

            let message = `Actual HTML for "${testCase.name}" does not match expected HTML`;
            if ( !ok ) {
                const command = `diff ${goldenFile} ${actualFile} | tee ${diffFile}`;
                let diffOutput;
                try {
                    diffOutput = new TextDecoder().decode( execSync( command ) );
                    message += `

======= BEGIN DIFF OUTPUT ========
${diffOutput}
======== END DIFF OUTPUT =========

[Recorded in diff file: ${diffFile}]`;
                } catch ( e ) {
                    // `diff` command failed to create the diff file.
                    message += `  Diff command \`${command}\` failed:

${e.stderr.toString()}`;
                }
            }

            expect( ok, message ).toBe( true );
        } );
    } )
}






