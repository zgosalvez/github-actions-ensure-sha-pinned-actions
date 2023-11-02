const process = require('process');
const {execSync} = require('child_process');
const jest = require('@jest/globals');
const path = require('path');

const ip = path.join(__dirname, '../src/index.js');
const workflowsPath = 'ZG_WORKFLOWS_PATH';
const allowlist = 'INPUT_ALLOWLIST';

jest.beforeEach(() => {
    process.env[workflowsPath] = 'test/stub/pass';
    process.env[allowlist] = "aws-actions/\ndocker/login-action";
});

jest.afterEach(() => {
    delete process.env[workflowsPath];
    delete process.env[allowlist];
});

jest.test('actions pass', () => {
    let result;

    try {
        result = execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        throw Error(error.stdout.toString());
    }

    jest.expect(result).not.toContain('::warning::');
    jest.expect(result).not.toContain('::error::');
    jest.expect(result).toContain('No issues were found.');
});
