// Option 2 from:
//     https://thirdiron.atlassian.net/wiki/spaces/BrowZineAPIDocs/pages/79200260/Ex+Libris+Primo+Integration

app.controller( 'prmSearchResultAvailabilityLineAfterController', function( $scope, $rootScope ) {
    // BEGIN Generic CDN-based customization stuff moved here from autogenerated directives file.
    const vm = this;

    vm.getPnx = () => {
        try {
            return vm.parentCtrl.item.pnx;
        } catch ( err ) {
            console.log( 'prmSearchResultAvailabilityLineAfter: error accessing `vm.parentCtrl.item.pnx`' );

            return null;
        }
    };

    vm.rootScope = $rootScope;
    vm.scope = $scope;
    // END Generic CDN-based customization stuff moved here from autogenerated directives file.

    // ------- BEGIN: LIBKEY CODE -------
    // Originally the only LibKey code used in this controller after the LibKey
    // configuration code was moved to the CDN was this line:
    //
    //     window.browzine.primo.searchResult( $scope );
    //
    // ...which worked fine when running normally in a browser on Mac, but more
    // often than not error'ed out when running in CircleCI.  Here's one example:
    // https://app.circleci.com/pipelines/github/NYULibraries/primo-customization/126/workflows/68978317-ffe9-43f5-b937-7fa43dc85d96/jobs/106/parallel-runs/0/steps/0-103
    //
    // The error:
    //
    //     TypeError: Cannot read properties of undefined (reading 'searchResult')
    //     at Object.<anonymous> (http://primo-explore-devenv:8003/discovery/custom/01NYU_INST-NYU_DEV/js/custom.js:100:27)
    //
    // This appears to be due to a race condition in which the `prmSearchResultAvailabilityLineAfter`
    // components render before the 3rd party `browzine-primo-adapter.js` <script>
    // injected into <head> executes and adds `browzine` to the `window` object before
    // Primo returns search results.  This could be due to a delay in fetching
    // the script from Third Iron's hosting service, or a delay in injecting the
    // <script> tag, or both.
    //
    // Even before the LibKey configuration and <script> tag injection code was
    // moved to CDN, there were frequently e2e test failures when run in containers
    // (locally, as well as in CircleCI).  Increasing the test timeout seemed
    // to eliminate these failures.  After the code move to CDN, timeout increases
    // no longer seemed to help.
    //
    // Here we use a retry/timeout function which does continuous polling of the
    // DOM to determine when it can do its own DOM manipulations.
    // We set a limit on number of retries and duration of continuous polling,
    // to prevent wasteful infinite looping in the event of failure to load the
    // 3rd-party hosted `browzine-primo-adapter.js`.

    // Limit how long to wait for `browzine-primo-adapter.js` to 15 seconds.
    // Note that we can't use underscore numeric separators (e.g. 5_000 for 5,000) because
    // `primo-explore-devenv`'s `gulp-babel` flags it as a syntax error:
    // "Identifier directly after number"
    const TIMEOUT = 15000;

    let start, previousTimeStamp;
    let numTries = 0;
    let success = false;
    function tryBrowzinePrimoSearchResult( timeStamp ) {
        numTries++;

        if ( start === undefined ) {
            start = timeStamp;
        }
        const elapsed = timeStamp - start;
        if ( elapsed < TIMEOUT ) {
            try {
                window.browzine.primo.searchResult( $scope );
                success = true;
            } catch ( error ) {
                previousTimeStamp = timeStamp;
                window.requestAnimationFrame( tryBrowzinePrimoSearchResult );
            }
        } else {
            console.log( `window.browzine.primo.searchResult( $scope ) failed` +
                         ` after ${ numTries } tries and ${ Math.floor( TIMEOUT / 1000 ) } seconds` )
        }
    }
    window.requestAnimationFrame( tryBrowzinePrimoSearchResult );
    // ------- END: LIBKEY CODE -------
} );

app.component( 'prmSearchResultAvailabilityLineAfter', {
    bindings   : { parentCtrl: '<' },
    controller : 'prmSearchResultAvailabilityLineAfterController',
    // Generic CDN-based customization stuff moved here from autogenerated directives file.
    templateUrl: `${ cdnUrl }/html/prm-search-result-availability-line-after.html`,
} );
