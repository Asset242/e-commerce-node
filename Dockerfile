# Use Node.js 22 as the base image
FROM node:20-alpine3.20

RUN apk add --no-cache python3 make g++ libc6-compat

# Set working directory for this specific app
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install


COPY .env ./

# Copy the entire project
COPY . .

# Generate Prisma Client (Fixes the issue)
RUN npx prisma generate

# Build the TypeScript project
RUN npx tsc

# Expose the port (same as defined in .env)
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]
