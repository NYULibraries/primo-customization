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
    const view = parseViewDirectoryName( vid );

    const cdnUrls = {
        'localhost': {
            '01NYU_INST:NYU'    : 'http://localhost:3000/primo-customization',
            '01NYU_INST:NYU_DEV': 'http://localhost:3000/primo-customization',
        },
        'nyu.primo.exlibrisgroup.com': {
            '01NYU_INST:NYU'    : 'https://cdn.library.nyu.edu/primo-customization',
            '01NYU_INST:NYU_DEV': 'https://cdn-dev.library.nyu.edu/primo-customization',
        },
        'sandbox02-na.primo.exlibrisgroup.com': {
            '01NYU_INST:NYU'    : 'https://d290kawcj1dea9.cloudfront.net/primo-customization',
            '01NYU_INST:NYU_DEV': 'https://d290kawcj1dea9.cloudfront.net/primo-customization',
        },
    };

    const baseUrl = cdnUrls[ window.location.hostname ][ vid ] ||
                    cdnUrls[ 'localhost' ][ '01NYU_INST:NYU_DEV' ];

    return `${ baseUrl }/${ view }`;
}

function parseViewDirectoryName( vid ) {
    return vid.replaceAll( ':', '-' );
}
