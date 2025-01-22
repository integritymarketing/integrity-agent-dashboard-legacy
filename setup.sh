#!/bin/bash

set -e
set -x

# Install Java JRE 17 with Homebrew
brew install openjdk@17

# Link Java 17 and set environment variables
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

# Add environment variables permanently (optional)
echo "export JAVA_HOME=$(/usr/libexec/java_home -v 17)" >> ~/.bashrc
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc

# Verify installation
java -version