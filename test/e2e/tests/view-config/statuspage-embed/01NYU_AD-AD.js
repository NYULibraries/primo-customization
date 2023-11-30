const STATUSPAGE_EMBED_SELECTOR = 'script[ src*="statuspage-embed" ]';

const testCases = [
    {
        name         : 'Home page',
        pathAndQuery : '/discovery/search?vid=[VID]',
    },
    {
        name         : '[search] Art',
        pathAndQuery : '/discovery/search?vid=[VID]&query=any,contains,art&tab=LibraryCatalog&search_scope=MyInstitution&offset=0',
    },
];

export {
    STATUSPAGE_EMBED_SELECTOR,
    testCases,
};
