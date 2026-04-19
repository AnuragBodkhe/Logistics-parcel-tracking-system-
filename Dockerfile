# ----------- BUILD STAGE -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install required build tools
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Build app
RUN npm run build


# ----------- PRODUCTION STAGE -----------
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (if exists)
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
