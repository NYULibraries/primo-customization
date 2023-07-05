#!/bin/env bash

# This is script only intended for use by developers who do not have Node installed
# on their machines or are for some reason unable to build all packages (for
# example if they are working on Apple Silicon machines).
# All other users should simply run `yarn eslint:cjs-file`.

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

ESLINT_CJS_FILE_CMD='yarn eslint:cjs-file'
KEEP_RUNNING_CMD='tail -f /dev/null'

ESLINT_CJS_FILE=.eslintrc.cjs

DOCKER_IMAGE='primo-explore-devenv'
DOCKER_CONTAINER='eslint-cjs-file'

docker run --detach \
           --name $DOCKER_CONTAINER \
           --rm \
       $DOCKER_IMAGE $KEEP_RUNNING_CMD

docker exec $DOCKER_CONTAINER $ESLINT_CJS_FILE_CMD

docker cp $DOCKER_CONTAINER:/app/$ESLINT_CJS_FILE $ROOT/

docker stop $DOCKER_CONTAINER
