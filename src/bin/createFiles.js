const createFile = require("../utils/createFile");
const chalk = require("chalk")

/**
 * Creates necessary files for the specified project.
 * This function creates essential files within the project directory,
 * such as 'server.js' for the main server file and 'readme.md' for
 * project documentation. It also logs the creation of each file and
 * success message upon completion.
 * 
 * @param {string} projectName - The name of the project to create files for.
 */

async function createFiles(projectName) {
    try {
        await createFile(`${projectName}/src/server.js`, '');
        console.log(chalk.green("Created server.js"));
        await createFile(`${projectName}/readme.md`, '# Project created using express-app-generator');
        console.log(chalk.green("Created readme.md"));
        console.log(chalk.green('Project generated successfully!'));
        process.exit(0);
    } catch (error) {
        console.error(chalk.red(`Error creating files: ${error}`));
        throw error;
    }
}

module.exports = createFiles;