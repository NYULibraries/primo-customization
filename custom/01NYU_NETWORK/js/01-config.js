const cdnUrls = {
    'localhost'                           : 'http://localhost:3000/primo-customization/01NYU_INST-TESTWS01',
    'nyu.primo.exlibrisgroup.com'         : 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01',
    'sandbox02-na.primo.exlibrisgroup.com': 'https://d290kawcj1dea9.cloudfront.net/primo-customization/01NYU_INST-TESTWS01',
}

const cdnUrl = cdnUrls[ window.location.hostname ] || 'http://localhost:3000/primo-customization/01NYU_INST-TESTWS01';

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
