// @ts-check
const { devices } = require( '@playwright/test' );
require( 'dotenv' ).config(
    { path: require( 'path' ).join( __dirname, '.env.test' ) },
)

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
    // === Note about `process.env.CI` vs `process.env.CONTAINER_MODE` ===
    // Playwright documentation and its generated default code make frequent use of
    // `process.env.CI` for specifying configuration in continuous integration
    // environments.  In most cases we replace this with `process.env.CONTAINER_MODE`,
    // to increase stability when containers are being used in local development
    // environments in addition to when they are being used in CI.
    // This equivalence seems reasonable given Playwright assumes (understandably)
    // that container use will typically only occur in CI environments --
    // see https://playwright.dev/docs/trace-viewer-intro.
    // We have encountered increased test flake in both local containers and
    // containers in the CI environment, which we mitigate through code and
    // these customized settings.

    testDir: './tests',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect : {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
        timeout: 10000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code.
       We leave this default as-is, since we would want the option to test.only
       when developing locally.
     */
    forbidOnly   : !!process.env.CI,
    /* Original default: `process.env.CI ? 2 : 0`
       We increase the number of retries in all environments to mitigate various
       LibKey-related test instabilities.
     */
    retries      : process.env.CONTAINER_MODE ? 2 : 2,
    /* Opt out of parallel tests. */
    workers      : process.env.CONTAINER_MODE ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter     : 'list',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use          : {

        /* Browser to use. See https://playwright.dev/docs/api/class-browsertype. */
        /* We are already using only chromium in our projects.
    All tests are run in a headless mode by default */

        // browserName: 'chromium',
        // // viewport: { width: 1280, height: 720 },
        // // ignoreHTTPSErrors: true,
        // launchOptions: {
        //   headless: true,
        // },
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL      : process.env.PLAYWRIGHT_BASE_URL,

        // Capture screenshot after each test failure.
        screenshot: 'only-on-failure',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',

        // Record video only when retrying a test for the first time.
        video: 'on-first-retry'

    /* Browser context options. See https://playwright.dev/docs/api/class-browsercontext */
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use : {
                ...devices['Desktop Chrome'],
            },
        },

        // {
        //   name: 'firefox',
        //   use: {
        //     ...devices['Desktop Firefox'],
        //   },
        // },

        // {
        //   name: 'webkit',
        //   use: {
        //     ...devices['Desktop Safari'],
        //   },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

module.exports = config;
