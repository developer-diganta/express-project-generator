import readFile from "../utils/readFile.js";
import createFile from "../utils/createFile.js";
import chalk from "chalk";


export const setupScripts = async (projectName, testLibraries) => {

 * @param {string} projectName The name of the project to setup scripts for
 * @param {string} authorName The name of the author which will be added to the package.json file
 * @param {string} version The version of the package
 * @param {string} description The description of the package
 * @param {string} license The license of the package
 * @param {string} start The start of the package
 */

const setupScripts = async (projectName,authorName,version,description, license,start,testLibraries) => {



const setupScripts = async (projectName,authorName,version , description,license,start, testLibraries, updateProgress,language) => {

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

        await createFile(`${projectName}/package.json`, JSON.stringify(parsedScript, null, 2));
        console.log(chalk.green("Setup scripts successfully!"));

    } catch (error) {
        console.error(chalk.red(`Error setting up scripts: ${error.message}`));
        throw error;
    }
};
