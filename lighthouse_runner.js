const Crawler = require('simplecrawler');
const lighthouse = require('lighthouse');
const generateReport = require('lighthouse/lighthouse-core/report/report-generator');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const open = require('open');
const os = require('os');
let autoOpen = false;
let port;
let outputMode;
let threads;
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
/* istanbul ignore next */
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
/* istanbul ignore next */
async function processReports(urlList, opts, tempFilePath) {
    try {
        for (let i = 0; i < urlList.length; i++) {
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

/* istanbul ignore next */
const processResults = (processObj) => {
    let currentUrl = processObj.currentUrl;
    let opts = processObj.opts;
    let tempFilePath = processObj.tempFilePath;
    let results = processObj.results;
    let splitUrl = processObj.currentUrl.split('//');
    let replacedUrl = splitUrl[1].replace(/\//g, "_");
    let report = generateReport.generateReport(results, opts.output);
    let filePath;
    if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
        filePath = path.join(tempFilePath, replacedUrl + '.desktop.report.' + opts.output);
    } else {
        filePath = path.join(tempFilePath, replacedUrl + '.mobile.report.' + opts.output);
    }
    // https://stackoverflow.com/questions/34811222/writefile-no-such-file-or-directory
    fs.writeFile(filePath, report, {
        encoding: 'utf-8'
    }, (err) => {
        if (err) throw err;
        if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
            console.log('Wrote desktop report: ', currentUrl, 'at: ', tempFilePath);
        } else {
            console.log('Wrote mobile report: ', currentUrl, 'at: ', tempFilePath);
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
/* istanbul ignore next */
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
 * @param {{uriPath: string}} queueItem a URL that has been picked up by the crawler
 */
/* istanbul ignore next */
const queueAdd = (queueItem, urlList) => {
    let [fileExtension] = queueItem.uriPath.split('/').slice(-1);
    const regex = /\.(css|jpe?g|pdf|docx?|m?js|png|ico|gif|svgz?|psd|ai|zip|gz|zx|src|cassette|mini-profiler|axd|woff2?|eot|ttf|web[pm]|mp[43]|ogg|txt|webmanifest|json|manifest)$/i;
    if (!fileExtension.match(regex)) {
        urlList.push(queueItem.url);
        console.log("Pushed: ", queueItem.url);
    }
};

/* istanbul ignore next */
const complete = (urlList, autoOpen) => {
    /* 
    ? https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/config
    ? for more information on config options for lighthouse
    */
    let opts = {
        extends: 'lighthouse:default',
        chromeFlags: ['--headless'],
        output: outputMode
    };
    let desktopOpts = {
        extends: 'lighthouse:default',
        chromeFlags: ['--headless'],
        emulatedFormFactor: 'desktop',
        output: outputMode
    };
    let fileTime = new Date().toLocaleString();
    // Replacing characters that make OS sad
    fileTime = fileTime.replace(/ /g, '');
    fileTime = fileTime.replace(/\//g, '_');
    fileTime = fileTime.replace(/,/g, '_');
    fileTime = fileTime.replace(/:/g, "_");
    // tempFilePath is wherever we want to store the generated report
    let tempFilePath = path.join(process.cwd(), "lighthouse", fileTime);
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
                threads);
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
    try {
        app.use(express.static('lighthouse'), serveIndex('lighthouse', { 'icons': true }));
        app.listen(port);
        open('http://localhost:' + port);
        return true;
    } catch (e) {
        throw e;
    }

};

/**
 * Opens **all** generated reports in your preferred browser without a local server
 *
 * @param {*} tempFilePath
 */
const openReportsWithoutServer = (tempFilePath) => {
    let filePath = tempFilePath;
    /* istanbul ignore next */
    if (fs.existsSync(filePath)) {
        fs.readdirSync(filePath).forEach(file => {
            console.log('Opening: ', file);
            let tempPath = path.join(tempFilePath, file);
            open(tempPath);
        });
        return true;
    }
    return false;
};
/**
 * Main function.
 * This kicks off the Lighthouse Runner process
 * @param {commander} program - An instance of a Commander.js program
 */
function main(program) {
    let domainRoot;
    let simpleCrawler;
    outputMode = program.format;
    if (program.threads === undefined) {
        threads = os.cpus().length;
    } else {
        threads = programs.threads;
    }
    if (program.express === undefined) {
        autoOpen = runnerConfig.autoOpenReports;
    } else {
        autoOpen = program.express;
    }
    if (program.url === undefined) {
        throw new Error('No URL given, quitting!');
    } else {
        if (Array.isArray(program.url)) {
            domainRoot = [];
            program.url.forEach(_url => {
                domainRoot.push(new URL(_url));
            });
        } else {
            domainRoot = new URL(program.url);
        }
    }
    let isDomainRootAnArray = Array.isArray(domainRoot);
    port = program.port;
    if (isDomainRootAnArray) {
        simpleCrawler = Crawler(domainRoot[0].href)
            .on('queueadd', (queueItem) => {
                queueAdd(queueItem, urlList)
            })
            .on('complete', () => {
                complete(urlList, autoOpen);
            });

    } else {
        simpleCrawler = Crawler(domainRoot.href)
            .on('queueadd', (queueItem) => {
                queueAdd(queueItem, urlList)
            })
            .on('complete', () => {
                complete(urlList, autoOpen);
            });
    }

    for (let key in simpleCrawlerConfig) {
        simpleCrawler[key] = simpleCrawlerConfig[key];
    }
    simpleCrawler.ignoreWWWDomain = true;
    let urlList = [];
    if (isDomainRootAnArray) {
        if (domainRoot.length > 1) {
            domainRoot.forEach(root => {
                if (!simpleCrawler.queue.includes(root)) {
                    simpleCrawler.domainWhitelist.push(root.hostname);
                    simpleCrawler.queueURL(root.href);
                }
            });
        } else {
            urlList.push(domainRoot[0].href);
        }
    } else {
        urlList.push(domainRoot.href);
    }

    // simpleCrawler.host = domainRoot.hostname;

    if (autoOpen) {
        console.log('Automatically opening reports when done!');
    } else {
        console.log('Not automatically opening reports when done!');
    }
    console.log('Starting simple crawler on', simpleCrawler.host + '!');
    return simpleCrawler.start();
}

module.exports = {
    main,
    openReports,
    openReportsWithoutServer
};
