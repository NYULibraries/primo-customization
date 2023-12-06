#!/bin/bash

set -e

echo "Running all copying tasks..."

echo "Copying HTML files..."
./copy_html_files.sh
echo "HTML files copied."

echo "Copying CSS files..."
./copy_css_files.sh
echo "CSS files copied."

echo "Copying JS files..."
./copy_js_files.sh
echo "JS files copied."

echo "Copying assets..."
./copy_assets.sh
echo "Assets copied."

echo "All copying tasks completed."
