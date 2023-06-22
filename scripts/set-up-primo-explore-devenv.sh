#!/usr/bin/env bash

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

PRIMO_EXPLORE_DEVENV_LOCAL=$ROOT/primo-explore-devenv
PRIMO_EXPLORE_DEVENV_LOCAL_CUSTOM=$PRIMO_EXPLORE_DEVENV_LOCAL/primo-explore/custom/

if [ -e $PRIMO_EXPLORE_DEVENV_LOCAL ]; then
  read -p "$PRIMO_EXPLORE_DEVENV_LOCAL already exists.  Overwrite it? " -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    rm -fr $PRIMO_EXPLORE_DEVENV_LOCAL || exit 1
  fi
fi

PRIMO_EXPLORE_DEVENV_REPO='git@github.com:ExLibrisGroup/primo-explore-devenv.git'
PRIMO_EXPLORE_DEVENV_COMMIT='ad78ad5d8db2e727f612657eca5d222e89366110'

git clone $PRIMO_EXPLORE_DEVENV_REPO $PRIMO_EXPLORE_DEVENV_LOCAL
if [ $? -ne 0 ]; then
    exit 1
fi

cd $PRIMO_EXPLORE_DEVENV_LOCAL || exit 1

git checkout $PRIMO_EXPLORE_DEVENV_COMMIT >/dev/null
if [ $? -ne 0 ]; then
    exit 1
fi

rm -fr .git/

# This inline replace sed command is written for execution on a Mac.  It might
# require a slight adjustment to the -i option in a Linux environment.
sed -i '' 's@http://your-server:your-port@https://sandbox02-na.primo.exlibrisgroup.com:443@g' ./gulp/config.js

cd $PRIMO_EXPLORE_DEVENV_LOCAL_CUSTOM || exit 1

ln -s ../../../custom/01NYU_INST-TESTWS01 .

cd $PRIMO_EXPLORE_DEVENV_LOCAL || exit 1

yarn install





