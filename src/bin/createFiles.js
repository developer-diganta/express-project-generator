import createFile from "../utils/createFile.js";
import chalk from "chalk";

/*
 * Boilerplate code for the main server file 'server.js'.
 */
const boilerplateServerCode = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

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

`;


module.exports = app;`


/**
 * Creates necessary files for the specified project.
 * @param {string} projectName - The name of the project to create files for.
 * @param {Function} progressCallback - Callback to indicate progress.
 */
export async function createFiles(projectName, progressCallback) {
    try {
        await createFile(`${projectName}/src/server.js`, boilerplateServerCode);
        console.log(chalk.green("Created server.js"));
        progressCallback();
        await createFile(`${projectName}/readme.md`, '# Project created using express-app-generator');
        console.log(chalk.green("Created readme.md"));
        progressCallback();
        console.log(chalk.green('Project generated successfully!'));
    } catch (error) {
        console.error(chalk.red(`Error creating files: ${error}`));
        throw error;
    }
}
