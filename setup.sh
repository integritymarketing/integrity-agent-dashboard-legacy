   #!/bin/bash

   set -e # Exit on errors
   set -x # Debug mode - print each command before running

   # Print the current working directory
   echo "Current directory before script: $(pwd)"

   # Clean up the current directory (remove all files and folders, including hidden ones)
   echo "Cleaning up the current directory..."
   rm -rf ./* ./.??*

   # Add SSH key for the deploy
   echo "$SSH_KEY" > ~/.ssh/deploy_key
   chmod 600 ~/.ssh/deploy_key
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/deploy_key

   # Prevent SSH host key verification issues
   mkdir -p ~/.ssh
   touch ~/.ssh/known_hosts
   ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

   # Clone the repository using SSH
   echo "Cloning the repository using SSH..."
   GIT_REPO_URL="git@github.com:integritymarketing/ae-agent-portal.git"
   GIT_BRANCH="SPW-286840-Integrate-with-SonarCloud"

   git clone --branch "$GIT_BRANCH" --single-branch "$GIT_REPO_URL" .

   # Fetch full Git history (unshallow the repository)
   echo "Fetching full Git history..."
   git fetch --unshallow || echo "Failed to fetch full history. Continuing with shallow clone."

   # Verify integrity of Git objects
   echo "Verifying Git objects..."
   git fsck || echo "Git integrity check reported issues."

   # Debug Git state
   echo "Current Git commit: $(git rev-parse HEAD || echo 'No Git commit found')"

   # Ensure Java installation for SonarQube
   mise use -g java@openjdk-21
   java -version

   # Run SonarQube analysis
   yarn sonar -X