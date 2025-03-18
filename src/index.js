#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const setupTests = require("./bin/setupTests");
const createFiles = require("./bin/createFiles");
const args = process.argv.slice(2);
const path = require('path')
const scriptName = process.argv[1].split(path.sep).pop();
const testLibraries = {
    jest: args.includes('--jest'),
    mocha: args.includes('--mocha')
};
// initializeProject: 2 steps (create directory + npm init)
// createDirectories: 1 (src) + 7 (subdirs) = 8
// createFiles: 2 files
const TEST_STEPS = [testLibraries.jest, testLibraries.mocha].filter(Boolean).length * 2;
const TOTAL_STEPS = 2+8+2+TEST_STEPS+1;
const { initializeProject, installDependencies } = require("./bin/initializer");
const setupScripts = require("./bin/setupScripts");
const chalk = require("chalk")
process.stdin.setEncoding('utf8');


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

let projectName = "my-app";

console.log(chalk.blue("Enter Project Name: "));
process.stdin.on('data', async function (data) {
    projectName = data.trim();
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
        await installDependencies(projectName, testLibraries, updateProgress);
        await createDirectories(projectName, updateProgress);
        await createFiles(projectName, updateProgress);
        await setupScripts(projectName, testLibraries, updateProgress);
        await setupTests(projectName, testLibraries, updateProgress);
        console.log(chalk.blue(`\n[100%] `) + chalk.green.bold('Project setup completed!'));
    } catch (error) {
        console.error(`Error generating project: ${error}`);
        process.exit(1);
    }
});