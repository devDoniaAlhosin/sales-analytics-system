#!/bin/bash

# Create api directory if it doesn't exist
mkdir -p api

# Copy the Laravel application files to the api directory
cp -r app api/
cp -r bootstrap api/
cp -r config api/
cp -r database api/
cp -r resources api/
cp -r routes api/
cp -r storage api/
cp artisan api/

# Create the SQLite database file
touch /tmp/database.sqlite
chmod 666 /tmp/database.sqlite

# Set proper permissions
chmod -R 755 api
chmod -R 777 api/storage 