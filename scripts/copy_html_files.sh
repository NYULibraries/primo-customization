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

    # Path to the HTML folder in the source directory
    source_html_folder="$dir/html"

    # Path to the HTML folder in the destination directory
    destination_html_folder="$DESTINATION_DIR/$dir_name/html"

    # Check if the source HTML folder exists
    if [ -d "$source_html_folder" ]; then
        # Check if the destination HTML folder exists
        if [ -d "$destination_html_folder" ]; then
            # Copy HTML files from source to destination
            cp -v "$source_html_folder"/*.html "$destination_html_folder/"
        else
            echo "Destination HTML folder $destination_html_folder does not exist"
        fi
    else
        echo "Source HTML folder $source_html_folder does not exist"
    fi
done

echo "HTML files copied successfully."
