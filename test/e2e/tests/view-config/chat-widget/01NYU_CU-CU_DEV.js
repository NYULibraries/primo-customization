import { getViewConfig } from '../../../testutils';

const CHAT_WIDGET_SELECTOR = getViewConfig( 'chat-widget', '01NYU_CU-CU' ).CHAT_WIDGET_SELECTOR;
const testCases = getViewConfig( 'chat-widget', '01NYU_CU-CU' ).testCases;

export {
    CHAT_WIDGET_SELECTOR,
    testCases,
};
