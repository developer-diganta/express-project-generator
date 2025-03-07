#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const createFiles = require("./bin/createFiles");
const { initializeProject, installDependencies } = require("./bin/initializer");
const setupScripts = require("./bin/setupScripts");
const chalk = require("chalk")
process.stdin.setEncoding('utf8');
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