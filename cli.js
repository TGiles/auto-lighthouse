#!/usr/bin/env node
const program = require('commander');
const main = require('./lighthouse_runner');
const package = require('./package.json');

program.version(package.version);
program
    .option('-u, --url <url>', 'starting valid url for auto-lighthouse', 'https://blank.org')
    .option('-e, --express <open>', 'flag for auto opening reports in local express server')
    .option('-p, --port <port>', 'port for local express server', 9000);

program.parse(process.argv);
main(program);

