// Option 2 from:
//     https://thirdiron.atlassian.net/wiki/spaces/BrowZineAPIDocs/pages/79200260/Ex+Libris+Primo+Integration
function configureAndInjectLibKey() {
// Begin BrowZine - Primo Integration...
    window.browzine = {
        api    : 'https://public-api.thirdiron.com/public/v1/libraries/177',
        apiKey : '4997c984-6148-41db-a3d4-f1dc44c5602a',

        journalCoverImagesEnabled : true,

        journalBrowZineWebLinkTextEnabled : true,
        journalBrowZineWebLinkText        : 'View Journal Contents',

        articleBrowZineWebLinkTextEnabled : true,
        articleBrowZineWebLinkText        : 'View Issue Contents',

        articlePDFDownloadLinkEnabled : true,
        articlePDFDownloadLinkText    : 'Download PDF',

        articleLinkEnabled : true,
        articleLinkText    : 'Read Article',

        printRecordsIntegrationEnabled : true,
        showFormatChoice               : true,
        showLinkResolverLink           : true,
        enableLinkOptimizer            : true,

        articleRetractionWatchEnabled : true,
        articleRetractionWatchText    : 'Retracted Article',

        // See https://nyu-lib.monday.com/boards/765008773/pulses/4770873703/posts/2283414551
        // for details on `unpaywallEmailAddressKey`.
        unpaywallEmailAddressKey                                : 'fakeuser@nyu.edu',
        articlePDFDownloadViaUnpaywallEnabled                   : true,
        articlePDFDownloadViaUnpaywallText                      : 'Download PDF (via Unpaywall)',
        articleLinkViaUnpaywallEnabled                          : true,
        articleLinkViaUnpaywallText                             : 'Read Article (via Unpaywall)',
        articleAcceptedManuscriptPDFViaUnpaywallEnabled         : true,
        articleAcceptedManuscriptPDFViaUnpaywallText            : 'Download PDF (Accepted Manuscript via Unpaywall)',
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled : true,
        articleAcceptedManuscriptArticleLinkViaUnpaywallText    : 'Read Article (Accepted Manuscript via Unpaywall)',
    };

    browzine.script = document.createElement( 'script' );
    browzine.script.src = 'https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js';
    document.head.appendChild( browzine.script );
}

function insertChatWidgetEmbed() {
    // Always use prod URL for all views.
    const CHATWIDGET_EMBED_PROD_URL =
        'https://cdn.library.nyu.edu/chatwidget-embed/index.min.js';
    const scriptTag = document.createElement( 'script' );
    scriptTag.setAttribute( 'src', CHATWIDGET_EMBED_PROD_URL );
    document.body.appendChild( scriptTag )
}

// out-of-the-box script except for siteId var
function injectMatomo( siteId ) {
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push( [ 'trackPageView' ] );
    _paq.push( [ 'enableLinkTracking' ] );
    (
        function () {
            var u = 'https://nyulib.matomo.cloud/';
            _paq.push( [ 'setTrackerUrl', u + 'matomo.php' ] );
            _paq.push( [ 'setSiteId', siteId ] );
            var d = document, g = d.createElement( 'script' ),
                s = d.getElementsByTagName( 'script' )[ 0 ];
            g.async = true;
            g.src = '//cdn.matomo.cloud/nyulib.matomo.cloud/matomo.js';
            s.parentNode.insertBefore( g, s );
        }
    )();
}

function injectStatusEmbed() {
    // Always use prod URL for all views:
    // https://nyu-lib.monday.com/boards/765008773/pulses/5525193850/posts/2571053345
    const STATUS_EMBED_PROD_URL =
        'https://cdn.library.nyu.edu/statuspage-embed/index.min.js';
    const scriptTag = document.createElement( 'script' );
    scriptTag.setAttribute( 'src', STATUS_EMBED_PROD_URL );
    document.body.appendChild( scriptTag )
}

// This function has been made identical for all NYU views in order to make the
// custom JS file as pseudo-DRY as possible, allowing us to make changes to one
// view's JS file and simply copy it as-is into the other views.  Toward this
// end, we need a full map of vids to Matomo siteIds, even though technically
// each view only needs to know about its own 2-3 siteIds.
function installMatomo() {
    // Source:
    //     "Matomo JS Tracking Codes for Primo VE NYU Views"
    //     https://docs.google.com/document/d/1Rmmn1q7zNJxm-Ps0uyxbZ1o_GH4YY8hSUFUgQF9AgmU/edit#heading=h.ovisp1bygp5s
    const SITE_ID = {
        '01NYU_AD:AD'     : '7',
        '01NYU_AD:AD_DEV' : '10',

        '01NYU_INST:NYU'     : '6',
        '01NYU_INST:NYU_DEV' : '9',

        '01NYU_US:SH'     : '8',
        '01NYU_US:SH_DEV' : '11',
    }

    // determine vid from querystring
    // note that this will fail in IE 11 and Opera Mini: https://caniuse.com/urlsearchparams
    const vid =
        new URLSearchParams( window.location.search )
            .get( 'vid' );
    console.log( '[DEBUG] vid = ' + vid );

    // if we're on localhost or primo-explore-devenv, don't install
    if ( location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'primo-explore-devenv' ) {
        return;
    }

    const siteId = SITE_ID[ vid ];
    if ( !siteId ) {
        console.error( `[ERROR] No siteId found for vid=${ vid }` );
        return;
    }

    console.log( '[DEBUG] matomo siteId = ' + siteId );

    injectMatomo( siteId );
}

// ****************************************
// Event handlers
// ****************************************

// used in html/prm-brief-result-after.html
function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
}

// ****************************************
// MAIN
// ****************************************

configureAndInjectLibKey();
insertChatWidgetEmbed();
injectStatusEmbed();
installMatomo();
