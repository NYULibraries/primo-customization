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
        pathAndQuery    : '/discovery/search?vid=[VID]&query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=Unified_Slot&search_scope=DN_and_CI&offset=0',
        elementToTest   : 'prm-no-search-result',
        waitForSelector : 'prm-no-search-result-after',
    },
];

export {
    testCases,
};
