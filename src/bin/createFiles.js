const createFile = require("../utils/createFile");
const chalk = require("chalk");

/*
 * Boilerplate code for the main server file 'server.js'.
*/
const boilerplateServerCode = (installJsonwebtoken ,addDatabase) =>  `
const express = require('express');
const cors = require('cors');
${installJsonwebtoken === 'JWT' ? "const jwt = require('jsonwebtoken');" : ''}

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
  
const tsBoilerplate = (installJsonwebtoken) =>`import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
${installJsonwebtoken === 'JWT' ?  "import jwt from 'jsonwebtoken';":""} 


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

const dbConfig = (language) => `
${language === 'TypeScript'  ? "import mongoose from 'mongoose'" : "const  mongoose = require('mongoose');"}
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
`;

const userModel = (language) => `
${language === 'TypeScript'  ? "import mongoose from 'mongoose'" : "const  mongoose = require('mongoose');"}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
`;

async function createFiles(projectName, progressCallback,language ,installJsonwebtoken,addDatabase) {
    try {
        const ext = language === 'TypeScript' ? 'ts' : 'js';
        const boilerplate = language === 'TypeScript' ? tsBoilerplate(installJsonwebtoken, addDatabase) : boilerplateServerCode(installJsonwebtoken,addDatabase);
        await createFile(`${projectName}/src/server.${ext}`, boilerplate);
        console.log(chalk.green("Created server.js"));
        progressCallback();
        if (language === 'TypeScript') {
            await createFile(`${projectName}/tsconfig.json`, tsConfig);
            console.log(chalk.green("Created tsconfig.json"));
            progressCallback();
        }
        if (addDatabase === 'MongoDB') {
            await createFile(`${projectName}/src/configs/db.js`, dbConfig(language));
            console.log(chalk.green("Created db.js"));
            progressCallback();
            await createFile(`${projectName}/src/models/userModel.js`, userModel(language));
            console.log(chalk.green("Created user.js"));
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