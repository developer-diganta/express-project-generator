const readFile = require("../utils/readFile");
const createFile = require("../utils/createFile");
const chalk = require("chalk")

/**
 * Reads the package.json file in the project directory,
 * updates the 'scripts' field with the necessary scripts for running
 * the server using nodemon, and writes the updated package.json file.
 * 
 * @param {string} projectName The name of the project to setup scripts for
 */
const setupScripts = async (projectName, testLibraries) => {
    try {
        const script = await readFile(`${projectName}/package.json`);
        const parsedScript = JSON.parse(script);
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
        console.error(chalk.red(`Error running setup script: ${error}`));
        throw error;
    }
}

module.exports = setupScripts;