const cdnUrls = {
    // CloudFront distribution: https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/E1CAY9LEN0VBFY
    // ...with origin: cdn-local-da70.library.nyu.edu.s3.us-east-1.amazonaws.com
    'localhost'                           : 'https://d27uw5gej4v6yt.cloudfront.net/primo-customization/01NYU_INST-TESTWS01',
    'sandbox02-na.primo.exlibrisgroup.com': 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01',
}

const cdnUrl = cdnUrls[ window.location.hostname ] || 'https://d2udqvw2vzqson.cloudfront.net/primo-customization/01NYU_INST-TESTWS01';

const loremIpsumHtml = `<p>
    <a href="https://bobcat.library.nyu.edu/primo-explore/search?query=any,contains,Lorem%20ipsum&amp;tab=all&amp;search_scope=all&amp;vid=NYU&amp;offset=0"
       target="_blank" rel="noopener noreferrer">Lorem ipsum</a> dolor sit amet,
    consectetur adipiscing elit. Donec nisi diam, bibendum id ex nec, convallis
    ultricies dolor: <br></p>
Praesent accumsan ut ipsum vel maximus.
In vehicula accumsan ipsum, volutpat commodo arcu.
Integer eleifend consequat semper.
<ul>
    <li>Praesent accumsan ut ipsum vel maximus. <br></li>
    <li>In vehicula accumsan ipsum, volutpat commodo arcu. <br></li>
    <li>Integer eleifend consequat semper.<br></li>
</ul>`;

function getLoremIpsumMdCardHtml( method ) {
    return `<md-card class="default-card _md md-primoExplore-theme">
            <md-card-title>
                <md-card-title-text>
                    <h2 class="md-headline">
                        <a href="https://nyu-lib.monday.com/boards/765008773/pulses/4323344372">
                        monday.com: "Prototype dynamic Angular JS for Primo VE"
                        </a>
                    </h2>
                    <h3>Method: ${ method }</h3>
                </md-card-title-text>
            </md-card-title>
            <md-card-content>
                ${ loremIpsumHtml }
            </md-card-content>
        </md-card>`;
}

// monday.com: "Prototype dynamic Angular JS for Primo VE"
// https://nyu-lib.monday.com/boards/765008773/pulses/4323344372
function injectHtml() {
    injectHtml_AddHiddenDivWatchedByCustomDirective();
    injectHtml_NewAngularJSComponent_DOES_NOT_WORK();
    injectHtml_VanillaJS();
}

function injectHtml_AddHiddenDivWatchedByCustomDirective() {
    const loremIpsumDiv = document.createElement( 'div' );

    loremIpsumDiv.innerHTML = getLoremIpsumMdCardHtml(
        '[OK] `prmExploreMainAfter` custom directive in customization package pulls HTML from hidden div element inserted by CDN script',
    );

    loremIpsumDiv.id = 'prm-explore-main-after-template-div';
    loremIpsumDiv.style.visibility = 'hidden';

    document.body.appendChild( loremIpsumDiv );
}

function injectHtml_NewAngularJSComponent_DOES_NOT_WORK() {
    const app = angular.module( 'viewCustom', [ 'angularLoad' ] );

    app.component( 'loremIpsum', {
        template: getLoremIpsumMdCardHtml(
            '[FAIL] CDN script creates component `prmBackToLibrarySearchButtonAfter`',
        ),
    } );

    app.component( 'prmBackToLibrarySearchButtonAfter', {
        bindings: { parentCtrl: '<' },
        template: '<lorem-ipsum></lorem-ipsum>',
    } );
}

function injectHtml_VanillaJS() {
    const targetPrimoElement = document.getElementsByTagName(
        'prm-back-to-library-search-button-after',
    )[ 0 ];

    const loremIpsumDiv = document.createElement( 'div' );

    loremIpsumDiv.innerHTML = getLoremIpsumMdCardHtml(
        '[OK] CDN script uses vanilla JS to insert a div into `prm-back-to-library-search-button-after`',
    );

    targetPrimoElement.appendChild( loremIpsumDiv );
}

// monday.com: "Prototype dynamic CSS for Primo VE"
// https://nyu-lib.monday.com/boards/765008773/pulses/4322790168
function injectStylesheetLinkElement() {
    const link = document.createElement( 'link' );
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild( link );

    link.href = `${ cdnUrl }/css/custom.css`;
}

injectStylesheetLinkElement();

// This will attempt to insert HTML using multiple methods.
injectHtml();

