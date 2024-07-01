#!/usr/bin/env bash

viewPaths=( "$@" )

ROOT=$(
    cd "$(dirname "$0")" || exit 1
    cd ..
    pwd -P
)

# Directories
CUSTOM_DIR=$ROOT/custom
TMP=$ROOT/tmp
BUILD_DIR=$ROOT/primo-explore-devenv/packages
PACKAGES_REPO_LOCAL_DIR=$TMP/primo-ve-customization-packages

# TODO: change back to real branch
REQUIRED_BRANCH=script-create-packages-and-push-to-packages-repo
#REQUIRED_BRANCH=main

# TODO: change back to real repo
PACKAGES_REPO_REMOTE=git@github.com:da70/primo-ve-customization-packages.git
#PACKAGES_REPO_REMOTE=git@github.com:NYULibraries/primo-ve-customization-packages.git

function abort() {
    local message="$1"

    echo -e "\nFATAL: $message\nStopping...\n"

    exit 1
}

function clean() {
    rm -fr $PACKAGES_REPO_LOCAL_DIR
    if [ $? -ne 0 ]; then
        abort "Error while cleaning $PACKAGES_REPO_LOCAL_DIR."
    fi

    rm -fr "${BUILD_DIR:?}/"*
    if [ $? -ne 0 ]; then
        abort "Error while cleaning $BUILD_DIR."
    fi
}

function cloneRepo() {
    git clone $PACKAGES_REPO_REMOTE $PACKAGES_REPO_LOCAL_DIR
    if [ $? -ne 0 ]; then
        abort "Error cloning packages repo."
    fi
}

function createPackages() {
    local viewPaths=( "$@" )

    for viewPath in "${viewPaths[@]}"; do
        view=$( basename $viewPath )
        yarn primo-explore-devenv:create-package $view
        if [ $? -ne 0 ]; then
            abort "Error creating package for $view"
        fi
    done
}

function verifyBranch() {
    if [ "$( git branch --show-current )" != "$REQUIRED_BRANCH" ]; then
        abort "Must be on branch $REQUIRED_BRANCH to run this script."
    fi
}

function verifyUnmodifiedGitStatus() {
    if [ "$( git status --porcelain )" != '' ]; then
        abort \
'Must have a clean working directory before running this script.\n(`git status --porcelain` output must be empty)'
    fi
}

function verifyViews() {
    local viewPaths=( "$@" )

    result=true
    for viewPath in "${viewPaths[@]}"; do
        baseViewName=$( basename $viewPath )
        viewPathArgRealpath=$( realpath $viewPath )
        checkViewRealpath=$( realpath $CUSTOM_DIR/$baseViewName )

        if [ "$viewPathArgRealpath" != "$checkViewRealpath" ] || [ ! -d "$viewPathArgRealpath" ]; then
            result=false
            echo "$viewPath is not a valid view path"
        fi
    done

    if [ "$result" == false ]; then
        abort "Invalid view paths."
    fi
}

verifyBranch

verifyUnmodifiedGitStatus

verifyViews "${viewPaths[@]}"

clean

cloneRepo

createPackages "${viewPaths[@]}"

