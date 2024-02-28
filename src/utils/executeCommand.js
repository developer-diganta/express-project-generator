const { exec } = require('child_process');
/**
 * Executes a shell command in the specified folder path.
 * 
 * @param {string} cmd - The shell command to execute.
 * @param {string} folderPath - The path of the folder in which to execute the command.
 * @returns {Promise<{stdout: string, stderr: string}>} A Promise that resolves with the stdout and stderr outputs of the command.
 */

const executeCommand = async (cmd, folderPath) => {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd: folderPath },(error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });
    });
}

module.exports = executeCommand;