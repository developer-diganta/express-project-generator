import createDirectory from "../utils/createDirectory.js";  // ✅ No curly braces
import createSubdirectories from "./createSubdirectories.js";
import chalk from "chalk";

/**
 * Creates directories and subdirectories for the specified project.
 * 
 * @param {string} projectName - The name of the project to create directories for.
 */
export async function createDirectories(projectName, progressCallback) {
    try {
        await createDirectory(`${projectName}/src`);
        console.log(chalk.green('Created src folder'));
        progressCallback();
        await createSubdirectories(projectName, progressCallback);
    } catch (error) {
        console.error(chalk.red(`Error creating directories: ${error}`));
        throw error;
    }
}
