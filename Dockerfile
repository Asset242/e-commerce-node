# Use Node.js 22 as the base image
FROM node:22

# Set working directory for this specific app
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .


# Build the TypeScript project
RUN npx tsc

# Expose the port (same as defined in .env)
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]