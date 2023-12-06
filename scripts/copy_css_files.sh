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

    # Path to the CSS folder in the source directory
    source_css_folder="$dir/css"

    # Path to the CSS folder in the destination directory
    destination_css_folder="$DESTINATION_DIR/$dir_name/css"

    # Check if the source CSS folder exists
    if [ -d "$source_css_folder" ]; then
        # Check if the destination CSS folder exists
        if [ -d "$destination_css_folder" ]; then
            # Copy all CSS files except custom.css
            find "$source_css_folder" -maxdepth 1 -type f -name "*.css" ! -name "custom.css" -exec cp -v {} "$destination_css_folder/" \;

            # Special handling for custom.css
            if [ -f "$source_css_folder/custom.css" ] && [ -f "$destination_css_folder/custom1.css" ]; then
                # Copy custom.css from source to custom1.css in destination
                cp -v "$source_css_folder/custom.css" "$destination_css_folder/custom1.css"
            fi
        else
            echo "Destination CSS folder $destination_css_folder does not exist"
        fi
    else
        echo "Source CSS folder $source_css_folder does not exist"
    fi
done

echo "CSS files copied successfully."
