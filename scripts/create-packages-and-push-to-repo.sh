#!/usr/bin/env bash

ROOT=$(
    cd "$(dirname "$0")"
    cd ..
    pwd -P
)

# Directories
TMP=$ROOT/tmp
BUILD_DIR=$ROOT/primo-explore-devenv/packages
PACKAGES_REPO_LOCAL_DIR=$TMP/primo-ve-customization-packages

# TODO: change back to real repo
PACKAGES_REPO_REMOTE=git@github.com:da70/primo-ve-customization-packagesx=.git
#PACKAGES_REPO_REMOTE=git@github.com:NYULibraries/primo-ve-customization-packages.git

function abort() {
    local message="$1"

    echo -e "\nFATAL: $message\nStopping...\n"

    exit 1
}

function clean() {
    rm -fr $PACKAGES_REPO_LOCAL_DIR
    if [ $? -ne 0 ]; then
        abort "Error while cleaning."
    fi
}

function cloneRepo() {
    git clone $PACKAGES_REPO_REMOTE $PACKAGES_REPO_LOCAL_DIR
    if [ $? -ne 0 ]; then
        abort "Error cloning packages repo."
    fi
}

clean

cloneRepo


