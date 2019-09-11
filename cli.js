#!/usr/bin/env node
const commander = require('commander');
const lighthouseRunner = require('./lighthouse_runner');
const package = require('./package.json');

const program = new commander.Command();
program.version(package.version);
program
    .option('-u, --url <url>', 'starting valid url for auto-lighthouse', 'https://blank.org')
    .option('-e, --express <open>', 'flag for auto opening reports in local express server')
    .option('-p, --port <port>', 'port for local express server', 9000);

program.parse(process.argv);
lighthouseRunner.main(program);

module.exports = {
    program
};