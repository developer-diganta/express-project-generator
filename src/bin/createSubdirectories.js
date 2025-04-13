const createDirectory = require("../utils/createDirectory");
const chalk = require("chalk")

/**
 * Creates subdirectories for the specified project.
 * This function creates a set of predefined subdirectories
 * within the project directory, such as controllers, services,
 * routes, configs, middlewares, utils, and static.
 * 
 * @param {string} projectName - The name of the project to create subdirectories for.
 */

const createSubdirectories=async(basePath, progressCallback) =>{
    const directories = [
        `${basePath}/controllers`,
        `${basePath}/services`,
        `${basePath}/routes`,
        `${basePath}/configs`,
        `${basePath}/middlewares`,
        `${basePath}/utils`,
        `${basePath}/static`
    ];

    try {
        for (const dir of directories) {
            await createDirectory(dir);
            console.log(chalk.green(`Created folder ${dir}`));
            progressCallback();
        }
    } catch (error) {
        console.error(chalk.red(`Error creating subdirectories: ${error}`));
        throw error;
    }
}

module.exports = createSubdirectories;