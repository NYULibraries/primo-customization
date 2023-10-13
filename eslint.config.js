import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions : {
            ecmaVersion : 'latest',
        },
        rules : {
            // ESlint only
            'indent' : [ 'error', 4 ],
            'quotes' : [ 'error', 'single' ],

            // Shared with Vue
            'array-bracket-newline'   : [ 'error', 'consistent' ],
            'array-bracket-spacing'   : [ 'error', 'always' ],
            'array-element-newline'   : [ 'error', 'consistent' ],
            'arrow-spacing'           : [ 'error', { 'before' : true, 'after' : true } ],
            'block-spacing'           : [ 'error', 'always' ],
            'brace-style'             : [ 'error', '1tbs' ],
            'comma-dangle'            : [ 'error', 'always-multiline' ],
            'comma-spacing'           : [ 'error', { 'before' : false, 'after' : true } ],
            'comma-style'             : [ 'error', 'last' ],
            'dot-location'            : [ 'error', 'property' ],
            'func-call-spacing'       : [ 'error', 'never' ],
            'key-spacing'             : [ 'error', { afterColon : true, align : 'colon', beforeColon : true } ],
            'keyword-spacing'         : [ 'error', { before : true } ],
            'max-len'                 : [ 'warn', { code : 80, tabWidth : 4 } ],
            'multiline-ternary'       : [ 'error', 'always-multiline' ],
            'no-extra-parens'         : [ 'error', 'all' ],
            'object-curly-newline'    : [ 'error', { multiline : true, consistent : true } ],
            'object-curly-spacing'    : [ 'error', 'always' ],
            'object-property-newline' : [ 'error', { allowAllPropertiesOnSameLine : true } ],
            'operator-linebreak'      : [ 'error', 'after' ],
            'space-in-parens'         : [ 'error', 'always' ],
            'space-infix-ops'         : [ 'error' ],
            'space-unary-ops'         : [ 'error', { words : true, nonwords : false } ],
            'template-curly-spacing'  : [ 'error', 'always' ],
        },
    },
];
