const process = require('process');
const cp = require('child_process');
const jest = require('@jest/globals');
const path = require('path');

const ip = path.join(__dirname, '../src/index.js');
const workflowsPath = 'ZG_WORKFLOWS_PATH';

jest.afterEach(() => {
    delete process.env[workflowsPath];
});

jest.test('action has empty error', () => {
    process.env[workflowsPath] = 'test/stub/empty';

    try {
        cp.execSync(`node ${ip}`, { env: process.env }).toString();

        jest.expect(true).toBe(false);
    } catch (error) {
        const result = error.stdout.toString();

        jest.expect(result).toContain('Cannot read property \'jobs\' of null');
        jest.expect(result).not.toContain('No issues were found.');
    }
});

jest.test('action has unpinned error', () => {
    process.env[workflowsPath] = 'test/stub/unpinned';

    try {
        cp.execSync(`node ${ip}`, { env: process.env }).toString();

        jest.expect(true).toBe(false);
    } catch (error) {
        const result = error.stdout.toString();

        jest.expect(result).toContain('actions/checkout@v1 is not pinned to a full length commit SHA.');
        jest.expect(result).not.toContain('No issues were found.');
    }
});
