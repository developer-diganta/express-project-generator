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
        const cmd = `npm init -y`;
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
const installDependencies = async (projectName, testLibraries) => {
    try {
        let cmd = `npm install express dotenv cors && npm install -D nodemon`;
        if (testLibraries.jest) cmd += ' jest supertest';
        if (testLibraries.mocha) cmd += ' mocha chai chai-http';
        const { stdout, stderr } = await executeCommand(cmd, `./${projectName}`);
        console.log(chalk.green(`npm: ${stdout}`));
    } catch (error) {
        console.error(chalk.red(`Error installing dependencies: ${error}`));
        throw error;
    }
}

module.exports = {initializeProject, installDependencies};