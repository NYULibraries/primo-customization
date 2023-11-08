#!/bin/sh -e

: "${CANONICAL_VID?Must specify CANONICAL_VID}"
: "${NEW_VID?Must specify NEW_VID}"

package_dir="."
base_package_dir="$package_dir/custom"

# ensure canonical dir exists
canonical_hyphenated_vid="${CANONICAL_VID/:/-}"
canonical_dir="$base_package_dir/$canonical_hyphenated_vid"
if [ ! -d "$canonical_dir" ]; then
  echo "$canonical_dir does not exist, so CANONICAL_VID=\"$CANONICAL_VID\" is not a pre-existing vid; aborting!"
  exit 1
fi

# ensure new dir doesn't exist
new_hyphenated_vid="${NEW_VID/:/-}"
new_dir="$base_package_dir/$new_hyphenated_vid"
if [ -d "$new_dir" ]; then
  echo "$new_dir already exists, so NEW_VID=\"$NEW_VID\" cannot be created; aborting!"
  exit 1
fi

# copy all the files, preserving symlinks; don't copy assets, just create empty dir
echo "Creating $new_dir ..."
rsync --archive --exclude colors.json --exclude img/favicon.ico --exclude scss $canonical_dir/* $new_dir/
# blank out all html, css files; thanks to https://stackoverflow.com/a/14565002
find $new_dir/ \( -name '*.html' -o -name '*.css' \) -exec sh -c '> "{}"' \;

# create e2e test dirs
e2e_test_dir="test/e2e"
echo "Creating $e2e_test_dir/tests/{actual,diffs,golden}/$new_hyphenated_vid ..."
mkdir -p "$e2e_test_dir/tests/actual/$new_hyphenated_vid"
mkdir -p "$e2e_test_dir/tests/diffs/$new_hyphenated_vid"
mkdir -p "$e2e_test_dir/tests/golden/$new_hyphenated_vid"
touch "$e2e_test_dir/tests/actual/$new_hyphenated_vid/.gitkeep"
touch "$e2e_test_dir/tests/diffs/$new_hyphenated_vid/.gitkeep"
touch "$e2e_test_dir/tests/golden/$new_hyphenated_vid/.gitkeep"
printf "\n!tests/actual/$new_hyphenated_vid/
tests/actual/$new_hyphenated_vid/*
!tests/actual/$new_hyphenated_vid/.gitkeep
!tests/diffs/$new_hyphenated_vid/
tests/diffs/$new_hyphenated_vid/*
!tests/diffs/$new_hyphenated_vid/.gitkeep\n" >> "$e2e_test_dir/.gitignore"
printf "\n!tests/actual/$new_hyphenated_vid/
tests/actual/$new_hyphenated_vid/*
!tests/actual/$new_hyphenated_vid/.gitkeep
!tests/diffs/$new_hyphenated_vid/
tests/diffs/$new_hyphenated_vid/*
!tests/diffs/$new_hyphenated_vid/.gitkeep\n" >> "$e2e_test_dir/.dockerignore"
# create empty-set config files for e2e 
e2e_config_dir="$e2e_test_dir/tests/view-config"
echo "Creating $e2e_config_dir/{libkey,primo-ve-links,static}/$new_hyphenated_vid ..."
printf "const testCases = [];

export {
    testCases,
};" > "$e2e_config_dir/libkey/$new_hyphenated_vid.js"
printf "export function getLinksToTest() {
    return [];
}" > "$e2e_config_dir/primo-ve-links/$new_hyphenated_vid.js"
printf "const testCases = [];

export {
    testCases,
};" > "$e2e_config_dir/static/$new_hyphenated_vid.js"

echo "Success! Created $NEW_VID
Next steps:
  * Run create-view.sh script in CDN repo, commit it, and copy into e2e fixtures with test/e2e/scripts/update-cdn-test-fixture-from-repo.sh
  * Edit $new_dir/html/homepage/homepage_en.html with an appropriate homepage
  * Edit $e2e_config_dir/static/$new_hyphenated_vid.js with a static test of the new homepage (perhaps use $e2e_config_dir/static/$canonical_hyphenated_vid.js as a guide)
  * Update golden files following README
Additional steps:
  * Add $new_dir/img/favicon.ico
  * Use $new_dir/colors.json to generate app-colors.css for the CDN repo (via Recipe 1 in the README)"
