// / Insert statuspage banner
( function () {
    const alertBannerDiv = document.createElement( 'aside' );
    alertBannerDiv.id = 'nyulibraries-alert-banner';
    alertBannerDiv.className = 'nyulibraries-alert-banner alert-red';
    alertBannerDiv.setAttribute( 'aria-label', 'Service Alert Banner' );
    alertBannerDiv.textContent = 'The catalog is currently experiencing difficulties. ';


    const link = document.createElement( 'a' );
    link.href = 'https://alerts.library.nyu.edu/';
    link.target = '_blank';
    link.textContent = 'See more';

    alertBannerDiv.appendChild( link );

    document.body.insertBefore( alertBannerDiv, document.body.firstChild );
} )();



