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

    const hostname = window.location.hostname;
    const view = parseViewDirectoryName( vid );

    // In some special cases it's possible to determine the baseUrl from the
    // hostname.
    const baseUrl = getBaseUrlForHostname( hostname ) || getBaseUrlForVid( vid );

    return `${ baseUrl }/${ view }`;
}

function getBaseUrlForHostname( hostname ) {
    const hostnameToBaseurlMap = {
        'localhost'            : 'http://localhost:3000/primo-customization', // for local development
        'primo-explore-devenv' : 'http://cdn-server:3000/primo-customization', // for docker-compose
    };

    return hostnameToBaseurlMap[hostname];
}

function getBaseUrlForVid( vid ) {
    const CDN_DEV = 'https://cdn-dev.library.nyu.edu/primo-customization';
    const CDN_PROD = 'https://cdn.library.nyu.edu/primo-customization';

    const VID_DEV_SUFFIX = '_DEV';

    // Special CDN assignments based on exact vid name, not vid name pattern.
    const vidToCdnUrlMap = {
        '01NYU_INST:TESTWS01' : CDN_DEV,
    }

    if ( vid.endsWith( VID_DEV_SUFFIX ) ) {
        return CDN_DEV;
    } else {
        // Couldn't assign CDN based on hostname or vid name pattern.
        // Check vid -> CDN map, and if that doesn't return anything, default to
        // prod CDN.
        return vidToCdnUrlMap[ vid ] || CDN_PROD;
    }
}

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}
