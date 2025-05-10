#!/bin/bash

# Create necessary directories
mkdir -p /tmp
mkdir -p public

# Copy database file if it exists
if [ -f database/database.sqlite ]; then
    cp database/database.sqlite /tmp/database.sqlite
else
    # Create new SQLite database
    touch /tmp/database.sqlite
fi

# Set proper permissions
chmod 666 /tmp/database.sqlite

# Install dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Clear and cache configuration
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Copy all files to public directory
cp -r * public/
cp -r .env* public/
cp -r .htaccess public/

# Ensure proper permissions
chmod -R 755 public
chmod -R 777 public/storage 