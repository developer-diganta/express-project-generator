const createDirectory = require("../utils/createDirectory");
const createSubdirectories = require("./createSubdirectories");
const chalk = require("chalk")

/**
 * Creates directories and subdirectories for the specified project.
 * This function creates the main 'src' directory for the project,
 * and then invokes the 'createSubdirectories' function to create
 * additional subdirectories within the 'src' directory. It logs the
 * creation of the 'src' directory and any errors encountered during
 * the process.
 * 
 * @param {string} projectName - The name of the project to create directories for.
 */

const  createDirectories = async (projectName, progressCallback, modules = [])=> {
    try {
        if (modules.length > 0) {
            // Create module directories
            for (const module of modules) {
                const modulePath = `${projectName}/${module}/src`;
                await createDirectory(modulePath);
                console.log(chalk.green(`Created ${module} module folder`));
                progressCallback();
                await createSubdirectories(modulePath, progressCallback);
            }
        } else {
            await createDirectory(`${projectName}/src`);
            console.log(chalk.green('Created src folder'));
            progressCallback();
            await createSubdirectories(`${projectName}/src`, progressCallback);
        }
    } catch (error) {
        console.error(chalk.red(`Error creating directories: ${error}`));
        throw error;
    }
}

module.exports = createDirectories;