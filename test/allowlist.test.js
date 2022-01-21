const process = require('process');
const cp = require('child_process');
const jest = require('@jest/globals');
const path = require('path');

const ip = path.join(__dirname, '../src/index.js');
const workflowsPath = 'ZG_WORKFLOWS_PATH';

jest.beforeEach(() => {
    process.env[workflowsPath] = 'test/stub/allowlist';
});

jest.afterEach(() => {
    delete process.env[workflowsPath];
    delete process.env['INPUT_ALLOWLIST'];
});

jest.test('actions pass', () => {
    process.env['INPUT_ALLOWLIST'] = `example
    foo/bar`;
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();

    jest.expect(result).toContain('No issues were found.');
});
