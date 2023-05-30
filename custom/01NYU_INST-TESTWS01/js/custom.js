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

        app.component( 'prmSilentLoginAfter', {
            template: `<md-card className="default-card _md md-primoExplore-theme">
    <md-card-title>
        <md-card-title-text>
            <h2 className="md-headline">
                <a href="https://nyu-lib.monday.com/boards/765008773/pulses/4323344372">
                    monday.com: "Prototype dynamic Angular JS
                    for Primo VE"
                </a>
            </h2>
            <h3>Method: [FAIL] \`app.component( 'prmSilentLoginAfter', { template: \`...\`, controller: ...$http.get( [ CDN prm-silent-login-after.html ]'... )\`</h3>
        </md-card-title-text>
    </md-card-title>
    <md-card-content>
        <p>DOES NOT WORK: CDN-HOSTED TEMPLATE HTML IS ESCAPED AND PRINTED AS NORMAL STRING DATA</p>
        <p></p>

        {{ $ctrl.data }}
    </md-card-content>
</md-card>`,
            controller: function( $http ) {
                const that = this;
                $http.get( `${ cdnUrl }/html/prm-silent-login-after.html`,
                    { } )
                    .then(
                        function( response ) {
                            that.data = response.data;
                        },
                        function( response ) {
                            that.data = response.data;
                        },
                    );
            },
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
            bindings   : { parentCtrl: '<' },
            templateUrl: `${ cdnUrl }/html/prm-search-after.html`,
        } );

        app.component( 'prmExploreFooterAfter', {
            template: `<md-card className="default-card _md md-primoExplore-theme">
    <md-card-title>
        <md-card-title-text>
            <h2 className="md-headline">
                <a href="https://nyu-lib.monday.com/boards/765008773/pulses/4323344372">
                    monday.com: "Prototype dynamic Angular JS
                    for Primo VE"
                </a>
            </h2>
            <h3>Method: [OK, but limited] \`app.component( 'prmExploreFooterAfter', { template: \`...\`, controller: ...$http.get( [CDN prm-explore-footer-after.json] )\`</h3>
        </md-card-title-text>
    </md-card-title>
    <md-card-content>
        <p>FILLS IN HTML TEMPLATE WITH DATA FETCHED FROM CDN-HOSTED JSON FILE</p>
        <p></p>

        <p>{{ $ctrl.text }}
    </md-card-content>
</md-card>`,
            controller: function( $http ) {
                const that = this;
                $http.get( `${ cdnUrl }/json/prm-silent-login-after.json`,
                    { } )
                    .then(
                        function( response ) {
                            that.text = response.data.text;
                        },
                        function( response ) {
                            that.text = response.data;
                        },
                    );
            },
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
