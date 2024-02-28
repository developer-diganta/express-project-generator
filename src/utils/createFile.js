const fs = require("fs");
/**
 * Creates a file with the specified file path and data.
 * 
 * @param {string} filePath - The path of the file to create.
 * @param {string | Buffer | Uint8Array} data - The data to write to the file.
 * @returns {Promise<void>} A Promise that resolves when the file is successfully created.
 */

const createFile=(filePath, data)=> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = createFile;