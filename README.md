# GitHub Action — Ensure SHA Pinned Actions

This GitHub Action (written in JavaScript) allows you to leverage GitHub Actions to ensure that GitHub Actions are pinned to full length commit SHAs. This does not fail for referenced actions in the same repository when using the [`./path/to/dir` syntax](https://docs.github.com/actions/learn-github-actions/finding-and-customizing-actions#referencing-an-action-in-the-same-repository-where-a-workflow-file-uses-the-action). For more information, see "[using third-party actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/security-hardening-for-github-actions#using-third-party-actions)."

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#common-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
#### Optional
* `white-listed-actions` List of repos and actions that WILL NOT trigger a commit SHA pin failure. Each entry must be on a newline.
```yaml
  white-listed-actions: |
    aws-actions/          # Trust all actions published by aws-actions
    docker/login-action   # Trust docker's login-action only
```

### Outputs
None. This action will throw an error if it finds GitHub Actions that are not pinned to full length commit SHAs.

### Common workflow

Ideally, set this up as an initial job for your workflows. For example:
```yaml
on: push

name: Continuous Integration

jobs:
  harden_security:
    name: Harden Security
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@5a4ac9002d0be2fb38bd78e4b4dbde5606d7042f # v2.3.4
      - name: Ensure SHA pinned actions
        uses: zgosalvez/github-actions-ensure-sha-pinned-actions@v1.0.1 # Replace this
        with:
          white-listed-actions: |
            aws-actions/
            docker/login-action
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)