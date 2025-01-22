#!/bin/bash

# Install SDKMAN if not already installed
if ! command -v sdk &> /dev/null; then
    curl -s "https://get.sdkman.io" | bash
    source "$HOME/.sdkman/bin/sdkman-init.sh"
else
    source "$HOME/.sdkman/bin/sdkman-init.sh"
fi

# Install and set the desired Java version
sdk install java 17.0.6-zulu
sdk use java 17.0.6-zulu

# Export JAVA_HOME and fix PATH without overwriting it
export JAVA_HOME="$HOME/.sdkman/candidates/java/current"
export PATH="$JAVA_HOME/bin:$PATH:/bin:/usr/bin:/usr/local/bin"

# Verify Java version in logs
java -version