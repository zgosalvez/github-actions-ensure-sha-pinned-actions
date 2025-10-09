const process = require('process');
const {execSync} = require('child_process');
const jest = require('@jest/globals');
const path = require('path');

const ip = path.join(__dirname, '../src/index.js');
const workflowsPath = 'ZG_WORKFLOWS_PATH';
const actionsPath = 'ZG_ACTIONS_PATH';
const allowlist = 'INPUT_ALLOWLIST';
const workflowNameInput = 'INPUT_WORKFLOW_NAME';

jest.beforeEach(() => {
    process.env[workflowsPath] = 'test/stub/pass/workflows';
    process.env[actionsPath] = 'test/stub/pass/actions';
    process.env[allowlist] = "aws-actions/\ndocker/login-action";
    delete process.env[workflowNameInput];
});

jest.afterEach(() => {
    delete process.env[workflowsPath];
    delete process.env[actionsPath];
    delete process.env[allowlist];
    delete process.env[workflowNameInput];
});

jest.test('actions pass', () => {
    let result;

    try {
        throw execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).not.toContain('::warning::');
    jest.expect(result).not.toContain('::error::');
    jest.expect(result).toContain('No issues were found.');
});

jest.test('actions pass when restricting to a single workflow file', () => {
    process.env[workflowNameInput] = 'valid';
    let result;

    try {
        throw execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).not.toContain('::warning::');
    jest.expect(result).not.toContain('::error::');
    jest.expect(result).toContain('No issues were found.');
});
