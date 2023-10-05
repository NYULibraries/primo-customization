// ****************************************
// 02-filters.js
// ****************************************

app.filter( 'encodeURIComponent', [
    '$window', function ( $window ) {
        return $window.encodeURIComponent;
    },
] );
