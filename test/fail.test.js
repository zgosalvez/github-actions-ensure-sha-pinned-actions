const process = require('process');
const cp = require('child_process');
const jest = require('@jest/globals');
const path = require('path');

const ip = path.join(__dirname, '../src/index.js');
const workflowsPath = 'ZG_WORKFLOWS_PATH';
const actionsPath = 'ZG_ACTIONS_PATH';

jest.beforeEach(() => {
    process.env[workflowsPath] = 'foo';
    process.env[actionsPath] = 'foo';
});

jest.afterEach(() => {
    delete process.env[workflowsPath];
    delete process.env[actionsPath];
});

jest.test('workflow has empty error', () => {
    process.env[workflowsPath] = 'test/stub/empty/workflows';
    let result;

    try {
        throw cp.execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).toContain('Cannot read properties of null (reading \'jobs\')');
    jest.expect(result).not.toContain('No issues were found.');
});

jest.test('workflow has unpinned error', () => {
    process.env[workflowsPath] = 'test/stub/unpinned/workflows';
    let result;

    try {
        throw cp.execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).toContain('actions/checkout@v1 is not pinned to a full length commit SHA.');
    jest.expect(result).not.toContain('No issues were found.');
});

jest.test('action has empty error', () => {
    process.env[actionsPath] = 'test/stub/empty/actions';
    let result;

    try {
        throw cp.execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).toContain('Cannot read properties of null (reading \'runs\')');
    jest.expect(result).not.toContain('No issues were found.');
});

jest.test('action has unpinned error', () => {
    process.env[actionsPath] = 'test/stub/unpinned/actions';
    let result;

    try {
        throw cp.execSync(`node ${ip}`, { env: process.env }).toString();
    } catch (error) {
        result = (error.stdout || error).toString();
    }

    jest.expect(result).toContain('actions/checkout@v3 is not pinned to a full length commit SHA.');
    jest.expect(result).not.toContain('No issues were found.');
});
