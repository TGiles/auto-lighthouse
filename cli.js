#!/usr/bin/env node
const commander = require('commander');
const lighthouseRunner = require('./lighthouse_runner');
const package = require('./package.json');

const program = new commander.Command();
program.version(package.version);
program
    .option('-u, --url <urls...>', 'starting valid url(s) for auto-lighthouse')
    .option('-d, --device <device>', 'Used if only desktop or only mobile reports are needed. Allow values: mobile, desktop')
    .option('--format <mode>', 'output format of Lighthouse reports. Allowed values: html, json, csv.', 'html')
    .option('-e, --express <open>', 'flag for auto opening reports in local express server. Allowed values: true, false.')
    .option('-t, --threads <threads>', 'Number of threads used. Defaults to all threads.')
    .option('-p, --port <port>', 'port for local express server', 9000)
    .option('-v, --verbose', 'prints out verbose logs')
    .option('--respectRobots <respect>', 'flag for respecting all robots.txt rules', true);

program.parse(process.argv);
if (program.rawArgs.length === 2) {
  program.help();
}
else {
  lighthouseRunner.main(program);
}

module.exports = {
    program
};
