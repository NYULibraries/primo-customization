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
    started using `yarn primo-explore-devenv:run:dev` (or equivalent Docker Compose
    command), you should run tests using `yarn test:e2e:dev`.  DO NOT RUN
    `yarn test:e2e:prod`.
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
yarn test:e2e:dev
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:prod
# Tests http://localhost:8003/discovery/search?vid=[VID]
VIEW=[VIEW] yarn test:e2e
```

Update golden files (note there is no command for arbitrary VIEW):

```shell
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU_DEV
yarn test:e2e:dev:update-golden-files
# Tests http://localhost:8003/discovery/search?vid=01NYU_INST:NYU
yarn test:e2e:prod:update-golden-files
# No command for arbitrary VIEW
```

Using Docker Compose:

```shell
VIEW=[VIEW] docker compose up e2e
```

For example:

```shell
# Tests http://primo-explore-devenv:8003/discovery/search?vid=01NYU_INST-NYU_DEV
VIEW=01NYU_INST-NYU_DEV docker compose up e2e
```

---

## References

* [Playwright](https://playwright.dev/)
  * Debugging
    * [Debugging Tests](https://playwright.dev/docs/debug): the main guide 
    * [Trace viewer](https://playwright.dev/docs/trace-viewer):
      for debugging tests that are only failing in containers
      * [Getting Started](https://playwright.dev/docs/trace-viewer-intro) 
      * Online version: https://trace.playwright.dev/ 
