#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const createFiles = require("./bin/createFiles");
const { initializeProject, installDependencies } = require("./bin/initializer");
const setupScripts = require("./bin/setupScripts");
const chalk = require("chalk")
const path = require('path')

process.stdin.setEncoding('utf8');

const args = process.argv.slice(2);
const scriptName = process.argv[1].split(path.sep).pop();

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
    try {
        await initializeProject(projectName);
        await installDependencies(projectName);
        await createDirectories(projectName);
        await createFiles(projectName);
        await setupScripts(projectName);
        console.log(chalk.green('Project generated successfully!'));
        process.exit(0);
    } catch (error) {
        console.error(`Error generating project: ${error}`);
        process.exit(1);
    }
});