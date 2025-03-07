#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const createFiles = require("./bin/createFiles");
const initializeProject = require("./bin/initializer");
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
    process.exit(0);
}

let projectName = "my-app";

console.log(chalk.blue("Enter Project Name: "));
process.stdin.on('data', async function (data) {
    projectName = data.trim();
    try {
        await initializeProject(projectName);
        await createDirectories(projectName);
        await createFiles(projectName);
    } catch (error) {
        console.error(`Error generating project: ${error}`);
        process.exit(1);
    }
});