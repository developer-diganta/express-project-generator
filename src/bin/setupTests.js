const createDirectory = require("../utils/createDirectory");
const createFile = require("../utils/createFile");
const chalk = require("chalk");

async function setupTests(projectName, testLibraries) {
    try {
        if (testLibraries.jest) {
            await createDirectory(`${projectName}/src/__tests__`);
            const jestTestCode = `const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
    it('responds with json', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Welcome to this new Express.js Project');
    });
});`;
            await createFile(`${projectName}/src/__tests__/server.test.js`, jestTestCode);
            console.log(chalk.green('Created Jest test files'));
        }
        if (testLibraries.mocha) {
            await createDirectory(`${projectName}/test`);
            const mochaTestCode = `const chai = require('chai');
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
            await createFile(`${projectName}/test/server.test.js`, mochaTestCode);
            console.log(chalk.green('Created Mocha test files'));
        }
    } catch (error) {
        console.error(chalk.red(`Test setup error: ${error}`));
        throw error;
    }
}

module.exports = setupTests;