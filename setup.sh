#!/bin/bash

# Install SDKMAN if not already installed
if ! command -v sdk &> /dev/null
then
    curl -s "https://get.sdkman.io" | bash
    source "$HOME/.sdkman/bin/sdkman-init.sh"
fi

# Install and set the desired Java version
sdk install java 17.0.6-zulu
sdk use java 17.0.6-zulu

export JAVA_HOME=$HOME/.sdkman/candidates/java/current
export PATH=$JAVA_HOME/bin:$PATH

# Print the Java version to verify
java -version