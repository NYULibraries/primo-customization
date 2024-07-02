#!/usr/bin/env bash

ROOT=$(
    cd "$(dirname "$0")" || exit 1
    cd ..
    pwd -P
)

# TODO: change this back to `main` after this script is reviewed on the feature
#       branch and merged into `main` (if every).
# Only allow running of this script on this branch
# REQUIRED_BRANCH=main
REQUIRED_BRANCH=prototype-script-to-create-primo-ve-view-packages

# Package repo to add/commit/push to
PACKAGES_REPO_REMOTE=git@github.com:NYULibraries/primo-ve-customization-packages.git

# Directories
CUSTOM_DIR=$ROOT/custom
TMP=$ROOT/tmp
BUILD_DIR=$ROOT/primo-explore-devenv/packages
PACKAGES_REPO_LOCAL_DIR=$TMP/primo-ve-customization-packages

function abort() {
    local message="$1"

    echo -e "\nFATAL: $message\nStopping...\n" >&2

    exit 1
}

function addAndCommitToPackageRepo() {
        local viewPaths=( "$@" )

        cd $PACKAGES_REPO_LOCAL_DIR || exit 1

        for viewPathArg in "${viewPaths[@]}"; do
            view=$( basename $viewPathArg )
            builtPackageFile="$BUILD_DIR/${view}.zip"
            packageRepoFile="${PACKAGES_REPO_LOCAL_DIR}/${view%-*}/${view}.zip"

            cp -p $builtPackageFile $packageRepoFile
            if [ $? -ne 0 ]; then
                abort "Copy of package file failed."
            fi

            git add $packageRepoFile
            if [ $? -ne 0 ]; then
                abort "`git add` of package file failed."
            fi
        done

        commitMessage=$( gitCommitMessage "${viewPaths[@]}" )

        git commit -m "$commitMessage"
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

    for viewPathArg in "${viewPaths[@]}"; do
        view=$( basename $viewPathArg )
        yarn primo-explore-devenv:create-package $view
        if [ $? -ne 0 ]; then
            abort "Error creating package for $view"
        fi
    done
}

# For convenience, filter out the non-view directories in custom/, to allow $@
# to be supplied by glob patterns like custom/* and command substitutions like
# `$( find custom -depth 1 -not -name '*_DEV' -not -name '*-TESTWS01' )`.
# Unfortunately, bash return values are very limited, so we have to reference
# `viewPathsArgs` and `viewPaths` variables in outer scope.
function filterViewPaths() {
    nonViewDirectoryRegex='00_common/?$'
    for viewPathArg in "${viewPathsArgs[@]}"; do
        if [[ ! $viewPathArg =~ $nonViewDirectoryRegex ]]; then
            viewPaths+=("$viewPathArg")
        fi
    done
}

function gitCommitMessage() {
    local viewPaths=( "$@" )

    commitId=$( git rev-parse HEAD )

    cat <<EOF
New/modified packages:

$( for view in "${viewPaths[@]}"; do echo "* $( basename $view )"; done )

Builder version: [NYULibraries/primo\-customization@${commitId}](https://github.com/NYULibraries/primo-customization/tree/${commitId})
EOF
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
    for viewPathArg in "${viewPaths[@]}"; do
        baseViewName=$( basename $viewPathArg )
        viewPathArgRealpath=$( realpath $viewPathArg )
        checkViewRealpath=$( realpath $CUSTOM_DIR/$baseViewName )

        if [ "$viewPathArgRealpath" != "$checkViewRealpath" ] || \
           [ ! -d "$viewPathArgRealpath" ]; then
            result=false
            echo "$viewPathArg is not a valid view path"
        fi
    done

    if [ "$result" == false ]; then
        abort "Invalid view paths."
    fi
}

# See comment header for `filterViewPaths`, which filters args provided by user
# into `viewPaths` array.
viewPathsArgs=( "$@" )
viewPaths=()
filterViewPaths

verifyBranch

verifyUnmodifiedGitStatus

verifyViews "${viewPaths[@]}"

clean

createPackages "${viewPaths[@]}"

cloneRepo

addAndCommitToPackageRepo "${viewPaths[@]}"
