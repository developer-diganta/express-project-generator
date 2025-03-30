import readFile from "../utils/readFile.js";
import createFile from "../utils/createFile.js";
import chalk from "chalk";

/**
 * Reads the package.json file in the project directory,
 * updates the 'scripts' field with the necessary scripts for running
 * the server using nodemon, and writes the updated package.json file.
 * 
 * @param {string} projectName - The name of the project to setup scripts for.
 * @param {string[]} [testLibraries] - Optional array of test libraries.
 */
export const setupScripts = async (projectName, testLibraries) => {
    try {
        const packageJsonPath = `${projectName}/package.json`;

        const script = await readFile(packageJsonPath);
        const parsedScript = JSON.parse(script);

        parsedScript.scripts = {
            ...parsedScript.scripts,
            dev: "nodemon src/server.js",
            start: "node src/server.js"
        };

        await createFile(packageJsonPath, JSON.stringify(parsedScript, null, 2));
        console.log(chalk.green(`Scripts added successfully in ${packageJsonPath}`));

    } catch (error) {
        console.error(chalk.red(`Error setting up scripts: ${error.message}`));
        throw error;
    }
};
