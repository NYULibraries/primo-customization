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

# Prevent this error:
# -----BEGIN ERROR-----
# Error in plugin "gulp-sass"
# Message:
#
# gulp-sass no longer has a default Sass compiler; please set one yourself.
# Both the "sass" and "node-sass" packages are permitted.
# For example, in your gulpfile:
#
#  const sass = require('gulp-sass')(require('sass'));
#
# [16:29:24] The following tasks did not complete: app-css, compile-scss
# -----END ERROR-----
#
# NOTE: `sass` module would be preferable as it is pure JavaScript and `node-sass`
# is deprecated, but gulp build fails due to obsolete/invalid code in ExLibris SASS,
# which generate multiple errors: "Error: compound selectors may no longer be extended."
sed -i '' 's@    "prompt": "1.0.0",@    "node-sass": "9.0.0",\
    "prompt": "1.0.0",@g' ./package.json
sed -i '' "s@let sass = require('gulp-sass');@let sass = require('gulp-sass')(require('node-sass'));@g" ./gulp/tasks/03-scss.js

# Babel error when running gulp `custom-js` task should end `run` task and prevent
# local Primo server from starting/continuing to run.
sed -i '' "s@buildByConcatination().on('end', cb);@buildByConcatination(cb).on('end', cb);@g" ./gulp/tasks/02-custom-js.js
sed -i '' "s@function buildByConcatination() {@function buildByConcatination(cb) {@g" ./gulp/tasks/02-custom-js.js
sed -i '' 's@this.emit("end");@cb(err);@g' ./gulp/tasks/02-custom-js.js
sed -i '' "s@gulp.task('run', gulp.series('select-view', 'connect:primo_explore','reinstall-primo-node-modules','setup_watchers','custom-js','custom-scss','custom-css')); //watch@gulp.task('run', gulp.series('select-view','custom-js','custom-scss','custom-css','connect:primo_explore','reinstall-primo-node-modules','setup_watchers')); //watch@g" ./gulp/tasks//08-servers.js

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





