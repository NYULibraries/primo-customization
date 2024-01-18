/* global process require */

import path from 'node:path';

function getViewConfig( testSuite, view ) {
    return require(
        path.resolve(
            path.join( 'tests', 'view-config', testSuite, view + '.js' ),
        ),
    );
}

function parseVid( view ) {
    return view.replaceAll( '-', ':' );
}

function setPathAndQueryVid( pathAndQuery, vid ) {
    return pathAndQuery.replace( 'vid=[VID]', `vid=${ vid }` );
}

// NOTE: it's current not possible to use a custom flag like `--update-golden-files`
// with `playwright`:
// "[Feature] Add support for test.each / describe.each #7036"
// https://github.com/microsoft/playwright/issues/7036
function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
           process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

// Based on https://playwright.dev/docs/next/network#modify-responses
async function modifyCSPHeader(page) {
    await page.route('/discovery/search?*', async route => {
        const response = await route.fetch();
        const originalHeaders = response.headers();

        // Prepare the modified CSP header, if necessary
        let csp = originalHeaders['content-security-policy'];
        if (csp && csp.includes('upgrade-insecure-requests')) {

            let directives = csp.split(';').map(directive => directive.trim());

            directives = directives.filter(directive => !directive.toLowerCase().includes('upgrade-insecure-requests'));

            csp = directives.join('; ').trim();
        }

        route.fulfill({
            response,
            headers: {
                ...originalHeaders,
                'content-security-policy': csp ? csp : originalHeaders['content-security-policy']
            }
        });
    });
}


export {
    getViewConfig,
    modifyCSPHeader,
    parseVid,
    setPathAndQueryVid,
    updateGoldenFiles
};

