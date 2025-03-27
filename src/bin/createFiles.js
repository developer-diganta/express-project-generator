const createFile = require("../utils/createFile");
const chalk = require("chalk");

/*
 * Boilerplate code for the main server file 'server.js'.
*/
const boilerplateServerCode = `
const express = require('express');
const cors = require('cors');

require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express.js app
const PORT = process.env.PORT || 3000; // Set the port for the server

// Middlewares
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static('static')); // Serve static files from 'static' folder

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this new Express.js Project' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}/\`);
});

module.exports = app;`

/**
 * Creates necessary files for the specified project.
 * This function creates essential files within the project directory,
 * such as 'server.js' for the main server file and 'readme.md' for
 * project documentation. It also logs the creation of each file and
 * success message upon completion.
 * 
 * @param {string} projectName - The name of the project to create files for.
 */

const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`;
  
const tsBoilerplate = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this new Express.js Project' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}/\`);
});

export default app;`;

async function createFiles(projectName, progressCallback,language) {
    try {
        const ext = language === 'TypeScript' ? 'ts' : 'js';
        const boilerplate = language === 'TypeScript' ? tsBoilerplate : boilerplateServerCode;
        await createFile(`${projectName}/src/server.${ext}`, boilerplate);
        console.log(chalk.green("Created server.js"));
        progressCallback();
        if (language === 'TypeScript') {
            await createFile(`${projectName}/tsconfig.json`, tsConfig);
            console.log(chalk.green("Created tsconfig.json"));
            progressCallback();
        }
        await createFile(`${projectName}/readme.md`, '# Project created using express-app-generator');
        console.log(chalk.green("Created readme.md"));
        progressCallback();
        console.log(chalk.green('Project generated successfully!'));
    } catch (error) {
        console.error(chalk.red(`Error creating files: ${error}`));
        throw error;
    }
}

module.exports = createFiles;