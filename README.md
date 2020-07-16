# auto-lighthouse
[![License](https://badgen.net/github/license/TGiles/auto-lighthouse)](https://github.com/TGiles/auto-lighthouse/LICENSE)
[![npm version](https://badgen.net/npm/v/auto-lighthouse)](https://www.npmjs.com/package/auto-lighthouse)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=TGiles/auto-lighthouse)](https://dependabot.com)
[![Master build status](https://badgen.net/github/status/TGiles/auto-lighthouse)](https://github.com/TGiles/auto-lighthouse/actions)
[![Latest master commit](https://badgen.net/github/last-commit/TGiles/auto-lighthouse/master)](https://github.com/TGiles/auto-lighthouse/commits/master)

[![Open issues](https://badgen.net/github/open-issues/TGiles/auto-lighthouse)](https://github.com/TGiles/auto-lighthouse/issues)
[![Closed issues](https://badgen.net/github/closed-issues/TGiles/auto-lighthouse)](https://github.com/TGiles/auto-lighthouse/issues?q=is%3Aissue+is%3Aclosed)



A CLI for crawling one or more domains and generating both mobile and desktop reports for each page.

## How to use consume via NPM
* `npx auto-lighthouse`
    * This command should print the help output

* `npm install auto-lighthouse` or `npm install -g auto-lighthouse`
 * `auto-lighthouse`
    * Verify that you recieve the help output
* `auto-lighthouse -u some_url -e true`

## How to use when contributing back to repository
* Fork the repository
* Navigate to the project root
* `npm install`
* `npm link`
* `auto-lighthouse`
    * Verify help output
* Make some changes
* Make a pull request
* `npm unlink auto-lighthouse`

<!-- ## Configuration reference
 `runnerConfiguration.json` is the configuration file we use to control some of the internals of this package.
 * `autoOpenReports`: Determines whether this package should automatically open generated reports. Default: `false`. Can be set through the config or the CLI.
 * `port`: The local express server uses this number. Default: 9000. Can be set through the config or CLI. -->
