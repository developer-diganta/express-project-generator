import { exec } from "child_process";
import chalk from "chalk";

/**
 * Executes a shell command in the specified folder path.
 * 
 * @param {string} cmd - The shell command to execute.
 * @param {string} folderPath - The path of the folder in which to execute the command.
 * @returns {Promise<{stdout: string, stderr: string}>} A Promise that resolves with the stdout and stderr outputs of the command.
 */

const executeCommand = async (cmd, folderPath) => {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: folderPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(chalk.red(`Command failed: ${cmd}`));
                console.error(chalk.red(`Error: ${error.message}`));
                reject(error);
                return;
            }
            if (stderr) {
                console.warn(chalk.yellow(`Warning: ${stderr}`));
            }
            console.log(chalk.green(`Executed: ${cmd}`));
            resolve({ stdout, stderr });
        });
    });
};

export default executeCommand; // ✅ Exporting as default (ESM)
