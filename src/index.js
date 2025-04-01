#!/usr/bin/env node

import { createDirectories } from "./bin/createDirectories.js";
import { createFiles } from "./bin/createFiles.js";
import { initializeProject, installDependencies } from "./bin/initializer.js";
import { setupScripts } from "./bin/setupScripts.js";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import fs from "fs/promises";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  fs.readFile(packageJsonPath, "utf-8")
    .then((data) => {
      const packageJson = JSON.parse(data);
      console.log("Express Project Generator: v" + packageJson.version);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error reading package.json:", error);
      process.exit(1);
    });
}

async function main() {
  const responses = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter Project Name:",
      default: "my-app"
    },
    {
      type: "input",
      name: "authorName",
      message: "Enter Author Name:",
      default: "Anonymous"
    },
    {
      type: "input",
      name: "version",
      message: "Enter Version:",
      default: "1.0.0"
    },
    {
      type: "input",
      name: "description",
      message: "Enter Description:",
      default: ""
    },
    {
      type: "input",
      name: "license",
      message: "Enter License:",
      default: "ISC"
    },
    {
      type: "string",
      name: "start",
      message: "Enter Start Command:",
      default: "node src/server.js"
    },
    {
      type: "confirm",
      name: "addTests",
      message: "Would you like to add test scripts?",
      default: false
    },
    {
      type: "list",
      name: "testFramework",
      message: "Which test framework would you like to use?",
      choices: ["Jest", "Mocha"],
      when: (answers) => answers.addTests
    }
  ]);

  const { projectName, authorName, version, description, license, start, addTests, testFramework } = responses;

  const testLibraries = {
    jest: testFramework === "Jest",
    mocha: testFramework === "Mocha"
  };

  // Calculate total steps based on test selection
  const TEST_STEPS = addTests ? 2 : 0;
  const TOTAL_STEPS = 12 + TEST_STEPS;

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
    await installDependencies(projectName, updateProgress);
    await createDirectories(projectName, updateProgress);
    await createFiles(projectName, updateProgress);
    await setupScripts(projectName, updateProgress);

    if (addTests) {
      const { setupTests } = await import("./bin/setupTests.js");
      await setupTests(projectName, testLibraries);
    }

    console.log(chalk.blue(`\n[100%] `) + chalk.green.bold("Project setup completed!"));
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
