/* global process, require */

const { test, expect } = require( '@playwright/test' );

import { getViewConfig, parseVid } from '../testutils';

const view = process.env.VIEW;
const vid = parseVid( view );

const viewConfig = getViewConfig( 'chat-widget', view );
const testCases = viewConfig.testCases;
if ( testCases.length > 0 ) {
    const CHAT_WIDGET_SELECTOR =
        viewConfig.CHAT_WIDGET_SELECTOR;

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
                let fullQueryString = `?vid=${ vid }`;
                if ( testCase.queryString ) {
                    fullQueryString += `&${ testCase.queryString }`;
                }
                await page.goto( fullQueryString );
            } );

            test( 'chat widget found on page', async ( { page } ) => {
                await page.locator( CHAT_WIDGET_SELECTOR ).waitFor();

                // If we got this far, just pass the test.  Usually the chat
                // widgets are third-party: do we want to test their functionality?
                // Within limits, of course...we wouldn't want to engage live
                // staffers responsible for responding to chat requests.
                expect( true ).toBe( true );
            } );
        } ) // End `test.describe(...)`
    } // End `testCases` for-loop
} // End `if ( testCases.length > 0 ) {...}`
