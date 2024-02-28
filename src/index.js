#!/usr/bin/env node

const createDirectories = require("./bin/createDirectories");
const createFiles = require("./bin/createFiles");
const initializeProject = require("./bin/initializer");
const chalk = require("chalk")
process.stdin.setEncoding('utf8');
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