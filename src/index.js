#!/usr/bin/env node

import { createDirectories } from "./bin/createDirectories.js";
import { createFiles } from "./bin/createFiles.js";
import { initializeProject, installDependencies } from "./bin/initializer.js";
import { setupScripts } from "./bin/setupScripts.js";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.stdin.setEncoding("utf8");

const args = process.argv.slice(2);
const scriptName = process.argv[1].split(path.sep).pop();

if (args.includes("--help")) {
  console.log("Express Project Generator");
  console.log("GitHub: https://github.com/developer-diganta/express-project-generator");
  console.log("");
  console.log(`Usage: node ${scriptName} [options]`);
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

let projectName = "my-app";

console.log(chalk.blue("Enter Project Name: "));
process.stdin.on("data", async function (data) {
  projectName = data.trim();
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
  } catch (error) {
    console.error(`Error generating project: ${error}`);
    process.exit(1);
  }
});
