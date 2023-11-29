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

function injectStatusEmbed() {
    // Always use prod URL for all views:
    // https://nyu-lib.monday.com/boards/765008773/pulses/5525193850/posts/2571053345
    const STATUS_EMBED_PROD_URL
        = 'https://cdn.library.nyu.edu/statuspage-embed/index.min.js';
    const scriptTag = document.createElement( 'script' );
    scriptTag.setAttribute( 'src', STATUS_EMBED_PROD_URL );
    document.body.appendChild( scriptTag )
}

configureAndInjectLibKey();
injectStatusEmbed();

function findingAidsLinkClickHandler( event ) {
    event.stopPropagation();
}

// chatwidget-embed
( function () {
    var s = document.createElement( 'script' );
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdn.library.nyu.edu/chatwidget-embed/index.min.js';
    var x = document.getElementsByTagName( 'script' )[0];
    x.parentNode.insertBefore( s, x );
} )();