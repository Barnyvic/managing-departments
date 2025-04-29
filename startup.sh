#!/bin/sh
echo "Running database migrations..."
npm run migration:run
if [ $? -eq 0 ]; then
  echo "Starting the application..."
  npm run start:prod
else
  echo "Migration failed!"
  exit 1
fi 