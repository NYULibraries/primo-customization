const CHAT_WIDGET_SELECTOR = 'div#lcs_slide_out-22908';

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
    CHAT_WIDGET_SELECTOR,
    testCases,
};
