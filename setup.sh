#!/bin/bash

set -e
set -x

# Print the current working directory
echo "Current directory: $(pwd)"
cd "$(dirname "$0")"
echo "Current directory: $(pwd)"

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

yarn sonar