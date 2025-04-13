const createFile = require("../utils/createFile");
const chalk = require("chalk");

/*
 * Boilerplate code for the main server file 'server.js'.
*/
const boilerplateServerCode = (installJsonwebtoken ,addDatabase) =>  `
const express = require('express');
const cors = require('cors');
${installJsonwebtoken === 'JWT' ? "const jwt = require('jsonwebtoken');" : ''}
${addDatabase === 'MongoDB' ? "const mongoose = require('mongoose');" : ''}

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
  
const tsBoilerplate = (installJsonwebtoken,addDatabase) =>`import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
${installJsonwebtoken === 'JWT' ?  "import jwt from 'jsonwebtoken';":""} 
${addDatabase === 'MongoDB' ? "import mongoose from 'mongoose';" : ''}

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

const dbConfig = (language) => `
${language === 'TypeScript'  ? "import mongoose from 'mongoose'" : "const  mongoose = require('mongoose');"}
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
`;

const userModel = (language) => `
${language === 'TypeScript'  ? "import mongoose from 'mongoose'" : "const  mongoose = require('mongoose');"}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
`;

const controller = (language) => `
${language === 'TypeScript'  ? "import User from '../model/userModel';" : "const User = require('../model/userModel');"}
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });
  res.status(201).json(newUser);
};
`

const route = (language) => `
${language === 'TypeScript'  ? "import express from 'express';" : "const express = require('express');"}
${language === 'TypeScript'  ? "import { getUsers, createUser } from '../controller/userController';" : "const { getUsers, createUser } = require('../controller/userController');"}
const router = express.Router();
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
`

const auth =  `
const authMiddleware = (req, res, next) => {
  // Placeholder for authentication logic
  console.log("Auth middleware hit");
  next();
};

module.exports = authMiddleware;
`
const errorMiddleware = `
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = errorHandler;
`
const services = (language) => `
${language === 'TypeScript'  ? "import User, { IUser } from '../model/userModel';" : "const User = require('../model/userModel');"}
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const createUserService = async (name, email, password) => {
  const user = await User.create({ name, email, password });
  return user;
};

module.exports = {
  getAllUsers,
  createUserService,
};
`


async function createFiles(projectName, progressCallback,language ,modules = [],installJsonwebtoken , addDatabase) {
    try {
        const ext = language === 'TypeScript' ? 'ts' : 'js';
        const boilerplate = language === 'TypeScript' ? tsBoilerplate(installJsonwebtoken,addDatabase) : boilerplateServerCode(installJsonwebtoken ,addDatabase);
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
        await createFile(`${projectName}/src/server.${ext}`, boilerplate);
        console.log(chalk.green("Created server.js"));
        progressCallback();

        if (language === 'TypeScript') {
            await createFile(`${projectName}/tsconfig.json`, tsConfig);
            console.log(chalk.green("Created tsconfig.json"));
            progressCallback();
        }
        
        await createFile(`${projectName}/readme.md`, '# Project created using express-app-generator');
        console.log(chalk.green("Created readme.md"));
        progressCallback();

        await createFile(`${projectName}/src/configs/config.${ext}`,dbConfig(language))
        console.log(chalk.green(`Created config.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/models/userModel.${ext}`,userModel(language))
        console.log(chalk.green(`Created userModel.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/controllers/userController.${ext}`,controller(language))
        console.log(chalk.green(`Created userController.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/middlewares/authMiddleware.${ext}`,auth)
        console.log(chalk.green(`Created authMiddleware.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/middlewares/errorMiddleware.${ext}`,errorMiddleware)
        console.log(chalk.green(`Created errorMiddleware.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/routes/userRouter.${ext}`,route(language))
        console.log(chalk.green(`Created route.${ext}`));
        progressCallback();

        await createFile(`${projectName}/src/services/userServices.${ext}`,services(language))
        console.log(chalk.green(`Created userServices.${ext}`));
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