#!/usr/bin/env bash

# This is script only intended for use by developers who do not have Node installed
# on their machines or are for some reason unable to build all packages (for
# example if they are working on Apple Silicon machines).
# All other users should simply run `yarn eslint:cjs-file`.

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

DOCKER_CONTAINER='primo-customization-eslint-cjs-file-1'

ESLINT_CJS_DOCKER_COMPOSE_CMD='eslint-cjs-file'
ESLINT_CJS_FILE=.eslintrc.cjs

docker compose up $ESLINT_CJS_DOCKER_COMPOSE_CMD

docker cp $DOCKER_CONTAINER:/app/$ESLINT_CJS_FILE $ROOT/
