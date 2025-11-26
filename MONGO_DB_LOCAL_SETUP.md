# MongoDB Local Setup Guide

This guide provides step-by-step instructions for setting up MongoDB locally on macOS for the Kin Quest project.

## Quick Start

If you just want to start MongoDB quickly and you're getting a "config file not found" error:

```bash
# Make sure directories exist
mkdir -p ~/data/db ~/data/log/mongodb

# Start MongoDB directly (no config file needed) - runs in background
mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongodb.log &
```

**Note:** The `&` at the end runs MongoDB in the background. The `--fork` option is not supported on macOS.

## Prerequisites

- macOS with ARM architecture (Apple Silicon)
- Administrator privileges (sudo access)
- MongoDB Enterprise Server binaries downloaded

## Setup Steps

### 1. Install MongoDB Binaries

First, copy the MongoDB binaries to your system PATH:

```bash
sudo cp ~/Documents/software/mongodb-macos-aarch64-enterprise--8.2.1/bin/* /usr/local/bin/
```

### 2. Create Data and Log Directories

Create the necessary directories for MongoDB data and logs:

```bash
sudo mkdir -p ~/data/db
sudo mkdir -p ~/data/log/mongodb
```

### 3. Set Proper Ownership

Change the ownership of the directories to your user account:

```bash
# Check your username first
id

# Set ownership (replace 'ravi' with your actual username)
sudo chown ravi ~/data/db
sudo chown ravi ~/data/log/mongodb
```

### 4. Start MongoDB Server

Start MongoDB as a background process:

```bash
nohup mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongodb.log >/dev/null &
```

## Verification

To verify that MongoDB is running properly:

```bash
# Check if MongoDB process is running
ps aux | grep mongod

# Connect to MongoDB (if mongo shell is installed)
mongo

# Or check the log file for any errors
tail -f ~/data/log/mongodb/mongodb.log
```

## Configuration Details

- **Data Directory**: `~/data/db`
- **Log Directory**: `~/data/log/mongodb`
- **Log File**: `~/data/log/mongodb/mongodb.log`
- **MongoDB Version**: Enterprise 8.2.1
- **Architecture**: ARM64 (Apple Silicon)

## Stopping MongoDB

To stop the MongoDB server:

```bash
# Find the MongoDB process ID
ps aux | grep mongod

# Kill the process (replace PID with actual process ID)
kill <PID>
```

## Alternative Startup Methods

### Method 1: Using Command Line Parameters (Recommended)

As shown in step 4 above:

```bash
nohup mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongodb.log >/dev/null &
```

### Method 2: Create a Configuration File

If you prefer using a config file, create one:

```bash
# Create the config directory
sudo mkdir -p /usr/local/etc

# Create a MongoDB configuration file (replace 'ravi' with your username)
sudo tee /usr/local/etc/mongod.conf > /dev/null << 'EOF'
# MongoDB Configuration File for macOS
# Network settings
net:
  port: 27017
  bindIp: 127.0.0.1

# Storage settings
storage:
  dbPath: /Users/ravi/data/db

# Logging settings
systemLog:
  destination: file
  logAppend: true
  path: /Users/ravi/data/log/mongodb/mongodb.log

# Process management
processManagement:
  pidFilePath: /Users/ravi/data/log/mongodb/mongod.pid
EOF

# Then start MongoDB with the config file
mongod --config /usr/local/etc/mongod.conf &
```

**Important Notes for macOS:**
- The `--fork` option is not supported on macOS
- Use `&` at the end of the command to run MongoDB in the background
- Replace `/Users/ravi/` with your actual home directory path in the config file

## Troubleshooting

### Common Issues and Solutions

**1. Config file not found error:**
```
Error opening config file '/usr/local/etc/mongod.conf': No such file or directory
```
**Solution:** Use Method 1 (command line parameters) or create the config file as shown in Method 2 above.

**2. Permission denied errors:**
- Ensure you have proper permissions on the data and log directories
- Run the `sudo chown` commands as shown in step 3

**3. Port already in use:**
```bash
# Check if MongoDB is already running
ps aux | grep mongod

# Check what's using port 27017
lsof -i :27017

# Kill existing MongoDB process if needed
pkill mongod
```

**4. Other common issues:**
- Check the log file for any error messages: `tail -f ~/data/log/mongodb/mongodb.log`
- Verify that port 27017 (default MongoDB port) is not being used by another process
- Make sure you have sufficient disk space in the data directory
- Ensure the data directory exists and is writable: `ls -la ~/data/`

## Project Integration

Once MongoDB is running, update your backend configuration in `backend/src/config/database.js` to connect to the local MongoDB instance at `mongodb://localhost:27017/kinquest`.