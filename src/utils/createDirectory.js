import { mkdir } from "fs/promises";
import chalk from "chalk";

/**
 * Creates a directory with the specified path.
 * 
 * @param {string} directory - The path of the directory to create.
 * @returns {Promise<void>} A Promise that resolves when the directory is successfully created.
 */
const createDirectory = async (directory) => {
    try {
        await mkdir(directory, { recursive: true });
        console.log(chalk.green(`Created directory: ${directory}`));
    } catch (error) {
        console.error(chalk.red(`Failed to create directory: ${directory}`));
        throw error;
    }
};

export default createDirectory; // ES module export
