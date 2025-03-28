import fs from "fs/promises";
import chalk from "chalk";

/**
 * Reads a file from the specified file path.
 * 
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise<string>} A Promise that resolves with the file content or rejects with an error.
 */
const readFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, "utf8");
        console.log(chalk.green(`Successfully read file: ${filePath}`));
        return data;
    } catch (error) {
        console.error(chalk.red(`Error reading file: ${filePath}`));
        throw error;
    }
};

// ✅ Use `export default` for ES Modules
export default readFile;
