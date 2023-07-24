const browzineConfig = {
    journalBrowZineWebLinkText : '[THIS IS AN OVERRIDE FROM CDN custom.js] View Journal Contents',

    articleBrowZineWebLinkText : '[THIS IS AN OVERRIDE FROM CDN custom.js] View Issue Contents',

    articlePDFDownloadLinkText : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF',

    articleRetractionWatchText : '[THIS IS AN OVERRIDE FROM CDN custom.js] Retracted Article',

    articlePDFDownloadViaUnpaywallText                   : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF (via Unpaywall)',
    articleLinkViaUnpaywallText                          : '[THIS IS AN OVERRIDE FROM CDN custom.js] Read Article (via Unpaywall)',
    articleAcceptedManuscriptPDFViaUnpaywallText         : '[THIS IS AN OVERRIDE FROM CDN custom.js] Download PDF (Accepted Manuscript via Unpaywall)',
    articleAcceptedManuscriptArticleLinkViaUnpaywallText : '[THIS IS AN OVERRIDE FROM CDN custom.js] Read Article (Accepted Manuscript via Unpaywall)',
}

Object.assign( window.browzine, browzineConfig );
