   #!/bin/bash

   set -e # Exit on errors
   set -x # Debug mode - print each command before running

   # Print the current working directory
   echo "Current directory before script: $(pwd)"

   # Clean up the current directory (remove all files and folders, including hidden ones)
   echo "Cleaning up the current directory..."
   rm -rf ./* ./.??*

   # Clone the repository using authenticated Git
   echo "Cloning the repository using authenticated Git..."
   GIT_REPO_URL="https://$GH_TOKEN@github.com/integritymarketing/ae-agent-portal.git" # Use the token from environment variables
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