import test from 'ava';
import * as runner from './lighthouse_runner';
import program from './cli';


test('default run', t => {
    // t.notThrows(runner.main(program), 'message');
    t.notThrows(() => {
        runner.main(program);
    }, 'default should not throw error');
});

test('custom url set by CLI', t => {
    program.program.url = 'https://tgiles.github.io';
    let crawler = runner.main(program.program);
    t.is(crawler.host, 'tgiles.github.io', 'Host should be the command line argument, not default');
});

test('setting auto-open configuration', t => {
    program.program.express = true;
    let crawler = runner.main(program.program);
});

