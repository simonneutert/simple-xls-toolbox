# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Use the following headers for organizing changes:

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for once-stable features removed in upcoming releases.
- **Removed** for deprecated features removed in this release.
- **Fixed** for any bug fixes.
- **Security** to invite attention to security-related changes.

Please use the following format for each entry:

- [Type]: [#IssueNumber](link to issue or pull request) Short description of the
  change. [@username](link to GitHub profile)

## [Unreleased]

## [v0.0.8] - 2026-02-02

- Security: [#12](https://github.com/simonneutert/simple-xls-toolbox/pull/11)
  Updates dependencies. [@simonneutert](https://github.com/simonneutert)

## [v0.0.7] - 2026-01-23

- Changed: [#11](https://github.com/simonneutert/simple-xls-toolbox/pull/11)
  Update https://jsr.io/@simonneutert/string-combinations-generator with
  breaking change: separator is now ";" by default. Updated README.md to include
  information about the built-in helper for generating string combinations.
  [@simonneutert](https://github.com/simonneutert)

## [v0.0.6] - 2026-01-22

- Fixed: [#9](https://github.com/simonneutert/simple-xls-toolbox/pull/9) The
  selection of the sheetName/sheet in multi-sheet Excel is now properly working
  when using the command `validate-excel` command.
  [@simonneutert](https://github.com/simonneutert)

## [v0.0.5] - 2026-01-22

- Fixed: [#8](https://github.com/simonneutert/simple-xls-toolbox/pull/8) Remove
  debug log for workbook in validateExcelData function.
  [@simonneutert](https://github.com/simonneutert)

## [v0.0.4] - 2026-01-22

- Fixed: [#6](https://github.com/simonneutert/simple-xls-toolbox/pull/6) deno
  outdated --update to update packages.
  [@simonneutert](https://github.com/simonneutert)
- Fixed: [#7](https://github.com/simonneutert/simple-xls-toolbox/pull/7)
  Refactor error messages in validation and header comparison outputs for
  clarity. [@simonneutert](https://github.com/simonneutert)

## [v0.0.3] - 2026-01-16

- Added: [#4](https://github.com/simonneutert/simple-xls-toolbox/pull/4): Add
  Containerfile for building and testing in containerized environments.
  [@simonneutert](https://github.com/simonneutert)

- Changed: [#3](https://github.com/simonneutert/simple-xls-toolbox/pull/3):
  Cleaner implementation of "compare-headers" command. Now outputs a message
  indicating no differences when headers match.
  [@simonneutert](https://github.com/simonneutert)

## [v0.0.2] - 2026-01-15

- Fixed: [#2](https://github.com/simonneutert/simple-xls-toolbox/pull/2):
  Refactor schema validation and remove string-combinations helper. Simplifies
  usage of an elementary function in schema files.
  [@simonneutert](https://github.com/simonneutert)

- Added:
  [#1](https://github.com/simonneutert/simple-xls-toolbox/pull/1/changes):
  Provide a fix to use imports in schema files when compiled with
  `deno compile`. [@simonneutert](https://github.com/simonneutert)

## [v0.0.1] - 2026-01-15

- Initial release 🎉
