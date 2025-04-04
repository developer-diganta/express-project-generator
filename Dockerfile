# Use the official Node.js image as a base
FROM node:16


# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY src ./src

# Command to run the application
CMD ["node", "src/index.js"]
