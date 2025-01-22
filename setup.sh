#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -x  # Enable debug mode to log commands as they are executed

# Update system package index
echo "Updating package index..."

sudo apt update
sudo apt upgrade -y

# Add the PPA for OpenJDK (optional but recommended for latest updates)
echo "Adding PPA for OpenJDK..."
sudo add-apt-repository ppa:openjdk-r/ppa -y
sudo apt update

# Install OpenJDK 17 JRE
echo "Installing OpenJDK 17 JRE..."
sudo apt install -y openjdk-17-jre

# (Optional) Install OpenJDK 17 JDK if needed
echo "Installing OpenJDK 17 JDK (optional)..."
sudo apt install -y openjdk-17-jdk

# Configure default 'java' version
echo "Configuring default Java version..."
sudo update-alternatives --config java

# (Optional) Configure default 'javac' version if JDK is installed
if command -v javac &>/dev/null; then
  echo "Configuring default Javac version..."
  sudo update-alternatives --config javac
fi

# Set JAVA_HOME environment variable
echo "Exporting JAVA_HOME..."
JAVA_HOME_PATH=$(readlink -f /usr/bin/java | sed "s:/bin/java::")
if ! grep -q "JAVA_HOME" ~/.bashrc; then
  echo "export JAVA_HOME=${JAVA_HOME_PATH}" >> ~/.bashrc
  echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
  source ~/.bashrc
fi

# Verify installation
echo "Verifying Java version..."
java -version

if command -v javac &>/dev/null; then
  javac -version
else
  echo "Javac is not installed (JRE-only system)"
fi

echo "Java 17 installation complete!"