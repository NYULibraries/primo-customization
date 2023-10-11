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
        queryString     : 'query=any,contains,gasldfjlak%3D%3D%3Dasgjlk%26%26%26%26!!!!&tab=default_slot&search_scope=CI_NYUAD_NYU&offset=0',
        elementToTest   : 'prm-no-search-result',
        waitForSelector : 'prm-no-search-result-after',
    },
];

export {
    testCases,
};
