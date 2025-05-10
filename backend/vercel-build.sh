#!/bin/bash

# Install system dependencies
apt-get update
apt-get install -y libssl1.1 libssl-dev

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Create necessary directories
mkdir -p /tmp
mkdir -p api

# Copy necessary files to api directory
cp -r app api/
cp -r bootstrap api/
cp -r config api/
cp -r database api/
cp -r resources api/
cp -r routes api/
cp -r storage api/
cp -r vendor api/
cp .env api/
cp artisan api/

# Set up database
touch /tmp/database.sqlite
chmod 666 /tmp/database.sqlite

# Run migrations
cd api && php artisan migrate --force

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure proper permissions
chmod -R 755 api
chmod -R 777 storage 