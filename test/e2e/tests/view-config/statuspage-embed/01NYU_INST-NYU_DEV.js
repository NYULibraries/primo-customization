import { getViewConfig } from '../../../testutils';

const viewConfig = getViewConfig( 'statuspage-embed', '01NYU_INST-NYU' );
const STATUSPAGE_EMBED_SELECTOR = viewConfig.STATUSPAGE_EMBED_SELECTOR;
const testCases = viewConfig.testCases;

export {
    STATUSPAGE_EMBED_SELECTOR,
    testCases,
};
