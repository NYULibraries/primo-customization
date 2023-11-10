const CHAT_WIDGET_SELECTOR = 'div#lcs_slide_out-22908';

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
    CHAT_WIDGET_SELECTOR,
    testCases,
};
