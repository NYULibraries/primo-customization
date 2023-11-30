const testCases = [
    {
        key             : 'home-page',
        name            : 'Home page',
        pathAndQuery    : '/discovery/search?vid=[VID]',
        elementToTest   : 'prm-static',
        waitForSelector : 'md-card[ data-cy="home-additional-options" ]',
    },
];

export {
    testCases,
};

