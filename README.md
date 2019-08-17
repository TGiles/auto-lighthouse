# lighthouse_auditor

A utility package to allow automated Lighthouse auditing on a domain.
This utility is config driven, please refer to `config/simpleCrawler.json` for configuration options.

## How to use

* Please modify the `host` field in `config/simpleCrawler.json` with your chosen domain to perform audits on that domain.
* `npm install`
* `npm run start`
* Navigate to the `lighthouse` folder
* Open the appropriate timestamped directory
* View lighthouse reports for mobile and desktop agents in your browser of choice
