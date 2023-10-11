/* global process */

import path from 'node:path';

function getViewConfigFile( testSuite, view ) {
    return path.resolve(
        path.join( 'tests', 'view-config', testSuite, view + '.js' ),
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
    getViewConfigFile,
    updateGoldenFiles,
};
