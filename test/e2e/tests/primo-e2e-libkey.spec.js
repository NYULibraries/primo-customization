/* eslint-disable max-len */
const { test, expect } = require( '@playwright/test' );

const view = process.env.VIEW;
const vid = view.replaceAll( '-', ':' );

process.env.PLAYWRIGHT_BASE_URL = 'https://nyu.primo.exlibrisgroup.com/discovery/search'

const testCases = [
    {
        name      : 'LibKey for article search: "art"',
        searchItem: 'Art',
        url       : 'https://www.anthroencyclopedia.com/printpdf/1992',
    },
    {
        name      : 'LibKey for article search: "history"',
        searchItem: 'History',
        url       : 'https://www.gastrojournal.org/article/S0016-5085(20)35235-5/pdf',
    },
    {
        name      : 'LibKey for article search: "science"',
        searchItem: 'Science',
        url       : 'https://www.science.org/doi/pdf/10.1126/science.aao0185',
    },
];

for ( let i = 0; i < testCases.length; i++ ) {
    const testCase = testCases[i];

    test.describe( `${ testCase.name }`, () => {
        test.beforeEach( async ( { page } ) => {
            let fullQueryString = `?vid=${ vid }`;
            await page.goto( fullQueryString );
        } );

        test.afterEach( async ( { page } ) => {
            await page.context().clearCookies();
        } );
        test( 'Libkey Search Page Test', async ( { page } ) => {
            await page.getByRole( 'button', { name: 'selectScope Search Everything' } ).click();
            await page.getByRole( 'option', { name: 'Articles' } ).click();

            await page.getByRole( 'combobox', { name: 'Search field' } ).fill( testCase.searchItem );
            await page.getByRole( 'combobox', { name: 'Search field' } ).press( 'Enter' );

            // Check if search results are present
            await page.waitForSelector( '.list-item-wrapper' );

            const searchResults = await page.$$( '.list-item-wrapper' );

            expect( searchResults.length ).toBeGreaterThan( 0 );

            await page.waitForTimeout( 5000 );

            // Click on the first result and wait for the new page to load
            const pagePromise = page.context().waitForEvent( 'page' );
            await page.click( 'a:has-text("Download")' );
            const newPage = await pagePromise;
            await newPage.waitForLoadState();

            await newPage.waitForTimeout( 10000 );
            const url = newPage.url().split( '?' )[0];
            expect( url ).toBe( testCase.url );
        } );
    } );
};
