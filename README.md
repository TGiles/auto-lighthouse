# auto-lighthouse

A utility package to allow automated Lighthouse auditing on a domain.

## How to use consume via NPM
* `npm install auto-lighthouse` or `npm install -g auto-lighthouse`

 * `auto-lighthouse -h`
    * Verify that you recieve the help output
* `auto-lighthouse -u some_url -o true`

## How to use when contributing back to repository
* Clone the repository
* Navigate to the project root
* `npm install`
* `npm link`
* `auto-lighthouse -h`
    * Verify help output
* Make some changes
* Make a pull request
* `npm unlink auto-lighthouse`

## Alternate way to use via cloning the repository
* Please modify the `host` field in `config/simpleCrawler.json` with your chosen domain to perform audits on that domain.
* `npm install`
* `npm run start`
* Navigate to the `lighthouse` folder
* Open the appropriate timestamped directory
* View lighthouse reports for mobile and desktop agents in your browser

## Configuration reference
 `simpleCrawler.json` is the configuration file for the crawler we use.
 The complete documentation for this can be seen in the [simpleCrawler repository.](https://github.com/simplecrawler/simplecrawler#configuration)

 `runnerConfiguration.json` is the configuration file we use to control some of the internals of this package.
 * `autoOpenReports`: Determines whether this package should automatically open generated reports. Default: `false`. Can be set through the config or the CLI.
 * `port`: The local express server uses this number. Default: 9000. Can be set through the config or CLI.
