#!/bin/bash

# Install dependencies
composer install --no-dev --optimize-autoloader

# Create necessary directories
mkdir -p /tmp
mkdir -p public

# Set up database
touch /tmp/database.sqlite
chmod 666 /tmp/database.sqlite

# Run migrations
php artisan migrate --force

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure proper permissions
chmod -R 755 public
chmod -R 777 public/storage 