/* global process, require */

const { test, expect } = require( '@playwright/test' );

import { getViewConfig, parseVid, setPathAndQueryVid } from '../testutils';

const view = process.env.VIEW;
const vid = parseVid( view );

const viewConfig = getViewConfig( 'statuspage-embed', view );
const testCases = viewConfig.testCases;
if ( testCases.length > 0 ) {
    const STATUSPAGE_EMBED_SELECTOR =
        viewConfig.STATUSPAGE_EMBED_SELECTOR;

    for ( let i = 0; i < testCases.length; i++ ) {
        const testCase = testCases[ i ];

        test.describe( `${ view }: ${ testCase.name }`, () => {
            // Tests running in container sometimes take longer and require a
            // higher timeout value.  These tests have timed out in containers in
            // both `test.beforeEach()` and the test itself, so we need to increase
            // the timeout for everything in `test.describe()`.
            if ( process.env.CONTAINER_MODE ) {
                test.slow();
            }

            test.beforeEach( async ( { page } ) => {
                await page.goto( setPathAndQueryVid( testCase.pathAndQuery, vid ) );
            } );

            test( 'StatusPage Embed found on page', async ( { page } ) => {
                // Can't use `waitFor()` with no options because the default state
                // that is waited for is "visible", and <script> tags are never
                // visible.
                await page.locator( STATUSPAGE_EMBED_SELECTOR ).waitFor( {  state : 'attached' } );

                // If we got this far, just pass the test.  We can't test the
                // results of statuspage-embed because we always use the prod
                // version, and we can't manipulate the prod content for testing
                // purposes.
                expect( true ).toBe( true );
            } );
        } ) // End `test.describe(...)`
    } // End `testCases` for-loop
} // End `if ( testCases.length > 0 ) {...}`
