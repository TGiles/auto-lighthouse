#!/usr/bin/env node
const commander = require('commander');
const lighthouseRunner = require('./lighthouse_runner');
const package = require('./package.json');

const program = new commander.Command();
program.version(package.version);
program
    .option('-u, --url <urls>', 'starting valid url(s) for auto-lighthouse',
        [
            'https://tgiles.github.io'
        ])
    .option('--format <mode>', 'output format of Lighthouse reports. Allowed values: html, json, csv.', 'html')
    .option('-e, --express <open>', 'flag for auto opening reports in local express server. Allowed values: true, false.')
    .option('-p, --port <port>', 'port for local express server', 9000);

program.parse(process.argv);
lighthouseRunner.main(program);

module.exports = {
    program
};