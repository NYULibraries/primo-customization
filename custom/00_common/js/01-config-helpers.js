// ****************************************
// 01-config-helpers.js
// ****************************************

function getCdnUrl( vid ) {
    const cdnUrls = {
        '01NYU_INST:NYU'     : 'https://cdn.library.nyu.edu/primo-customization',
        '01NYU_INST:NYU_DEV' : 'https://cdn-dev.library.nyu.edu/primo-customization',
        '01NYU_INST:TESTWS01': 'https://cdn-dev.library.nyu.edu/primo-customization',
    }

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
    } else {
        baseUrl = cdnUrls[ vid ] ||
                  cdnUrls[ '01NYU_INST:NYU' ];
    }

    return `${ baseUrl }/${ view }`;
}

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}
