# Unit tests

## Prerequisites

* Node 16.17.0 or higher is recommended ([nvm](https://github.com/nvm-sh/nvm) recommended)
* `yarn` is recommended, but not required.  In the examples below, `npm` can be
   substituted for `yarn`.

---

## Getting started

* [Install](https://github.com/NYULibraries/primo-customization/test/unit/README.md#install)
* [Run tests](https://github.com/NYULibraries/primo-customization/test/unit/README.md#run-tests)

---

## Install

```shell
cd test/unit/
yarn install
```

---

## Run tests

```shell
yarn test:unit
# Runs `vitest watch`:
# https://vitest.dev/guide/cli.html
yarn test:unit:watch
```

Using Docker Compose:

```shell
docker compose up unit-tests
```

## References

* [Vitest](https://vitest.dev/)
