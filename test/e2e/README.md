# E2E tests

## Prerequisites

* Node 16.17.0 or higher is recommended ([nvm](https://github.com/nvm-sh/nvm) recommended)
* yarn

---

## Getting started

* [Install](https://github.com/NYULibraries/primo-customization/test/e2e/README.md#install)
* [Start local CDN server](https://github.com/NYULibraries/primo-customization#start-local-cdn-server)
* Start local Primo **for the view to be tested**: [Start local Primo (primo-explore-devenv)](https://github.com/NYULibraries/primo-customization#start-local-primo-primo-explore-devenv)
  * Make sure to match the local Primo and e2e test views.  Not doing so can lead to
    inaccurate test results.  For example: if the local Primo being tested was
    started using `yarn primo-explore-devenv:run:nyu:dev` (or equivalent Docker Compose
    command), you should run tests using `yarn test:e2e:nyu:dev`.  DO NOT RUN
    `yarn test:e2e:nyu:prod`.
* [Run tests](https://github.com/NYULibraries/primo-customization/test/e2e/README.md#run-tests)

---

## Install

```shell
cd test/e2e/
yarn install
```

---

## Run tests

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:nyu:prod
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:TESTWS01
yarn test:e2e:nyu:testws01
# Tests http://localhost:8003/discovery/search?vid=[VID]
VIEW=[VIEW] yarn test:e2e
```

Update golden files:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:nyu:prod:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:TESTWS01
yarn test:e2e:nyu:testws01:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=[VID]
UPDATE_GOLDEN_FILES=true VIEW=[VIEW] yarn test:e2e
```

---

Note that the `yarn` scripts can accept
[Playwright options](https://playwright.dev/docs/test-cli).

Debug tests using [Playwright Inspector](https://playwright.dev/docs/debug#playwright-inspector):

* Browsers launch in headed mode, even if `headless` is set to `true` in _playwright.config.js_.
* Tests run with no default timeout
* Tests run one by one, regardless of the parallism settings in _playwright.config.js_.

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:nyu:dev --debug
```

Override the `workers` setting in _playwright.config.js_:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV using 6 workers
yarn test:e2e:nyu:dev --workers=6
```

---

Using Docker Compose:

```shell
VIEW=[VIEW] docker compose up e2e
```

For example:

```shell
# Tests http://primo-explore-devenv:8003/discovery/search?vid=01NYU_INST-NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up e2e
```

Update golden files:

```shell
# Tests http://primo-explore-devenv:8003/discovery/search?vid=01NYU_INST-NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up e2e-update-golden-files
```

---

[Playwright options](https://playwright.dev/docs/test-cli) can be passed in
using the `PLAYWRIGHT_COMMAND_LINE_OPTIONS` environment variable.

Example: override the `workers` setting in _playwright.config.js_:

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV using 6 workers
PLAYWRIGHT_COMMAND_LINE_OPTIONS='--workers=6' VIEW=01NYU_INST-NYU_DEV docker compose up e2e
```

Note that not all command line options will work properly inside a container.
For example, the `--debug` option for running tests with
[Playwright Inspector](https://playwright.dev/docs/debug#playwright-inspector) will not work without X11 forwarding or something
similar already set up.

---

## CDN test fixture

The CDN test fixture _./fixtures/cdn/_ serves as the default CDN path for the
local `cdn-server`.  It can be updated from the `primo-customization-cdn`
repo using the _./scripts/update-cdn-test-fixture-from-repo.sh_ script.

### update-cdn-test-fixture-from-repo.sh

Usage:

```shell
./scripts/update-cdn-test-fixture-from-repo.sh [GIT CHECKOUT ARG]
``` 

Update from `main` branch:

```shell
./scripts/update-cdn-test-fixture-from-repo.sh main
```

Update from a specific commit:

```shell
./scripts/update-cdn-test-fixture-from-repo.sh b75b41bcdcd64f9a35cf6c35c07f6e316bc557ba
```

The script will also create version file _./fixtures/cdn/version.txt_ to record
what version of `primo-customization-cdn` has been duplicated as for the CDN test
fixture.  Both the modifications to the CDN test fixture resulting from running
the script and the version file should be checked into the repo together in the
same commit.

---

## References

* [Playwright](https://playwright.dev/)
  * Debugging
    * [Debugging Tests](https://playwright.dev/docs/debug): the main guide 
    * [Trace viewer](https://playwright.dev/docs/trace-viewer):
      for debugging tests that are only failing in containers
      * [Getting Started](https://playwright.dev/docs/trace-viewer-intro) 
      * Online version: https://trace.playwright.dev/ 
