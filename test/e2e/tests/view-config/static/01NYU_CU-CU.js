const testCases = [
    {
        key             : 'home-page',
        name            : 'Home page',
        pathAndQuery    : '/discovery/search?vid=[VID]',
        elementToTest   : 'prm-static',
        waitForSelector : 'md-card[ data-cy="home-need-help" ]',
    },
    {
        key             : 'no-search-results',
        name            : 'gasldfjlak===asgjlk&&&&!!!!',
        pathAndQuery    : '/discovery/search?query=any,contains,gasldfjlak===asgjlk&&&&!!!!&tab=CentralIndex&search_scope=MyInst_and_CI&vid=[VID]&offset=0',
        elementToTest   : 'prm-no-search-result',
        waitForSelector : 'prm-no-search-result-after',
    },
];

export {
    testCases,
};
