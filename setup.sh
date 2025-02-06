#!/bin/bash

set -e
set -x

# Install Java JRE (using Mise for better compatibility in environments)
mise use -g java@openjdk-21

# Verify Java installation
java -version

# Run SonarQube analysis with debug mode for more insights
yarn sonar -X