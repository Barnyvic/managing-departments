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

# Install production dependencies and ts-node
COPY --from=builder /app/package*.json ./
RUN npm install --production --legacy-peer-deps && \
    npm install -g ts-node typescript --legacy-peer-deps

# Copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY startup.sh /app/startup.sh

# Make startup script executable
RUN chmod +x /app/startup.sh

# Expose the port
EXPOSE 3000

CMD ["/app/startup.sh"] 