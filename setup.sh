#!/bin/bash

set -e
set -x

# Print the current working directory
echo "Current directory before change: $(pwd)"

# Ensure the script runs from its own directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
echo "Switched to script directory: $(pwd)"

# Fetch full Git history if running in a CI/CD environment
# Required for SonarQube to avoid shallow clone issues
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Git repository detected. Fetching full history..."
    git fetch --unshallow || echo "Repository is already unshallowed or fetch failed"
fi

# Debug Git state
echo "Git commit: $(git rev-parse --short HEAD || echo 'No Git repository or HEAD not found')"

# Install Java JRE 17 with Homebrew
brew install openjdk@17

# Set environment variables for OpenJDK 17 (Linuxbrew path)
export JAVA_HOME="/home/linuxbrew/.linuxbrew/opt/openjdk@17"
export PATH="$JAVA_HOME/bin:$PATH"

# Add environment variables permanently (optional)
echo "export JAVA_HOME=/home/linuxbrew/.linuxbrew/opt/openjdk@17" >> ~/.profile
echo "export PATH=/home/linuxbrew/.linuxbrew/opt/openjdk@17/bin:\$PATH" >> ~/.profile

# Reload profile to apply changes
source ~/.profile

# Verify Java installation
java -version

# Run SonarQube analysis
yarn sonar