const core = require('@actions/core');
const fs = require('fs');
const glob = require('@actions/glob');
const path = require('path');
const sha1 = require('sha1-regex');
const yaml = require('yaml');

function assertUsesSHA(uses) {
  return typeof uses === 'string' &&
    uses.includes('@') &&
    sha1.test(uses.substr(uses.indexOf('@') + 1))
}

async function run() {
  try {
    const workflowsPath = '.github/workflows';
    const globber = await glob.create([workflowsPath + '/*.yaml', workflowsPath + '/*.yml'].join('\n'));
    let actionHasError = false;

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

        if (uses !== undefined) {
          if (!assertUsesSHA(uses)) {
            actionHasError = true;
            fileHasError = true;

            core.error(`${uses} is not pinned to a full length commit SHA.`);
          }
        } else if (steps !== undefined) {
          for (const step of steps) {
            const uses = step['uses'];
              if (!assertUsesSHA(uses)) {
                actionHasError = true;
                fileHasError = true;

                core.error(`${uses} is not pinned to a full length commit SHA.`);
              }
            }
        } else {
          core.warning(`The "${job}" job of the "${basename}" workflow does not contain steps or uses.`);
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
