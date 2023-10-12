/* global process require */

import path from 'node:path';

function parseVid( view ) {
    return view.replaceAll( '-', ':' );
}

function getViewConfig( testSuite, view ) {
    return require(
        path.resolve(
            path.join( 'tests', 'view-config', testSuite, view + '.js' ),
        ),
    );
}

// NOTE: it's current not possible to use a custom flag like `--update-golden-files`
// with `playwright`:
// "[Feature] Add support for test.each / describe.each #7036"
// https://github.com/microsoft/playwright/issues/7036
function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
           process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

export {
    getViewConfig,
    parseVid,
    updateGoldenFiles,
};
