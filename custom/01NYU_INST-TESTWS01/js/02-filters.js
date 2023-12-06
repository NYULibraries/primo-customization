// ****************************************
// 02-filters.js
// ****************************************

/* global app */

app.filter( 'encodeURIComponent', [
    '$window', function ( $window ) {
        return $window.encodeURIComponent;
    },
] );
