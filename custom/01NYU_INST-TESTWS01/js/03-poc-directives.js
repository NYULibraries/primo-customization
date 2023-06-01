// This method uses built-in AngularJS `$http.get` to fetch a CDN-hosted
// JSON file containing plain text and populates an HTML template that is
// fixed in structure.  It does not appear to be possible to fetch HTML
// from the CDN and have it be rendered as HTML in the template using this
// particular method.  The `prmSilentLoginAfter` method attempts to do this
// and fails.
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
        <p style="color:blue">PARTIAL SUCCESS: FILLS IN HTML TEMPLATE WITH DATA FETCHED FROM CDN-HOSTED JSON FILE</p>
        <p></p>

        <p>{{ $ctrl.text }}
    </md-card-content>
</md-card>`,
    controller: function ( $http ) {
        const that = this;
        $http.get(
            `${ cdnUrl }/json/prm-silent-login-after.json`,
            {},
        )
            .then(
                function ( response ) {
                    that.text = response.data.text;
                },
                function ( response ) {
                    that.text = response.data;
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
        restrict: 'E',
        template: '',
        link    : link,
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

// This method uses built-in AngularJS `$http.get` to fetch a CDN-hosted
// HTML file and attempts to insert it into the template.  It does not
// appear to be possible to fetch HTML from the CDN and have it be rendered
// as HTML in the template using this particular method.
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
        <p style="color:red">FAIL: CDN-HOSTED TEMPLATE HTML IS ESCAPED AND PRINTED AS NORMAL STRING DATA</p>
        <p></p>

        {{ $ctrl.data }}
    </md-card-content>
</md-card>`,
    controller: function ( $http ) {
        const that = this;
        $http.get(
            `${ cdnUrl }/html/prm-silent-login-after.html`,
            {},
        )
            .then(
                function ( response ) {
                    that.data = response.data;
                },
                function ( response ) {
                    that.data = response.data;
                },
            );
    },
} );
