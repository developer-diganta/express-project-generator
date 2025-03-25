import fs from "fs/promises";
import chalk from "chalk";

/**
 * Creates a file with the specified file path and data.
 * 
 * @param {string} filePath - The path of the file to create.
 * @param {string | Buffer | Uint8Array} data - The data to write to the file.
 * @returns {Promise<void>} A Promise that resolves when the file is successfully created.
 */
const createFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, data);
        console.log(chalk.green(`Created file: ${filePath}`));
    } catch (error) {
        console.error(chalk.red(`Failed to create file: ${filePath}`));
        throw error;
    }
};

// ✅ Use `export default` for ES Modules
export default createFile;
