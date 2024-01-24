import { getViewConfig } from '../../../testutils';

const viewConfig = getViewConfig( 'statuspage-embed', '01NYU_US-SH' );
const STATUSPAGE_EMBED_SELECTOR = viewConfig.STATUSPAGE_EMBED_SELECTOR;
const testCases = viewConfig.testCases;

export {
    STATUSPAGE_EMBED_SELECTOR,
    testCases,
};
