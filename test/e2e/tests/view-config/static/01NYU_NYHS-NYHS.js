const testCases = [
    {
        key             : 'home-page',
        name            : 'Home page',
        queryString     : '',
        elementToTest   : 'prm-static',
        waitForSelector : 'md-card[ data-cy="home-need-help" ]',
    },
    {
        key             : 'no-search-results',
        name            : 'gasldfjlak===asgjlk&&&&!!!!',
        queryString     : 'query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=unified_slot&search_scope=MyInstitution&offset=0',
        elementToTest   : 'prm-no-search-result',
        waitForSelector : 'prm-no-search-result-after',
    },
];

export {
    testCases,
};
