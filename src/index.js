const core = require('@actions/core');
const fs = require('fs');
const glob = require('@actions/glob');
const path = require('path');
const sha1 = require('sha1-regex');
const yaml = require('yaml');

async function run() {
  try {
    const workflowsPath = process.env['ZG_WORKFLOWS_PATH'] || '.github/workflows';
    const globber = await glob.create([workflowsPath + '/*.yaml', workflowsPath + '/*.yml'].join('\n'));
    let actionHasError = false;
    const whiteListedActions = core.getInput('white-listed-actions');
    const whiteList = whiteListedActions.split(/\r?\n/);

    for await (const file of globber.globGenerator()) {
      const basename = path.basename(file);
      const fileContents = fs.readFileSync(file, 'utf8');
      const yamlContents = yaml.parse(fileContents);
      const jobs = yamlContents['jobs'];
      let fileHasError = false;

      if (jobs === undefined) {
        core.setFailed(`The "${basename}" workflow does not contain jobs.`);
      }

      core.startGroup(workflowsPath + '/' + basename);

      for (const job in jobs) {
        const uses = jobs[job]['uses'];
        const steps = jobs[job]['steps'];

        if (assertUsesVersion(uses)) {
          if (!assertUsesSHA(uses) && !isWhitelistedAction(uses, whiteListedActions, whiteList)) {
            actionHasError = true;
            fileHasError = true;

            core.error(`${uses} is not pinned to a full length commit SHA.`);
          }
        } else if (steps !== undefined) {
          for (const step of steps) {
            const uses = step['uses'];

            if (assertUsesVersion(uses) && !assertUsesSHA(uses) && !isWhitelistedAction(uses, whiteListedActions, whiteList)) {
              actionHasError = true;
              fileHasError = true;

              core.error(`${uses} is not pinned to a full length commit SHA.`);
            }
          }
        } else {
          core.warning(`The "${job}" job of the "${basename}" workflow does not contain uses or steps.`);
        }
      }

      if (!fileHasError) {
        core.info('No issues were found.')
      }

      core.endGroup();
    }

    if (actionHasError) {
      throw new Error('At least one workflow contains an unpinned GitHub Action version.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

function assertUsesVersion(uses) {
  return typeof uses === 'string' && uses.includes('@');
}

function assertUsesSHA(uses) {
  return sha1.test(uses.substr(uses.indexOf('@') + 1));
}

function isWhitelistedAction(uses, whiteListedActions, whiteList) {
  const atIndex = uses.indexOf('@');
  const repoAndAction = uses.substr(0, atIndex);
  const isWhitelistedRepoAndAction = whiteListedActions && whiteList.some((whiteListedItem) => repoAndAction.startsWith(whiteListedItem));

  if(isWhitelistedRepoAndAction) {
    core.info(`${repoAndAction} matched whitelist - ignoring unpinned action.`)
  }
  return isWhitelistedRepoAndAction;
}
