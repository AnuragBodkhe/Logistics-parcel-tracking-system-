# LogiTrack Development Dockerfile
# Optimized for hot reload and development

FROM node:18-alpine

# Install development dependencies
RUN apk add --no-cache \
    curl \
    git \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S logitrack -u 1001

# Change ownership
RUN chown -R logitrack:nodejs /app

# Switch to non-root user
USER logitrack

# Expose ports
EXPOSE 5173 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5173/ || exit 1

# Start development server
CMD ["npm", "run", "dev"]
