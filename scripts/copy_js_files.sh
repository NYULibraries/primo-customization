#!/bin/bash

# Navigate to the base directory of the project from the scripts folder
cd "$(dirname "$0")/.."

# Source and destination base directories
SOURCE_DIR="test/e2e/fixtures/cdn/primo-customization"
DESTINATION_DIR="custom"

# Iterate over directories in the source directory
for dir in $(find $SOURCE_DIR -mindepth 1 -maxdepth 1 -type d)
do
    # Extract the directory name
    dir_name=$(basename $dir)

    # Path to the JS folder in the source directory
    source_js_file="$dir/js/custom.js"

    # Path to the JS folder in the destination directory
    destination_js_folder="$DESTINATION_DIR/$dir_name/js"
    destination_custom_js="$destination_js_folder/05-custom1.js"

    # Check if the source custom.js file exists
    if [ -f "$source_js_file" ]; then
        # Ensure the destination JS folder exists
        mkdir -pv "$destination_js_folder"

        # Copy custom.js from source to custom1.js in destination
        cp -v "$source_js_file" "$destination_custom_js"
    else
        echo "Source JS file $source_js_file does not exist"
    fi
done

echo "JS files copied successfully."
