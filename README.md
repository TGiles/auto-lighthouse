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
* Make some changes and pull request
* `npm unlink auto-lighthouse`

## Alternate way to use via cloning the repository
* Please modify the `host` field in `config/simpleCrawler.json` with your chosen domain to perform audits on that domain.
* `npm install`
* `npm run start`
* Navigate to the `lighthouse` folder
* Open the appropriate timestamped directory
* View lighthouse reports for mobile and desktop agents in your browser of choice

## Configuration reference
### `simpleCrawler.json`
 `simpleCrawler.json` is the configuration file for the crawler we use.
 The complete documentation for this can be seen in the [simpleCrawler repository.](https://github.com/simplecrawler/simplecrawler#configuration)

 * `maxDepth`: Controls the max depth of resources that the crawler fetches. 0 means that the crawler won't restrict requests based on depth. The initial resource, as well as manually queued resources, are at depth 1. From there, every discovered resource adds 1 to its referrer's depth
 * `filterByDomain`: Controls whether the crawler fetches only URL's where the hostname matches host. Unless you want to be crawling the entire internet, I would recommend leaving this on!
 * `stripQuerystring`: Controls whether to strip query string parameters from URL's at queue item construction time.
 * `downloadUnsupported`: Controls whether to download resources with unsupported mimetypes (as specified by supportedMimeTypes)
 * `maxConcurrency`: Maximum request concurrency. If necessary, simplecrawler will increase node's http agent maxSockets value to match this setting
 * `allowInitialDomainChange`: Controls whether the crawler is allowed to change the host setting if the first response is a redirect to another domain.
 * `respectRobotsTxt`: Controls whether the crawler respects the robots.txt rules of any domain. This is done both with regards to the robots.txt file, and `<meta>` tags that specify a nofollow value for robots. The latter only applies if the default discoverResources method is used, though.
 * `parseHTMLComments`: Controls whether the default discoverResources should scan for new resources inside of HTML comments.
 * `parseScriptTags`: Controls whether the default discoverResources should scan for new resources inside of `<script>` tags.
 * `host`: Determines what hostname the crawler should limit requests to (so long as filterByDomain is true)

 ### `runnerConfiguration.json`
 `runnerConfiguration.json` is the configuration file we use to control some of the internals of this package.
 * `autoOpenReports`: Determines whether this package should automatically open generated reports. Default: `false`. Can be set through the config or the CLI.
 * `port`: The local express server uses this number. Default: 9000. Can be set through the config or CLI.