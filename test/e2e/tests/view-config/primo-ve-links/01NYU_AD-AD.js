export function getLinksToTest( vid ) {
    return [
        {
            text         : 'browse journals by title',
            expectedHref : `/discovery/jsearch?vid=${ vid }`,
        },
        {
            text         : 'find an article by citation',
            expectedHref : `/discovery/citationlinker?vid=${ vid }`,
        },
    ];
}
