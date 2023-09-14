#!/bin/sh

ROOT=$( cd "$(dirname "$0")" || exit 1; cd ..; pwd -P )

GIT_CHECKOUT_ARG=$1

if [ -z $GIT_CHECKOUT_ARG ]
then
  echo >&2 'Please specify a `git checkout` argument, such as a branch or commit.'
  exit 1
fi

CDN_TEST_FIXTURE_DIR=$ROOT/fixtures/cdn/
CDN_TEST_FIXTURE_VERSION_FILE=$CDN_TEST_FIXTURE_DIR/version.txt

PRIMO_CUSTOMIZATION_CDN_REPO_NAME=primo-customization-cdn

SCRATCH_DIR=$( mktemp -d -t primo-customization-cdn-scratch )
SCRATCH_CLONE_DIR=$SCRATCH_DIR/$PRIMO_CUSTOMIZATION_CDN_REPO_NAME

git clone \
  git@github.com:NYULibraries/${PRIMO_CUSTOMIZATION_CDN_REPO_NAME}.git \
  $SCRATCH_CLONE_DIR

cd $SCRATCH_CLONE_DIR || exit 1

git checkout $GIT_CHECKOUT_ARG

# Synchronize
rsync -azvh --delete \
  $SCRATCH_CLONE_DIR/primo-customization/ \
  $CDN_TEST_FIXTURE_DIR/primo-customization/

# Write the version file
COMMIT=$( git rev-parse HEAD )
echo "https://github.com/NYULibraries/primo-customization-cdn/commit/$COMMIT"  > $CDN_TEST_FIXTURE_VERSION_FILE

# Clean up
rm -fr ${SCRATCH_DIR:?}
