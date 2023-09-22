const searchParams = new URLSearchParams( window.location.search );
const vid = searchParams.get( 'vid' );
const cdnUrl = getCdnUrl( vid );

console.log( `[DEBUG] cdnUrl = ${ cdnUrl }` );

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
        ],
    );
} );

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
