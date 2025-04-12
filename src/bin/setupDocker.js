const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
console.log("genereating docker");
module.exports = async function setupDocker(projectName, updateProgress) {
    try {
        const dockerfileContent = `# Use the official Node.js LTS image as base
# Use an official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
`;

        const dockerComposeContent = `version: '3.8'

services:
  app:
    build: .
    container_name: node_app
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
`;

        fs.writeFileSync(path.join(projectName, 'Dockerfile'), dockerfileContent);
        updateProgress();
        
        fs.writeFileSync(path.join(projectName, 'docker-compose.yml'), dockerComposeContent);
        updateProgress();
        
        const readmePath = path.join(projectName, 'README.md');
        let readmeContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
        
        const dockerInstructions = `\n\n## Docker Support\n\nThis project includes Docker configuration to containerize the application.\n\n### Running with Docker\n\n1. Build the Docker image:\n   \`\`\`bash\n   docker build -t ${projectName} .\n   \`\`\`\n\n2. Run the container:\n   \`\`\`bash\n   docker run -p 3000:3000 ${projectName}\n   \`\`\`\n\n### Running with Docker Compose\n\nSimply run:\n\`\`\`bash\ndocker-compose up\n\`\`\`\n\nFor development with live reload, you might want to use nodemon inside the container.`;
        
        fs.writeFileSync(readmePath, readmeContent + dockerInstructions);
        updateProgress();

        console.log(chalk.green('✓ Docker configuration added'));
    } catch (err) {
        console.error(chalk.red('Error generating Docker config:', err));
        throw err;
    }
};