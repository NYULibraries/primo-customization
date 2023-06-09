const cdnUrls = {
    // CloudFront distribution: https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions/E1CAY9LEN0VBFY
    // ...with origin: cdn-local-da70.library.nyu.edu.s3.us-east-1.amazonaws.com
    'localhost'                           : 'https://d27uw5gej4v6yt.cloudfront.net/primo-customization/01NYU_INST-TESTWS01',
    'sandbox02-na.primo.exlibrisgroup.com': 'https://cdn-dev.library.nyu.edu/primo-customization/01NYU_INST-TESTWS01',
}

const cdnUrl = cdnUrls[ window.location.hostname ] || 'https://d2udqvw2vzqson.cloudfront.net/primo-customization/01NYU_INST-TESTWS01';

function injectStylesheetLinkElement() {
    const link = document.createElement( 'link' );
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.head.appendChild( link );

    link.href = `${ cdnUrl }/css/custom.css`;
}

injectStylesheetLinkElement();
