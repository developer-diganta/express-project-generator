import createDirectory from "../utils/createDirectory.js"; // Default import
import executeCommand from "../utils/executeCommand.js"; // Default import
import chalk from "chalk";

/**
 * Initializes a new Node.js project with the specified project name.
 * This function creates a directory for the project, runs 'npm init -y'
 * to generate a default package.json file, and logs the output.
 * 
 * @param {string} projectName - The name of the project to initialize.
 * @param {Function} progressCallback - Callback to track progress.
 */
export const initializeProject = async (projectName, progressCallback) => {
    try {
        const cmd = `npm init -y`;
        await createDirectory(projectName);
        progressCallback();
        const { stdout } = await executeCommand(cmd, `./${projectName}`);
        console.log(chalk.green(`npm: ${stdout}`));
        progressCallback();
    } catch (error) {
        console.error(chalk.red(`Error initializing project: ${error}`));
        throw error;
    }
};

/**
 * Installs the dependencies for a new Node.js project.
 * This function runs 'npm install express dotenv cors -D nodemon' to install
 * the Express.js framework, the dotenv library, the cors middleware, and nodemon.
 * 
 * @param {string} projectName - The name of the project.
 */
export const installDependencies = async (projectName) => {
    try {
        const cmd = `npm install express dotenv cors && npm install -D nodemon`;
        const { stdout } = await executeCommand(cmd, `./${projectName}`);
        console.log(chalk.green(`npm: ${stdout}`));
    } catch (error) {
        console.error(chalk.red(`Error installing dependencies: ${error}`));
        throw error;
    }
};
