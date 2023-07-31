#!/usr/bin/env bash

ROOT=$( cd "$(dirname "$0")" ; cd ..; pwd -P )

PRIMO_EXPLORE_DEVENV_LOCAL=$ROOT/primo-explore-devenv

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

# Set PROXY_SERVER.
# This inline replace sed command is written for execution on a Mac.  It might
# require a slight adjustment to the -i option in a Linux environment.
sed -i '' 's@http://your-server:your-port@https://nyu.primo.exlibrisgroup.com:443@g' ./gulp/config.js

# ExLibris .gitignore has bugs in it: https://github.com/NYULibraries/primo-customization/blob/4bd6850cd4a603c31f5c0ef6b6d4e080bc52a28a/primo-explore-devenv/.gitignore#L1-L2
# ...should be "primo-explore/custom/*" and "primo-explore/custom/*".
# Also, we need to remove the rule for custom/ as we actually do want to check in
# the symlimks.
cat << EOF > .gitignore
primo-explore/tmp/
!primo-explore/tmp/.gitignore
EOF

# Replace empty custom/ directory with symlink to our custom/
cd $PRIMO_EXPLORE_DEVENV_LOCAL/primo-explore/ || exit 1
rm -fr custom/
ln -s ../../custom/ .

cd $PRIMO_EXPLORE_DEVENV_LOCAL || exit 1

yarn install





