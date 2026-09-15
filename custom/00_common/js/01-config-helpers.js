// ****************************************
// 01-config-helpers.js
// ****************************************

/* global window */

// eslint-disable-next-line no-unused-vars
function getCdnUrl( vid ) {
    // Normalize the vid, even though it's theoretically impossible for the vid to
    // not be all uppercase already, given that Primo VE is apparently case-sensitive
    // and will not consider a vid like "01nyu_inst:nyu_dev" to be valid.
    vid = vid.toLocaleUpperCase();

    const CDN_DEV = 'https://cdn-dev.library.nyu.edu/primo-customization';
    const CDN_PROD = 'https://cdn.library.nyu.edu/primo-customization';

    const VID_DEV_SUFFIX = '_DEV';

    const hostname = window.location.hostname;
    const view = parseViewDirectoryName( vid );

    let baseUrl;
    if ( hostname === 'localhost' ) {
        baseUrl = 'http://localhost:3000/primo-customization';
    } else if ( hostname === 'sandbox02-na.primo.exlibrisgroup.com' ) {
        baseUrl = 'https://d290kawcj1dea9.cloudfront.net/primo-customization';
    } else if ( hostname === 'primo-explore-devenv' ) {
        // Running in the headless browser in the Docker Compose `e2e` service.
        baseUrl = 'http://cdn-server:3000/primo-customization';
    } else if ( vid.endsWith( VID_DEV_SUFFIX ) ) {
        baseUrl = CDN_DEV
    } else {
        baseUrl = CDN_PROD;
    }

    return `${ baseUrl }/${ view }`;
}

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}
