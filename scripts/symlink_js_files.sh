#!/bin/bash

cd ..

# Check if the 'custom' directory exists
if [ ! -d "custom" ]; then
    echo "Error: 'custom' directory not found."
    exit 1
fi

# Define the source and target directories
source_dir="custom/00_common/js"
target_dirs=$(find custom -type d -name js | grep '01NYU')

# Loop through each target directory
for target_dir in $target_dirs
do
    echo "Processing $target_dir"
    # Loop through each JS file in the source directory
    for file in $source_dir/*.js
    do
        # Extract the filename from the file path
        filename=$(basename $file)
        # Check if file exists in the target directory
        if [ ! -f "$target_dir/$filename" ]; then
            # Copy the file to the target directory if it doesn't exist
            cp "$file" "$target_dir/$filename"
        fi
        # Create a symlink in the target directory
        ln -sf "../../00_common/js/$filename" "$target_dir/$filename"
    done
done

echo "Symlinks creation complete."
