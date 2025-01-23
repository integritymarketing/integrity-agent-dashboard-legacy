#!/bin/bash

# Define the root directory of your project
PROJECT_ROOT="/c/Users/SSC_Stephen.Kuehl/Dev/ae-agent-portal/src"

# Navigate to the project root
cd "$PROJECT_ROOT" || {
    echo "Cannot find directory: $PROJECT_ROOT"
    exit 1
}

# Find all .js files and check if they contain "return ("
find . -type f -name "*.js" | while read -r file; do
    # Check if the file contains the "return (" keyword
    if grep -q "return (" "$file"; then
        # Rename the file to .jsx if it doesn't already have a .jsx extension
        new_file="${file%.js}.jsx"
        if [[ "$file" != "$new_file" ]]; then
            mv "$file" "$new_file"
            echo "Renamed $file -> $new_file"
        fi
    fi
done

echo "File renaming complete."