import fs from 'node:fs';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

import newSystemConfig from '../eslint.config.js';

// The 1st element in `newSystemConfig` is the official `js.configs.recommended` object.
// The 2nd element in `newSystemConfig` is the custom configuration object.
// We need to merge them manually for the old system, which expects an object.
// for CommonJS style importing.
const config = { ...newSystemConfig[ 0 ], ...newSystemConfig[ 1 ] };

// This is the configuration using the old system that is soon to be deprecated.
const oldSystemConfig = {
    parserOptions: {
        ecmaVersion: config.languageOptions.ecmaVersion,
    },
    rules: config.rules,
}

const eslintrcCode = `// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// SEE README.MD FOR INSTRUCTIONS ON HOW TO REGENERATE THIS FILE.

module.exports = ${ JSON.stringify( oldSystemConfig, null, '    ' ) }
;
`

const eslintrcFile = path.join( __dirname, '..', '.eslintrc.cjs' );

fs.writeFileSync(
    eslintrcFile,
    eslintrcCode,
    { encoding: 'utf8' },
);

