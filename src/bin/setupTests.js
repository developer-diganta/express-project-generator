const createDirectory = require("../utils/createDirectory");
const createFile = require("../utils/createFile");
const chalk = require("chalk");

async function setupTests(projectName, testLibraries, updateProgress, language, modules = []) {
    try {
        if (testLibraries.jest) {
            const testExt = language === 'TypeScript' ? 'ts' : 'js';
            const jestConfig = language === 'TypeScript' ? `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.${testExt}']
};` : 'module.exports = { testEnvironment: \'node\' };';
            const jestTestCode = language === 'TypeScript' ? 
                `import request from 'supertest';
import app from '../server';

describe('GET /', () => {
it('responds with json', async () => {
const res = await request(app).get('/');
expect(res.statusCode).toBe(200);
expect(res.body.message).toBe('Welcome to this new Express.js Project');
});
});` 
    : `const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
it('responds with json', async () => {
const res = await request(app).get('/');
expect(res.statusCode).toBe(200);
expect(res.body.message).toBe('Welcome to this new Express.js Project');
});
});`;
            if (modules.length > 0) {
              // Create module directories
              for (const module of modules) {
                  const modulePath = `${projectName}/${module}/src`;
                  await createFile(`${modulePath}/jest.config.js`, jestConfig);
                  await createDirectory(`${modulePath}/__tests__`);
                  await createFile(`${modulePath}/__tests__/server.test.${testExt}`, jestTestCode);
                  updateProgress();
                  console.log(chalk.green('Created Jest test files'));
              }
            } else {
              await createFile(`${projectName}/jest.config.js`, jestConfig);
              await createDirectory(`${projectName}/src/__tests__`);
              await createFile(`${projectName}/src/__tests__/server.test.${testExt}`, jestTestCode);
              updateProgress();
              console.log(chalk.green('Created Jest test files')); 
            }
        }

        if (testLibraries.mocha) {
            const testExt = language === 'TypeScript' ? 'ts' : 'js';
            const mochaTestCode = language === 'TypeScript' ? 
                `import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import app from '../src/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /', () => {
  it('returns welcome message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome to this new Express.js Project');
        done();
      });
  });
});`
                : `const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /', () => {
  it('returns welcome message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome to this new Express.js Project');
        done();
      });
  });
});`;
          if (modules.length > 0) {
            // Create module directories
            for (const module of modules) {
                const modulePath = `${projectName}/${module}/src`;
                await createDirectory(`${modulePath}/__tests__`);
                await createFile(`${modulePath}/__tests__/server.test.${testExt}`, mochaTestCode);
                updateProgress();
                console.log(chalk.green('Created Mocha test files'));
            }
          } else {
            await createDirectory(`${projectName}/src/__tests__`);
            await createFile(`${projectName}/src/__tests__/server.test.${testExt}`, mochaTestCode);
            updateProgress();
            console.log(chalk.green('Created Mocha test files')); 
          }
        }
    } catch (error) {
        console.error(chalk.red(`Test setup error: ${error}`));
        throw error;
    }
}

module.exports = setupTests;