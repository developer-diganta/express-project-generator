const fs = require("fs");
/**
 * Creates a directory with the specified path.
 * 
 * @param {string} directory - The path of the directory to create.
 * @returns {Promise<void>} A Promise that resolves when the directory is successfully created.
 */

const createDirectory = async (directory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(directory, { recursive: true }, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = createDirectory;