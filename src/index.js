#!/usr/bin/env node

import { createDirectories } from "./bin/createDirectories.js";
import { createFiles } from "./bin/createFiles.js";
import { initializeProject, installDependencies } from "./bin/initializer.js";
import { setupScripts } from "./bin/setupScripts.js";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.stdin.setEncoding("utf8");

// Remove test library flags from command args
const args = process.argv.slice(2).filter(arg => !["--jest", "--mocha"].includes(arg));

if (args.includes("--help")) {
  console.log("Express Project Generator");
  console.log("GitHub: https://github.com/developer-diganta/express-project-generator");
  console.log("");
  console.log(`Usage: node ${process.argv[1]} [options]`);
  console.log("Options:");
  console.log("  --help       Show this help message");
  console.log("  --version    Show version number");
  process.exit(0);
}

if (args.includes("--version")) {
  const packageJsonPath = new URL("../package.json", import.meta.url);
  import(packageJsonPath, { assert: { type: "json" } })
    .then((packageJson) => {
      console.log("Express Project Generator: v" + packageJson.default.version);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error reading package.json:", error);
      process.exit(1);
    });
}

async function main() {

  console.log(chalk.blue("Enter Project Name: "));
  process.stdin.on("data", async function (data) {
    const projectName = data.trim();

    const responses = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter Project Name:',
            default: 'my-app'
        },
        {
            type: 'input',
            name: 'authorName',
            message: 'Enter Author Name:',
            default: 'Anonymous'
        },
        {
            type: 'input',
            name: 'version',
            message: 'Enter Version:',
            default: '1.0.0'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter Description:',
            default: ''
        },
        {
            type: 'input',
            name: 'license',
            message: 'Enter License:',
            default: 'ISC'
        },
        {
            type: 'string',
            name:'start',
            message: 'Enter Start Command:',
            default: 'node src/server.js'
        },
        {
            type: 'confirm',
            name: 'addTests',
            message: 'Would you like to add test scripts?',
            default: false
        },
        {
            type: 'list',
            name: 'testFramework',
            message: 'Which test framework would you like to use?',
            choices: ['Jest', 'Mocha'],
            when: (answers) => answers.addTests
        }
    ]);

    const projectName = responses.projectName;
    const authorName = responses.authorName;
    const version = responses.version;
    const description = responses.description;  
    const license = responses.license;
    const start = responses.start;

    const testLibraries = {
        jest: responses.testFramework === 'Jest',
        mocha: responses.testFramework === 'Mocha'
    };

    // Calculate total steps based on test selection
    const TEST_STEPS = [testLibraries.jest, testLibraries.mocha].filter(Boolean).length * 2;
    const TOTAL_STEPS = 2 + 8 + 2 + TEST_STEPS + 1;


    let completedSteps = 0;
    let lastPercentage = -1;

    const updateProgress = () => {
      completedSteps++;
      const percentage = Math.round((completedSteps / 12) * 100);
      if (percentage !== lastPercentage) {
        process.stdout.write(chalk.blue(`[${percentage}%] `));
        lastPercentage = percentage;
      }
    };

    try {

      await initializeProject(projectName, updateProgress);
      await installDependencies(projectName, updateProgress);
      await createDirectories(projectName, updateProgress);
      await createFiles(projectName, updateProgress);
      await setupScripts(projectName, updateProgress);
      console.log(chalk.blue(`\n[100%] `) + chalk.green.bold("Project setup completed!"));

        await initializeProject(projectName,updateProgress);
        await installDependencies(projectName, testLibraries);
        await createDirectories(projectName, updateProgress);
        await createFiles(projectName, updateProgress);
        await setupScripts(projectName,authorName,version , description,license,start, testLibraries);
        await setupTests(projectName , testLibraries);
        console.log(chalk.blue(`\n[100%] `) + chalk.green.bold('Project setup completed!'));
        console.log(chalk.green.bold(`Author: ${authorName}`)); 
        console.log(chalk.green.bold(`Version: ${version}`));
        console.log(chalk.green.bold(`Description: ${description}`));
        console.log(chalk.green.bold(`License: ${license}`));


    } catch (error) {
      console.error(`Error generating project: ${error}`);
      process.exit(1);
    }
  });
}

main();
