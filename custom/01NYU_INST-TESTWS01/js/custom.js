(
    function () {
        'use strict';

        const app = angular.module( 'viewCustom', [ 'angularLoad' ] );

        // const cdnUrl = 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01';
        // const cdnUrl = 'https://s3.amazonaws.com/cdn-sandbox.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01';
        const cdnUrl = 'https://d2udqvw2vzqson.cloudfront.net/primo-customization/01NYU_INST-TESTWS01';

        // This is necessary to allow the `templateURL` method to fetch cross-domain
        // from the CDN.
        app.config( function ( $sceDelegateProvider ) {
            $sceDelegateProvider.trustedResourceUrlList(
                [
                    'self',
                    // Keeping this here commented out as a reminder that "*" can
                    // be used in domain name for wildcarding.
                    // 'https://cdn*.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01/**',
                    `${ cdnUrl }/**`,
                ]
            );
        } );

        // The CDN JS inserts a hidden <div> containing the lorem ipsum HTML we
        // wish to inject.  Use a watcher to detect when the <div> has been
        // rendered, then attempt to take it's `.innerHTML` and put it in
        // `prm-logo-after` element's HTML.  Make sure to disable the watcher
        // after the <div> has appeared.
        app.directive( 'prmExploreMainAfter', function ( $compile ) {
            function link( scope, element ) {
                const elementId = 'prm-explore-main-after-template-div';

                const unbindWatcher = scope.$watch(
                    function () {
                        const hiddenLoremIpsumDiv = document.getElementById( elementId );

                        return hiddenLoremIpsumDiv !== null;
                    },
                    function ( newValue ) {
                        if ( newValue === true ) {
                            const hiddenLoremIpsumDiv = document.getElementById( elementId );

                            element[ 0 ].innerHTML = hiddenLoremIpsumDiv.innerHTML;

                            unbindWatcher();
                        }
                    },
                )
            }

            return {
                restrict : 'E',
                template : '',
                link     : link,
            };
        } );

        // This method does not require any JS from the CDN, only the template HTML file.
        // We would need to register components for every single prm-*-after element
        // in this package.  This JS file appears to have a list of all such "hook" elements:
        // https://sandbox02-na.primo.exlibrisgroup.com/discovery/lib/templates.js
        // Note that the actual file is not available at the above URL.  It can
        // only be accessed via browser dev tools which pull in the code via the
        // source map.
        app.component( 'prmSearchAfter', {
            bindings    : { parentCtrl : `<` },
            templateUrl : `${ cdnUrl }/html/prm-search-after.html`,
        } );

        // Append <script src='[OUR CUSTOMIZATION SCRIPT]'> tag to the end of <body>.
        app.run( injectScriptTagForCDNCustomJS );

        function injectScriptTagForCDNCustomJS() {
            const script = document.createElement( 'script' );
            script.setAttribute( 'src', `${ cdnUrl }/js/custom.js` );
            document.body.appendChild( script );
        }
    }
)();
