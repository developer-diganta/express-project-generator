const createDirectory = require("../utils/createDirectory");
const executeCommand = require("../utils/executeCommand");
const chalk = require("chalk")

/**
 * Initializes a new Node.js project with the specified project name.
 * This function creates a directory for the project, runs 'npm init -y'
 * to generate a default package.json file, and logs the output.
 * 
 * @param {string} projectName - The name of the project to initialize.
 */
const initializeProject = async (projectName, progressCallback) => {
    try {
        const cmd = `npm init -y > nul 2>&1`;
        await createDirectory(projectName)
        progressCallback();
        const { stdout, stderr } = await executeCommand(cmd, `./${projectName}`);
        console.log(chalk.green(`npm: ${stdout}`));
        progressCallback();
    } catch (error) {
        console.error(chalk.red(`Error initializing project: ${error}`));
        throw error;
    }
}

/**
 * Installs the dependencies for a new Node.js project.
 * This function runs 'npm install express dotenv cors -D nodemon' to install
 * the Express.js framework, the dotenv library, the cors middleware, and nodemon.
 * 
 * @param {string} projectName 
 */
    try {
        let cmd = `npm install express dotenv cors`;
        if (language === 'TypeScript') {
            cmd += ` @types/express @types/cors @types/node typescript ts-node`;
        }
        cmd += ` && npm install -D nodemon${language === 'TypeScript' ? ' ts-node-dev' : ''}`;
        if (testLibraries.jest) cmd += ' jest supertest';
        if (testLibraries.jest && language === 'TypeScript') cmd += ' @types/jest ts-jest';
        if (testLibraries.mocha) cmd += ' mocha chai chai-http';
        if (installJsonwebtoken) cmd += ' jsonwebtoken';
        if(addDatabase === 'MongoDB') {
            cmd += ' mongoose';
            if (language === 'TypeScript') cmd += ' @types/mongoose';
        }
        if (installJsonwebtoken && language === 'TypeScript') cmd += ' @types/jsonwebtoken';
        if (installHelmet) cmd += ' helmet';
        if (installHelmet && language === 'TypeScript') cmd += ' @types/helmet';
        if (testLibraries.mocha && language === 'TypeScript') cmd += ' @types/mocha @types/chai @types/chai-http';
        const { stdout, stderr } = await executeCommand(cmd, `./${projectName}`);
        // console.log(chalk.green(`npm: ${stdout}`));
    } catch (error) {
        console.error(chalk.red(`Error installing dependencies: ${error}`));
        throw error;
    }
}

module.exports = {initializeProject, installDependencies};