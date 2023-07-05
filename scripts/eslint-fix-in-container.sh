#!/bin/env bash

# This is script only intended for use by developers who do not have Node installed
# on their machines or are for some reason unable to build all packages (for
# example if they are working on Apple Silicon machines).
# All other users should simply run `yarn eslint:fix`.

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

ESLINT_FIX_CMD='yarn eslint:fix'
KEEP_RUNNING_CMD='tail -f /dev/null'

TOP_LEVEL_FILES=( .eslintrc.cjs eslint.config.js )

DOCKER_IMAGE='primo-explore-devenv'
DOCKER_CONTAINER='eslint-fix'

VOLUMES=(cdn custom scripts tools)
VOLUMES_OPTIONS=''

for volume in "${VOLUMES[@]}"
do
    VOLUMES_OPTIONS="$VOLUMES_OPTIONS --volume $ROOT/$volume:/app/$volume "
done

docker run --detach \
           --name $DOCKER_CONTAINER \
           --rm \
           $VOLUMES_OPTIONS \
       $DOCKER_IMAGE $KEEP_RUNNING_CMD

for topLevelFile in "${TOP_LEVEL_FILES[@]}"
do
    docker cp $ROOT/$topLevelFile $DOCKER_CONTAINER:/app/
done

docker exec $DOCKER_CONTAINER $ESLINT_FIX_CMD

for topLevelFile in "${TOP_LEVEL_FILES[@]}"
do
    docker cp $DOCKER_CONTAINER:/app/$topLevelFile $ROOT/
done

docker stop $DOCKER_CONTAINER
