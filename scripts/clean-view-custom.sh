#!/usr/bin/env bash

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

VIEW=$1

if [ -z $VIEW ]; then
    echo >&2 "Please specify a view to clean."
    exit 1
fi

VIEW_DIR=$ROOT/custom/$VIEW

if [ ! -d $VIEW_DIR ]; then
    echo >&2 "$VIEW_DIR is not a valid view directory."
    exit 1
fi

echo "Cleaning $VIEW_DIR"

# For now we are just cleaning the JS build.  We will eventually want to clean
# CSS build as well, but we currently have no source CSS files to re-create the
# empty custom1.css file.  So if we delete it it will not be rebuilt, and the
# local Primo will fail to start without it.
VIEW_CUSTOM_JS_FILE=$VIEW_DIR/js/custom.js

# Need to test for existence first, because if file doesn't already exist, the
# non-zero return value from `rm` could cause the `yarn` script to prematurely
# abort.
if [ -e $VIEW_CUSTOM_JS_FILE ]; then
    rm $VIEW_CUSTOM_JS_FILE
fi
