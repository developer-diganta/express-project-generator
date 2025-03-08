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

module.exports = initializeProject;