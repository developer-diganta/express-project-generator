const createFile = require("../utils/createFile");
const chalk = require("chalk");

/*
 * Boilerplate code for the main server file 'server.js'.
*/
const boilerplateServerCode = (installJsonwebtoken) =>  `
const express = require('express');
const cors = require('cors');
${installJsonwebtoken === 'JWT' ? "const jwt = require('jsonwebtoken');" : ''}

require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Create an Express.js app
const PORT = process.env.PORT || 3000; // Set the port for the server

// Middlewares
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static('static')); // Serve static files from 'static' folder

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this new Express.js Project' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}/\`);
});

module.exports = app;`

/**
 * Creates necessary files for the specified project.
 * This function creates essential files within the project directory,
 * such as 'server.js' for the main server file and 'readme.md' for
 * project documentation. It also logs the creation of each file and
 * success message upon completion.
 * 
 * @param {string} projectName - The name of the project to create files for.
 */

const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`;
  
const tsBoilerplate = (installJsonwebtoken) =>`import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
${installJsonwebtoken === 'JWT' ?  "import jwt from 'jsonwebtoken';":""} 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this new Express.js Project' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}/\`);
});

export default app;`;

async function createFiles(projectName, progressCallback, language, modules = [], installJsonwebtoken) {
    try {
        const ext = language === 'TypeScript' ? 'ts' : 'js';
        const boilerplate = language === 'TypeScript' ? tsBoilerplate(installJsonwebtoken) : boilerplateServerCode(installJsonwebtoken);
        // Create module route files
        for (const module of modules) {
          const moduleRoutePath = `${projectName}/${module}/src/routes/${module}Routes.${ext}`;
          const moduleBoilerplate = language === 'TypeScript' ?
              `import express from 'express';\nconst router = express.Router();\n\nexport default router;` :
              `const express = require('express');\nconst router = express.Router();\n\nmodule.exports = router;`;
          
          await createFile(moduleRoutePath, moduleBoilerplate);
          console.log(chalk.green(`Created ${module} routes`));
          progressCallback();
        }
  
        if (modules.length === 0) {
          // For monolithic projects, create a single server file in the parent src folder
          await createFile(`${projectName}/src/server.${ext}`, boilerplate);
          console.log(chalk.green("Created server.js"));
          progressCallback();
        } else {
          // For microservices, create a server file for each module inside its own src folder
          for (const module of modules) {
            await createFile(`${projectName}/${module}/src/server.${ext}`, boilerplate);
            console.log(chalk.green(`Created server.js for module ${module}`));
            progressCallback();
          }
        }
        if (language === 'TypeScript') {
            await createFile(`${projectName}/tsconfig.json`, tsConfig);
            console.log(chalk.green("Created tsconfig.json"));
            progressCallback();
        }
        await createFile(`${projectName}/readme.md`, '# Project created using express-app-generator');
        console.log(chalk.green("Created readme.md"));
        progressCallback();
        console.log(chalk.green('Project generated successfully!'));
    } catch (error) {
        console.error(chalk.red(`Error creating files: ${error}`));
        throw error;
    }
}

function generateServerCode(language, modules) {
  const routeImports = modules.map(module => 
      language === 'TypeScript' ?
      `import ${module}Routes from '../${module}/src/routes/${module}Routes';` :
      `const ${module}Routes = require('../${module}/src/routes/${module}Routes');`
  ).join('\n');

  const routeMounts = modules.map(module => 
        `app.use('/${module}', ${module}Routes);`
    ).join('\n');
  
  const baseCode = language === 'TypeScript' ? tsBoilerplate : boilerplateServerCode;
  
  return baseCode.replace(
      '// Routes',
      `// Routes\n${routeImports}\n${routeMounts}`
  ).replace(
      'app.get(\'/\', (req, res) => {',
      modules.length > 0 ?
          `// Module routes\n${routeMounts}\n\napp.get('/', (req, res) => {` :
          'app.get(\'/\', (req, res) => {'
  );
}

module.exports = createFiles;

// Note: The tsBoilerplate and boilerplateServerCode variables need to be modified to include placeholder comments for where to inject the dynamic routes