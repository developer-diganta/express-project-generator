#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const setupTests = require("./bin/setupTests");
const createFiles = require("./bin/createFiles");
const path = require('path');
const scriptName = process.argv[1].split(path.sep).pop();
const { initializeProject, installDependencies } = require("./bin/initializer");
const setupScripts = require("./bin/setupScripts");
const chalk = require("chalk");
const inquirer = require("inquirer").default;

// Remove test library flags from command args
const args = process.argv.slice(2).filter(arg => !['--jest', '--mocha'].includes(arg));

if (args.includes('--help')) {
    console.log('Express Project Generator');
    console.log('GitHub: https://github.com/developer-diganta/express-project-generator');
    console.log('');
    console.log(`Usage: node ${scriptName} [options]`);
    console.log('Options:');
    console.log('  --help       Show this help message');
    console.log('  --version    Show version number');
    process.exit(0);
}

if (args.includes('--version')) {
    const packageJson = require('../package.json');
    console.log("Express Project Generator: v" + packageJson.version);
    process.exit(0);
}

async function main() {
    const responses = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter Project Name:',
            default: 'my-app'
        },
        {
            type: 'list',
            name: 'language',
            message: 'Choose project language:',
            choices: ['JavaScript', 'TypeScript'],
            default: 'JavaScript'
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
    const language = responses.language;
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
    const TS_STEPS = language === 'TypeScript' ? 2 : 0; // tsconfig + build script
    const TOTAL_STEPS = 2 + 8 + 2 + TEST_STEPS + TS_STEPS + 1;

    let completedSteps = 0;
    let lastPercentage = -1;
    
    const updateProgress = () => {
        completedSteps++;
        const percentage = Math.round((completedSteps / TOTAL_STEPS) * 100);
        if (percentage !== lastPercentage) {
            process.stdout.write(chalk.blue(`[${percentage}%] `));
            lastPercentage = percentage;
        }    
    };

    try {
        await initializeProject(projectName, updateProgress);
        await installDependencies(projectName, testLibraries, language);
        await createDirectories(projectName, updateProgress);
        await createFiles(projectName, updateProgress,language);
        await setupScripts(projectName,authorName,version , description,license,start, testLibraries, updateProgress,language);
        await setupTests(projectName, testLibraries, updateProgress,language);
        console.log(chalk.blue(`\n[100%] `) + chalk.green.bold('Project setup completed!'));
        console.log(chalk.green.bold(`Author: ${authorName}`)); 
        console.log(chalk.green.bold(`Version: ${version}`));
        console.log(chalk.green.bold(`Description: ${description}`));
        console.log(chalk.green.bold(`License: ${license}`));

    } catch (error) {
        console.error(`Error generating project: ${error}`);
        process.exit(1);
    }
}

main();