const STATUSPAGE_EMBED_SELECTOR = 'script[ src*="statuspage-embed" ]';

const testCases = [
    {
        name        : 'Home page',
        queryString : '',
    },
    {
        name        : '[search] Art',
        queryString : 'query=any,contains,art&tab=LibraryCatalog&search_scope=MyInstitution&offset=0',
    },
];

export {
    STATUSPAGE_EMBED_SELECTOR,
    testCases,
};
