let _opts = {
  extends: 'lighthouse:default',
  chromeFlags: ['--headless'],
};
let _desktopOpts = {
  extends: 'lighthouse:default',
  chromeFlags: ['--headless'],
  emulatedFormFactor: 'desktop',
};

module.exports = {
  _opts,
  _desktopOpts
}