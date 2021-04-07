const constants = require('lighthouse/lighthouse-core/config/constants');

let _opts = {
  extends: 'lighthouse:default',
  chromeFlags: ['--headless'],
};
// * Desktop config is based off `lr-desktop-config.js`
// https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/lr-desktop-config.js
let _desktopOpts = {
  extends: 'lighthouse:default',
  chromeFlags: ['--headless'],
  maxWaitForFcp: 15 * 1000,
  maxWaitForLoad: 35 * 1000,
  formFactor: 'desktop',
  throttling: constants.throttling.desktopDense4G,
  screenEmulation: constants.screenEmulationMetrics.desktop,
  emulatedUserAgent: constants.userAgents.desktop,
  skipAudits: ['uses-http2'],
};

module.exports = {
  _opts,
  _desktopOpts
}
