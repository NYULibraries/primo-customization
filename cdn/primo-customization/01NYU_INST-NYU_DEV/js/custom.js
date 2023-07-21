const browzineConfig = {
    journalCoverImagesEnabled: true,

    journalBrowZineWebLinkTextEnabled: true,
    journalBrowZineWebLinkText       : '[THIS IS AN OVERRIDE FROM CDN custom.js] View Journal Contents',

    articleBrowZineWebLinkTextEnabled: true,
    articleBrowZineWebLinkText       : '[THIS IS AN OVERRIDE FROM CDN custom.js] View Issue Contents',

    articlePDFDownloadLinkEnabled: true,
    articlePDFDownloadLinkText   : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF',

    articleLinkEnabled: true,
    articleLinkText   : 'Read Article',

    printRecordsIntegrationEnabled: true,
    showFormatChoice              : true,
    showLinkResolverLink          : true,
    enableLinkOptimizer           : true,

    articleRetractionWatchEnabled: true,
    articleRetractionWatchText   : '[THIS IS AN OVERRIDE FROM CDN custom.js] Retracted Article',

    // See https://nyu-lib.monday.com/boards/765008773/pulses/4770873703/posts/2283414551
    // for details on `unpaywallEmailAddressKey`.
    unpaywallEmailAddressKey                               : 'fakeuser@nyu.edu',
    articlePDFDownloadViaUnpaywallEnabled                  : true,
    articlePDFDownloadViaUnpaywallText                     : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF (via Unpaywall)',
    articleLinkViaUnpaywallEnabled                         : true,
    articleLinkViaUnpaywallText                            : '[THIS IS AN OVERRIDE FROM CDN custom.js] Read Article (via Unpaywall)',
    articleAcceptedManuscriptPDFViaUnpaywallEnabled        : true,
    articleAcceptedManuscriptPDFViaUnpaywallText           : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF (Accepted Manuscript via Unpaywall)',
    articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
    articleAcceptedManuscriptArticleLinkViaUnpaywallText   : '[THIS IS AN OVERRIDE FROM CDN custom.js] Read Article (Accepted Manuscript via Unpaywall)',
}

Object.assign( window.browzine, browzineConfig );
