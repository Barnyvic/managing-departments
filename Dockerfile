# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only the built files and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create a shell script to run migrations and start the app
RUN echo '#!/bin/sh\n\
    echo "Running database migrations..."\n\
    node dist/scripts/run-migrations.js\n\
    if [ $? -eq 0 ]; then\n\
    echo "Starting the application..."\n\
    npm run start:prod\n\
    else\n\
    echo "Migration failed!"\n\
    exit 1\n\
    fi' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose the port
EXPOSE 3000

CMD ["/app/start.sh"] 