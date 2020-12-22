const fs = require('fs');
const path = require('path');
const open = require('open');
const simpleCrawlerConfig = require('./config/simpleCrawler');
/**
 *  Determines the form factor of the given Lighthouse report
 *
 * @param {string} fileName
 * @returns Can be either "desktop" or "mobile" form factor string
 */
const _determineFormFactorReport = (fileName) => {
  let formFactor;
  if (fileName.includes('.desktop')) {
    formFactor = 'desktop';
  } else if (fileName.includes('.mobile')) {
    formFactor = 'mobile';
  }
  return formFactor;
};

/**
 *  Reads the CSV report directory and obtains a list of files
 *
 * @param {string} directoryPath
 * @returns An array of files or false if the directory does not exist
 */
const _readReportDirectory = (directoryPath) => {
  let files;
  try {
    files = fs.readdirSync(directoryPath);
  } catch (e) {
    console.error(e);
    return false;
  }
  return files;
};

/**
 * Creates write streams for the desktop and mobile aggregate reports
 *
 * @param {string} timestamp
 * @param {string} directoryPath
 * @param {string} formFactor
 * @returns an array of write streams
 */
const _createWriteStreams = (timestamp, directoryPath, formFactor) => {
  const desktopAggregateReportName = timestamp + '_desktop_aggregateReport.csv';
  const mobileAggregateReportName = timestamp + '_mobile_aggregateReport.csv';
  let desktopAggregatePath = path.join(directoryPath, desktopAggregateReportName);
  let mobileAggregatePath = path.join(directoryPath, mobileAggregateReportName);
  let desktopWriteStream;
  let mobileWriteStream;
  if (formFactor === 'desktop' || formFactor === 'all') {
    desktopWriteStream = fs.createWriteStream(desktopAggregatePath, { flags: 'a', autoClose: false });
  }
  if (formFactor === 'mobile' || formFactor === 'all') {
    mobileWriteStream = fs.createWriteStream(mobileAggregatePath, { flags: 'a', autoClose: false });
  }
  return [desktopWriteStream, mobileWriteStream];
};

/**
 *
 *
 * @param {boolean} isFirstDesktopReport
 * @param {fs.WriteStream} desktopWriteStream
 * @param {String} fileContents
 * @returns a boolean representing if the given report is the first of its kind
 */
const _writeDesktopCSVStream = (isFirstDesktopReport, desktopWriteStream, fileContents) => {
  if (isFirstDesktopReport) {
    desktopWriteStream.write(fileContents + '\n');
    isFirstDesktopReport = false;
  } else {
    let newContents = fileContents.split('\n').slice(1).join('\n');
    desktopWriteStream.write(newContents + '\n');
  }
  return isFirstDesktopReport;
};

/**
* Writes data to the mobile aggregate report
*
* @param {boolean} isFirstMobileReport
* @param {fs.WriteStream} mobileWriteStream
* @param {String} fileContents
* @returns a boolean representing if the given report is the first of its kind
*/
const _writeMobileCSVStream = (isFirstMobileReport, mobileWriteStream, fileContents) => {
  if (isFirstMobileReport) {
    mobileWriteStream.write(fileContents + '\n');
    isFirstMobileReport = false;
  } else {
    let newContents = fileContents.split('\n').slice(1).join('\n');
    mobileWriteStream.write(newContents + '\n');
  }
  return isFirstMobileReport;
};

/**
 * Process the CSV reports and write their data to the respective write stream.
 *
 * @param {string[]} files
 * @param {string} directoryPath
 * @param {fs.WriteStream} desktopWriteStream
 * @param {fs.WriteStream} mobileWriteStream
 */
const _processCSVFiles = (files, directoryPath, desktopWriteStream, mobileWriteStream) => {
  let isFirstDesktopReport = true;
  let isFirstMobileReport = true;
  files.forEach(fileName => {
    let filePath = path.join(directoryPath, fileName);
    let fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
    let formFactor = _determineFormFactorReport(fileName);
    if (formFactor === 'desktop' && desktopWriteStream) {
      isFirstDesktopReport = _writeDesktopCSVStream(isFirstDesktopReport, desktopWriteStream, fileContents);
    }
    if (formFactor === 'mobile' && mobileWriteStream) {
      isFirstMobileReport = _writeMobileCSVStream(isFirstMobileReport, mobileWriteStream, fileContents);
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

const createFileTime = () => {
  let fileTime = new Date().toLocaleString();
  // Replacing characters that make OS sad
  fileTime = fileTime.replace(/ /g, '__');
  fileTime = fileTime.replace(/\//g, '_');
  fileTime = fileTime.replace(/,/g, '_');
  fileTime = fileTime.replace(/:/g, "_");
  return fileTime;
};

const _determineURLs = (urls, domainRoot) => {
  urls.forEach(url => {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = 'https://' + url;
    }
    domainRoot.push(new URL(url));
  });
};

const _parseProgramURLs = (program) => {
  let domainRoot;
  if (program.url === undefined) {
    throw new Error('No URL given, quitting!');
  }
  if (Array.isArray(program.url)) {
    domainRoot = [];
    _determineURLs(program.url, domainRoot);
  } else {
    if (!program.url.startsWith('https://') && !program.url.startsWith('http://')) {
      program.url = 'https://' + program.url;
    }
    domainRoot = new URL(program.url);
  }
  return domainRoot;
};

const _setupCrawlerConfig = (simpleCrawler, program) => {
  for (let key in simpleCrawlerConfig) {
    simpleCrawler[key] = simpleCrawlerConfig[key];
  }
  simpleCrawler.ignoreWWWDomain = true;
  simpleCrawler.respectRobotsTxt = program.respect;
};

const _populateURLArray = (domainRoot, simpleCrawler, urlList) => {
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
};

const _populateCrawledURLList = (isDomainRootAnArray, domainRoot, simpleCrawler, urlList) => {
  if (isDomainRootAnArray) {
    _populateURLArray(domainRoot, simpleCrawler, urlList);
  } else {
    urlList.push(domainRoot.href);
  }
};

const _determineResultingFilePath = (opts, filePath, tempFilePath, replacedUrl) => {
  if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
    filePath = path.join(tempFilePath, replacedUrl + '.desktop.report.' + opts.output);
  } else {
    filePath = path.join(tempFilePath, replacedUrl + '.mobile.report.' + opts.output);
  }
  return filePath;
};

const _writeReportResultFile = (filePath, report, opts, currentUrl, tempFilePath) => {
  fs.writeFile(filePath, report, {
    encoding: 'utf-8'
  }, (err) => {
    if (err)
      throw err;
    if (opts.emulatedFormFactor && opts.emulatedFormFactor === 'desktop') {
      console.log('Wrote desktop report: ', currentUrl, 'at: ', tempFilePath);
    } else {
      console.log('Wrote mobile report: ', currentUrl, 'at: ', tempFilePath);
    }
  });
};

const _printNumberOfReports = (formFactor, urlList) => {
  if (formFactor !== 'all') {
    console.log(`Generating ${urlList.length} reports!`);
  } else {
    console.log(`Generating ${urlList.length * 2} reports!`);
  }
}

const _closeWriteStreams = (mobileWriteStream, desktopWriteStream) => {
  if (desktopWriteStream) {
    desktopWriteStream.close();
  }
  if (mobileWriteStream) {
    mobileWriteStream.close();
  }
}
const _waitForStreamsToClose = async (mobileWriteStream, desktopWriteStream) => {
  if (desktopWriteStream) {
    let desktopClosed = new Promise((resolve) => {
      desktopWriteStream.on("close", () => resolve(true));
    });
    await desktopClosed;
  }
  if (mobileWriteStream) {
    let mobileClosed = new Promise((resolve) => {
      mobileWriteStream.on("close", () => resolve(true));
    });
    await mobileClosed;
  }
}

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
 * @param {string} tempFilePath
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

module.exports = {
  _determineFormFactorReport,
  _readReportDirectory,
  _createWriteStreams,
  _writeDesktopCSVStream,
  _writeMobileCSVStream,
  _processCSVFiles,
  parallelLimit,
  createFileTime,
  _determineURLs,
  _parseProgramURLs,
  _setupCrawlerConfig,
  _populateURLArray,
  _populateCrawledURLList,
  _determineResultingFilePath,
  _writeReportResultFile,
  _printNumberOfReports,
  _waitForStreamsToClose,
  _closeWriteStreams,
  openReports,
  openReportsWithoutServer
};
