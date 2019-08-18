const Crawler = require('simplecrawler');
const lighthouse = require('lighthouse');
const generateReport = require('lighthouse/lighthouse-core/report/report-generator');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const open = require('open');
let autoOpen = false;
let port;

const simpleCrawlerConfig = require('./config/simpleCrawler');
const runnerConfig = require('./config/runnerConfiguration');

/**
 * Launches a headless instance of chrome and runs Lighthouse on that instance.
 *
 * @param {*} url A URL that the headless instance will navigate to
 * @param {*} opts Any options to pass into Chrome
 * @param {*} [config=null] Any special options passed to Lighthouse
 * @returns Lighthouse Result object (LHR)
 */
async function launchChromeAndRunLighthouseAsync(url, opts, config = null) {
    try {
        const chrome = await chromeLauncher.launch({
            chromeFlags: opts.chromeFlags
        });
        opts.port = chrome.port;
        const results = await lighthouse(url, opts, config);
        await chrome.kill();
        return results.lhr;

    } catch (e) {
        console.error(e);
    }
};

/**
 * Function to process the Lighthouse Result object(s)
 *
 * @param {[string]} urlList Lighthouse will run an audit for each URL in this list
 * @param {[{}]} opts Any options to pass into Chrome
 * @param {string} tempFilePath A path to store the resulting HTML files
 */
async function processReports(urlList, opts, tempFilePath) {
    try {
        for (i = 0; i < urlList.length; i++) {
            let currentUrl = urlList[i];
            await launchChromeAndRunLighthouseAsync(currentUrl, opts[0])
                .then(results => {
                    let processObj = {
                        "currentUrl": currentUrl,
                        "results": results,
                        "tempFilePath": tempFilePath,
                        "opts": opts[0]
                    };
                    processResults(processObj);
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                });
            await launchChromeAndRunLighthouseAsync(currentUrl, opts[1])
                .then(results => {
                    let processObj = {
                        "currentUrl": currentUrl,
                        "results": results,
                        "tempFilePath": tempFilePath,
                        "opts": opts[1]
                    };
                    processResults(processObj);
                })
                .catch(err => {
                    console.error(err);
                    throw err;
                });
        }
    } catch (e) {
        console.error(e);
    }
};

const processResults = (processObj) => {
    let currentUrl = processObj.currentUrl;
    let opts = processObj.opts;
    let tempFilePath = processObj.tempFilePath;
    let results = processObj.results;
    let splitUrl = processObj.currentUrl.split('//');
    let replacedUrl = splitUrl[1].replace(/\//g, "_");
    let report = generateReport.generateReportHtml(results);
    let filePath;
    if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
        filePath = path.join(tempFilePath, replacedUrl + '.desktop.report.html');
    } else {
        filePath = path.join(tempFilePath, replacedUrl + '.mobile.report.html');
    }
    // https://stackoverflow.com/questions/34811222/writefile-no-such-file-or-directory
    fs.writeFile(filePath, report, {
        encoding: 'utf-8'
    }, (err) => {
        if (err) throw err;
        if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
            console.log('Wrote desktop report: ', currentUrl)
        } else {
            console.log('Wrote mobile report: ', currentUrl);
        }
    });
};
/**
 * Helper function to queue up async promises.
 * Otherwise, Lighthouse is going to run a report on every URL in the URL list.
 * This will bog down the CPU.
 * @param {[function]} funcList A list of functions to be executed
 * @param {number} [limit=4] The number of parallel processes to execute the funcList
 * 
 */
const parallelLimit = async (funcList, limit = 4) => {
    let inFlight = new Set();
    return funcList.map(async (func, i) => {
        while (inFlight.size >= limit) {
            await Promise.race(inFlight);
        }
        inFlight.add(func);
        await func;
        inFlight.delete(func);
    });
};

/**
 * Listener function for 'queueadd' event from simplecrawler.
 *
 * @param {*} queueItem a URL that has been picked up by the crawler
 */
const queueAdd = (queueItem, urlList) => {
    const regex = /\.(css|jpg|pdf|docx|js|png|ico|gif|svg|psd|ai|zip|gz|zx|src|cassette|mini-profiler|axd|woff|woff2|)/i;
    if (!queueItem.uriPath.match(regex)) {
        urlList.push(queueItem.url);
        console.log("Pushed: ", queueItem.url);
    }
};

const complete = (urlList) => {
    // https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/config
    // for more information on config options for lighthouse
    let opts = {
        extends: 'lighthouse:default',
        chromeFlags: ['--headless'],
    };
    let desktopOpts = {
        extends: 'lighthouse:default',
        chromeFlags: ['--headless'],
        emulatedFormFactor: 'desktop'
    };
    let fileTime = new Date().toLocaleString();
    // Replacing characters that make OS sad
    fileTime = fileTime.replace(/ /g, '');
    fileTime = fileTime.replace(/\//g, '_');
    fileTime = fileTime.replace(/,/g, '_');
    fileTime = fileTime.replace(/:/g, "_");
    // tempFilePath is wherever we want to store the generated report
    let tempFilePath = path.join(__dirname, "lighthouse", fileTime);
    if (!fs.existsSync(tempFilePath)) {
        fs.mkdirSync(tempFilePath, { recursive: true });
    }
    /* 
    async start function
    This prevents the CPU from getting bogged down when Lighthouse tries to run
    a report on every URL in the URL list
    */
    (async () => {
        try {
            let combinedOpts = [desktopOpts, opts];
            const promises = await parallelLimit(
                [
                    processReports(urlList, combinedOpts, tempFilePath)
                ],
                2);
            await Promise.all(promises);
            console.log('Done with reports!');
        } catch (e) {
            console.error(e);
        }
        if (autoOpen) {
            openReports(port);
        }
    })();

};

/**
 *  Opens generated reports in your preferred browser as an explorable list
 *  @param {Number} port Port used by Express
 */
const openReports = (port) => {
    const express = require('express');
    const serveIndex = require('serve-index');
    const app = express();
    app.use(express.static('lighthouse'), serveIndex('lighthouse', { 'icons': true }));
    app.listen(port);
    open('http://localhost:' + port);
};

/**
 * Opens **all** generated reports in your preferred browser without a local server
 *
 * @param {*} tempFilePath
 */
const openReportsWithoutServer = (tempFilePath) => {
    let filePath = tempFilePath;
    if (fs.existsSync(filePath)) {
        fs.readdirSync(filePath).forEach(file => {
            console.log('Opening: ', file);
            let tempPath = path.join(tempFilePath, file);
            open(tempPath);
        });
    }
};
/**
 * Main function.
 * This kicks off the Lighthouse Runner process
 * @param {commander} program - An instance of a Commander.js program
 */
function main(program) {
    let domainRoot;
    if (program.open === undefined) {
        autoOpen = runnerConfig.autoOpenReports;
    } else {
        autoOpen = program.open;
    }
    if (program.url === undefined) {
        domainRoot = new URL(simpleCrawlerConfig.host);
    } else {
        domainRoot = new URL(program.url)
    }
    port = program.port;
    let urlList = [];
    urlList.push(domainRoot.href);
    console.log('Pushed: ', domainRoot.href);
    let simpleCrawler = new Crawler(domainRoot.href)
        .on('queueadd', (queueItem) => {
            queueAdd(queueItem, urlList)
        })
        .on('complete', () => {
            complete(urlList);
        });

    for (key in simpleCrawlerConfig) {
        simpleCrawler[key] = simpleCrawlerConfig[key];
    }
    simpleCrawler.host = domainRoot.hostname;
    if (autoOpen) {
        console.log('Automatically opening reports when done!');
    } else if (!autoOpen) {
        console.log('Not automatically opening reports when done!');
    }
    console.log('Starting simple crawler on', simpleCrawler.host + '!');
    simpleCrawler.start();
}

module.exports = main;
