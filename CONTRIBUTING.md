# Contributing to Simple XLS Toolbox

The following bullets outline the guidelines for contributing to the Simple XLS
Toolbox project:

- **Issue Reporting**: If you encounter bugs or have feature requests, please
  open an issue on the project's GitHub repository. Provide as much detail as
  possible, including steps to reproduce the issue, expected behavior, and
  actual behavior.

- **Pull Requests**: Contributions are welcome! If you would like to contribute
  code, please fork the repository and create a new branch for your changes.
  Submit a pull request with a clear description of the changes you have made.

## Review Process

- **Code Reviews**: All pull requests will be reviewed by the project
  maintainers. Please be patient while waiting for feedback. You may be asked to
  make changes before your pull request is merged. (Or you allow changes made by
  maintainers directly to your branch.)

- **Communication**: Be respectful and constructive in your communication.
  Remember that open source projects thrive on collaboration and mutual respect.

## Pull Request Guidelines

When submitting a pull request, please ensure that:

- Your code follows the existing coding style and conventions.
- [ ] `deno check` should pass without errors.
- [ ] `deno fmt` has been run to format your code.
- [ ] You followed the configuration in
      [.editorconfig](https://editorconfig.org/).
- [ ] You have added tests for any new functionality or bug fixes.
- [ ] You have updated documentation as necessary to reflect your changes.

Mandatory for you to check, too:

- [ ] [README.md](README.md) - Update usage instructions and examples.
- [ ] [CHANGELOG.md](CHANGELOG.md) - Document changes made in each version,
      follow the previously added entries (Link to PR, short description, link
      to your GitHub profile).

And here are some hints on files, I had touched multiple times, when applying
changes in the past:

- [ ] [main.ts](main.ts) - Core functionality and command-line interface.
- [ ] [test/resources/*.xlsx](test/resources/) - Sample Excel files for testing,
      please always comment on what your changes intended.
- [ ] [test/resources/sample_schema.js](test/resources/sample_schema.js) -
      Example schema for validating Excel data - this is used in all tests.

## New Version Releases

Will trigger a building and publishing executable artifacts for all supported
platforms.\
The release on GitHub will be automatically enriched with the binary assets.

Releases are to be documented in the `CHANGELOG.md` file.\
The naming of the release versions should follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Technical Details

- The project uses Deno (v2.6+) as the runtime environment.
- Testing is done using Deno's built-in testing framework.
