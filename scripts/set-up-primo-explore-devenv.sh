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

PRIMO_EXPLORE_DEVENV_REPO='git@github.com:NYULibraries/primo-explore-devenv.git'
PRIMO_EXPLORE_DEVENV_COMMIT='77835021e9c1b1e15c8353b17901170961edd36d'

git clone $PRIMO_EXPLORE_DEVENV_REPO $PRIMO_EXPLORE_DEVENV_LOCAL
if [ $? -ne 0 ]; then
    exit 1
fi

cd $PRIMO_EXPLORE_DEVENV_LOCAL_CUSTOM || exit 1

git checkout $PRIMO_EXPLORE_DEVENV_COMMIT >/dev/null
if [ $? -ne 0 ]; then
    exit 1
fi

ln -s ../../../custom/01NYU_INST-TESTWS01 .

cd $PRIMO_EXPLORE_DEVENV_LOCAL || exit 1

rm -fr .git/

echo -e "\n*******\n\nTo complete setup, run \`yarn install\` inside $PRIMO_EXPLORE_DEVENV_LOCAL using Node 16.17.0 or higher.\n"




