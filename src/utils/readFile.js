const fs = require("fs");

/**
 * Reads a file from the specified file path.
 * 
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise<string>} A Promise that resolves when the file is successfully read.
 */
const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = readFile;