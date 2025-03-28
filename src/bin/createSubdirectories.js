import createDirectory from "../utils/createDirectory.js";
import chalk from "chalk";

/**
 * Creates subdirectories for the specified project.
 * This function creates a set of predefined subdirectories
 * within the project directory, such as controllers, services,
 * routes, configs, middlewares, utils, and static.
 * 
 * @param {string} projectName - The name of the project to create subdirectories for.
 */
const createSubdirectories = async (projectName, progressCallback) => {
    const directories = [
        `${projectName}/src/controllers`,
        `${projectName}/src/services`,
        `${projectName}/src/routes`,
        `${projectName}/src/configs`,
        `${projectName}/src/middlewares`,
        `${projectName}/src/utils`,
        `${projectName}/src/static`
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
};

export default createSubdirectories; // Changed named export to default export
