const readFile = require("../utils/readFile");
const createFile = require("../utils/createFile");
const chalk = require("chalk")

/**
 * Reads the package.json file in the project directory,
 * updates the 'scripts' field with the necessary scripts for running
 * the server using nodemon, and writes the updated package.json file.
 * 
 * @param {string} projectName The name of the project to setup scripts for
 * @param {string} authorName The name of the author which will be added to the package.json file
 * @param {string} version The version of the package
 * @param {string} description The description of the package
 * @param {string} license The license of the package
 * @param {string} start The start of the package
 */

const setupScripts = async (projectName,authorName,version , description,license,start, testLibraries, updateProgress,language, installHelmet) => {
    try {
        const script = await readFile(`${projectName}/package.json`);
        const parsedScript = JSON.parse(script);
        if (language === 'TypeScript') {
            parsedScript.scripts = {
                dev: "ts-node-dev src/server.ts",
                build: "tsc",
                start: "node dist/server.js",
                test: "jest"
            };
        } else {
            parsedScript.scripts = {
                dev: "nodemon src/server.js",
                start: "node src/server.js"
            };
        }
        parsedScript.author = authorName;
        parsedScript.version = version;
        parsedScript.description = description;
        parsedScript.license = license;
        if (testLibraries.jest) parsedScript.scripts.test = "jest";
        if (testLibraries.mocha) {
            parsedScript.scripts.test = language === 'TypeScript' 
            ? "mocha --require ts-node/register test/**/*.test.ts"
            : "mocha test/**/*.test.js";
        }
        parsedScript.scripts.dev = "nodemon src/server.js";
        parsedScript.scripts.start = start;

        if (installHelmet) {
            parsedScript.dependencies = parsedScript.dependencies || {};
            parsedScript.dependencies.helmet = "^6.1.5";
            if (language === 'TypeScript') {
                parsedScript.devDependencies = parsedScript.devDependencies || {};
                parsedScript.devDependencies['@types/helmet'] = "^6.1.0";
            }
        }

        await createFile(`${projectName}/package.json`, JSON.stringify(parsedScript, null, 2));
        console.log(chalk.green("Setup scripts successfully!"));
    } catch (error) {
        console.error(chalk.red(`Error running setup script: ${error}`));
        throw error;
    }
}

module.exports = setupScripts;