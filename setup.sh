#!/bin/bash

set -e # Exit on errors
set -x # Debug mode - print each command before running

# Print the current working directory
echo "Current directory before script: $(pwd)"

# Clean up any existing repository (remnant from Netlify or previous runs)
if [ -d ".git" ]; then
    echo "Removing existing .git directory..."
    rm -rf .git
fi

# Clone the repository using native Git
echo "Cloning the repository using native Git..."
GIT_REPO_URL="https://github.com/integritymarketing/ae-agent-portal.git" # Replace with your repository URL
GIT_BRANCH="SPW-286840-Integrate-with-SonarCloud" # Branch to clone

git clone --branch "$GIT_BRANCH" --single-branch "$GIT_REPO_URL" .

# Fetch full Git history (unshallow the repository)
echo "Fetching full Git history..."
git fetch --unshallow || echo "Failed to fetch full history. Continuing with shallow clone."

# Verify integrity of Git objects
echo "Verifying Git objects..."
git fsck || echo "Git integrity check reported issues."

# Debug Git state
echo "Current Git commit: $(git rev-parse HEAD || echo 'No Git commit found')"

# Ensure Java installation for SonarQube is compatible
mise use -g java@openjdk-21

# Verify Java installation
java -version

# Run SonarQube analysis with debug mode
yarn sonar -X