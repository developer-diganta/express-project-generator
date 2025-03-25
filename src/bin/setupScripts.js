import readFile from "../utils/readFile.js";
import createFile from "../utils/createFile.js"; 

import chalk from "chalk";

/**
 * Reads the package.json file in the project directory,
 * updates the 'scripts' field with the necessary scripts for running
 * the server using nodemon, and writes the updated package.json file.
 * 
 * @param {string} projectName The name of the project to setup scripts for.
 */

export const setupScripts = async (projectName) => {

const setupScripts = async (projectName, testLibraries) => {

    try {
        const packageJsonPath = `${projectName}/package.json`;

        // Read the package.json file
        const script = await readFile(packageJsonPath);
        const parsedScript = JSON.parse(script);


        // Ensure scripts exist or merge with existing ones
        parsedScript.scripts = {
            ...parsedScript.scripts,
            dev: "nodemon src/server.js",
            start: "node src/server.js"
        };

        // Write updated package.json file
        await createFile(packageJsonPath, JSON.stringify(parsedScript, null, 2));
        console.log(chalk.green(`Scripts added successfully in ${packageJsonPath}`));

        parsedScript.scripts = {
            dev: "nodemon src/server.js",
            start: "node src/server.js"
        };
        if (testLibraries.jest) parsedScript.scripts.test = "jest";
        if (testLibraries.mocha) parsedScript.scripts.test = "mocha test/**/*.js";
        parsedScript.scripts.dev = "nodemon src/server.js";
        parsedScript.scripts.start = "nodemon src/server.js";
        await createFile(`${projectName}/package.json`, JSON.stringify(parsedScript, null, 2));
        console.log(chalk.green("Setup scripts successfully!"));

    } catch (error) {
        console.error(chalk.red(`Error setting up scripts: ${error.message}`));
        throw error;
    }
};
