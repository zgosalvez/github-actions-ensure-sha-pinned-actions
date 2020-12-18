# GitHub Action — Ensure SHA Pinned Actions

This GitHub Action (written in JavaScript) allows you to leverage GitHub Actions to ensure that GitHub Actions are pinned to full length commit SHAs. For more information, see "[using third-party actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/security-hardening-for-github-actions#using-third-party-actions)."

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#common-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
None. This action will automatically scan for workflows in the `.github/wokrflows` directory.

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
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)