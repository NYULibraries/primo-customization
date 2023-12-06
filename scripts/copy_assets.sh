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

    # Path to the assets folder in the source directory
    source_assets_folder="$dir/assets"

    # Path to the assets folder in the destination directory
    destination_assets_folder="$DESTINATION_DIR/$dir_name/assets"

    # Check if the assets folder exists in the source directory
    if [ -d "$source_assets_folder" ]; then
        # Copy the entire assets directory from source to destination
        cp -vr "$source_assets_folder" "$DESTINATION_DIR/$dir_name/"
    else
        # Check if the assets folder exists in the destination directory
        if [ -d "$destination_assets_folder" ]; then
            # Create the assets folder in the source directory
            mkdir -v "$source_assets_folder"
            echo "Assets folder created at $source_assets_folder"
        fi
    fi
done

echo "Assets copied successfully."
