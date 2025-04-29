#!/bin/sh
echo "Running database migrations..."
node dist/scripts/run-migrations.js
if [ $? -eq 0 ]; then
  echo "Starting the application..."
  npm run start:prod
else
  echo "Migration failed!"
  exit 1
fi 