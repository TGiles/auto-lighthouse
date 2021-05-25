const Crawler = require('simplecrawler');
const lighthouse = require('lighthouse');
const generateReport = require('lighthouse/lighthouse-core/report/report-generator');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Spinner = require('cli-spinner').Spinner;
Spinner.setDefaultSpinnerDelay(100);
let autoOpen = false;
let port;
let outputMode;
let threads;
let formFactor;
let _spinner;
let progressBar;
const runnerConfig = require('./config/runnerConfiguration');
const allowedList = require('./allowedList').allowedList;
const {
  _readReportDirectory,
  _createWriteStreams,
  _processCSVFiles,
  parallelLimit,
  createFileTime,
  _parseProgramURLs,
  _setupCrawlerConfig,
  _populateCrawledURLList,
  _determineResultingFilePath,
  _writeReportResultFile,
  _printNumberOfReports,
  _waitForStreamsToClose,
  openReports,
  openReportsWithoutServer,
  _closeWriteStreams,
  _getNumberOfReports,
  _setupProgressBarReportCreation,
  _setupProgressBarAggregateCsv
} = require('./helpers');
const {
  _opts,
  _desktopOpts
} = require('./lighthouse_opts');

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
  let desktopOpts = opts[0];
  let mobileOpts = opts[1];
  try {
    for (let i = 0; i < urlList.length; i++) {
      let currentUrl = urlList[i];
      if (formFactor === 'mobile' || formFactor === 'all') {
        await launchChromeAndRunLighthouseAsync(currentUrl, mobileOpts)
          .then(results => {
            let processObj = {
              "currentUrl": currentUrl,
              "results": results,
              "tempFilePath": tempFilePath,
              "opts": mobileOpts
            };
            processResults(processObj);
          })
          .catch((err) => {
            console.error(err);
            throw err;
          });
      }
      if (formFactor === 'desktop' || formFactor === 'all') {
        await launchChromeAndRunLighthouseAsync(currentUrl, desktopOpts)
          .then(results => {
            let processObj = {
              "currentUrl": currentUrl,
              "results": results,
              "tempFilePath": tempFilePath,
              "opts": desktopOpts
            };
            processResults(processObj);
          })
          .catch(err => {
            console.error(err);
            throw err;
          });
      }
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
  filePath = _determineResultingFilePath(opts, filePath, tempFilePath, replacedUrl);
  // https://stackoverflow.com/questions/34811222/writefile-no-such-file-or-directory
  _writeReportResultFile(filePath, report, opts, currentUrl, tempFilePath);
  progressBar.increment();
};

/**
 * Listener function for 'queueadd' event from simplecrawler.
 *
 * @param {{uriPath: string}} queueItem a URL that has been picked up by the crawler
 */
/* istanbul ignore next */
const queueAdd = (queueItem, urlList) => {
  const [endOfURLPath] = queueItem.uriPath.split('/').slice(-1);
  const [fileExtension] = endOfURLPath.split('.').slice(-1);
  const isValidWebPage = allowedList.includes(fileExtension);

  if (isValidWebPage) {
    urlList.push(queueItem.url);
    console.info(`Pushed: ${queueItem.url}`);

    // if end of the path is /xyz/, this is still a valid path
  } if (endOfURLPath.length === 0) {
    urlList.push(queueItem.url);
    console.info(`\n Pushed: ${queueItem.url}`);
  }
  else {
    // if uri path is clean/no file path
    if (!endOfURLPath.includes('.')) {
      urlList.push(queueItem.url);
      console.info(`\n Pushed: ${queueItem.url}`);
    }
  }
};
/* istanbul ignore next */
/**
 *
 *
 * @param {String []} urlList List of valid urls from simplecrawler
 * @param {boolean} autoOpen
 */
const complete = (urlList, autoOpen) => {
  /* 
  ? https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/config
  ? for more information on config options for lighthouse
  */
  _spinner.stop(true);
  let opts = _opts;
  opts.output = outputMode;
  let desktopOpts = _desktopOpts;
  desktopOpts.output = outputMode;
  const fileTime = createFileTime();
  // tempFilePath is wherever we want to store the generated report
  let tempFilePath = path.join(process.cwd(), "lighthouse", fileTime);
  if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath, { recursive: true });
  }
  _printNumberOfReports(formFactor, urlList);
  progressBar = _setupProgressBarReportCreation(formFactor, urlList);

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
      progressBar.stop();
      console.log('Done creating reports!');
      if (outputMode === 'csv') {
        aggregateCSVReports(tempFilePath, formFactor);
      }
    } catch (e) {
      console.error(e);
    }
    if (autoOpen) {
      openReports(port);
    }
  })();

};

/**
 * Given a directory path to CSV reports, create two aggregate reports from the data.
 * One aggregate report is for desktop data and the other report is for mobile data.
 *
 * @param {string} directoryPath
 * @param {string} formFactor
 * @returns {boolean} didAggregateSuccessfully
 */
const aggregateCSVReports = async (directoryPath, formFactor) => {
  let didAggregateSuccessfully = true;
  const parsedDirectoryPath = path.parse(directoryPath);
  const timestamp = parsedDirectoryPath.base;
  let files = _readReportDirectory(directoryPath);
  if (!files) {
    return false;
  }
  let [desktopWriteStream, mobileWriteStream] = _createWriteStreams(timestamp, directoryPath, formFactor);
  let progressBar = _setupProgressBarAggregateCsv(desktopWriteStream, mobileWriteStream, files);
  const aggregateName = "_aggregateReport";
  files = files.filter(fileName => !fileName.includes(aggregateName));
  let processCSVObject = {
    files,
    directoryPath,
    desktopWriteStream,
    mobileWriteStream,
    progressBar
  };
  try {
    // _processCSVFiles(files, directoryPath, desktopWriteStream, mobileWriteStream, progressBar);
    _processCSVFiles(processCSVObject);
  }
  catch (e) {
    console.error(e);
    didAggregateSuccessfully = false;
  } finally {
    progressBar.stop();
    _closeWriteStreams();
  }

  console.info("Waiting for streams to close!");
  await _waitForStreamsToClose();
  console.info("Streams closed!");
  return didAggregateSuccessfully;
};


const _parseProgramParameters = (options) => {
  outputMode = options.format;
  port = options.port;
  if (options.device === 'mobile' || options.device === 'desktop') {
    formFactor = options.device;
  } else {
    formFactor = 'all';
  }
  if (options.threads === undefined) {
    threads = os.cpus().length;
  } else {
    threads = options.threads;
  }
  if (options.express === undefined) {
    autoOpen = runnerConfig.autoOpenReports;
  } else {
    autoOpen = options.express;
  }
  if(!options.verbose) {
    console.info = function () {};
  }
};


/**
 *  Sets up the 'queueadd' and 'complete' events for the crawler
 *
 * @param {string} domainRoot
 * @param {Crawler} simpleCrawler
 * @param {boolean} isDomainRootAnArray
 * @param {string[]} urlList
 * @returns
 */
const _setupCrawlerEvents = (domainRoot, simpleCrawler, isDomainRootAnArray, urlList) => {
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
  return simpleCrawler;
};

/**
 * Main function.
 * This kicks off the Lighthouse Runner process
 * @param {commander} program - An instance of a Commander.js program
 */
function main(program) {
  let domainRoot;
  let simpleCrawler;
  let programOptions = (program.opts === undefined) ? program : program.opts();
  _parseProgramParameters(programOptions);
  domainRoot = _parseProgramURLs(programOptions);
  let isDomainRootAnArray = Array.isArray(domainRoot);
  let urlList = [];
  simpleCrawler = _setupCrawlerEvents(domainRoot, simpleCrawler, isDomainRootAnArray, urlList);
  _setupCrawlerConfig(simpleCrawler, programOptions);
  _populateCrawledURLList(isDomainRootAnArray, domainRoot, simpleCrawler, urlList);

  if (autoOpen) {
    console.log('Automatically opening reports when done!');
  } else {
    console.log('Not automatically opening reports when done!');
  }
  console.info('Starting simple crawler on', simpleCrawler.host + '!');
  _spinner = new Spinner('Crawling domains... %s');
  _spinner.start();
  return simpleCrawler.start();
}

module.exports = {
  main,
  openReports,
  openReportsWithoutServer,
  aggregateCSVReports
};
