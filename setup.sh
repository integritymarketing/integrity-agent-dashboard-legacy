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
 echo "Fetching full Git history..."
 git fetch --unshallow || echo "Failed to fetch full history. Continuing..."

 # Ensure all objects are downloaded
 echo "Expanding filtered or incomplete blobs..."
 git fetch --filter=blob:none || echo "Blob fetch failed. Continuing with partial data."

 # Ensure Git is healthy
 echo "Verifying Git integrity..."
 git fsck || echo "Git integrity check reported issues."


# Debug Git state
echo "Git commit: $(git rev-parse --short HEAD || echo 'No Git repository or HEAD not found')"

# Install Java JRE (using Mise for better compatibility in environments)
mise use -g java@openjdk-21

# Verify Java installation
java -version

# Run SonarQube analysis with debug mode for more insights
yarn sonar