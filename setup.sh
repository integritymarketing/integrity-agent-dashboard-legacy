#!/bin/bash

set -e
set -x

# Print the current working directory
echo "Current directory before change: $(pwd)"

# Ensure the script runs from its own directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
echo "Switched to script directory: $(pwd)"

# Debugging SonarQube Missing Blob issue
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Git repository detected."

    # Check for shallow clone and convert to full history if necessary
    if [ -f "$(git rev-parse --git-dir)/shallow" ]; then
        echo "Shallow clone detected. Fetching full history..."
        git fetch --unshallow --filter=blob:none || echo "Already fetched full history or fetch failed."
    else
        echo "Complete repository; no fetch required."
    fi

    # Ensure all objects are available
    echo "Verifying Git objects..."
    git fsck || echo "Git integrity check failed."
else
    echo "No Git repository found. Exiting."
    exit 1
fi

# Debug Git state
echo "Git commit: $(git rev-parse --short HEAD || echo 'No Git repository or HEAD not found')"

# Install Java JRE (using Mise for better compatibility in environments)
mise use -g java@openjdk-21

# Verify Java installation
java -version

# Run SonarQube analysis with debug mode for more insights
yarn sonar