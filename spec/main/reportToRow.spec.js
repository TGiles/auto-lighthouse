const path = require('path');
const fs = require('fs');
const {reportToRow, reportToRowHeaders} = require('../../reportToRow');
const testDesktopCsvPath = path.join(
  __dirname, 
  "../../", 
  'spec', 
  'helpers', 
  'lighthouse', 
  '7_15_2020_6_15_05PM', 
  'tgiles.github.io_web-resume.html.desktop.report.csv'
);
const fileContents = fs.readFileSync(testDesktopCsvPath, { encoding: 'utf-8' });

describe("reportToRow", () => {

  it('converts rows to columns', () => {

    const row = reportToRow(fileContents);

    expect(row[0]).toBe('https://tgiles.github.io/web-resume.html');
    expect(row[1]).toBe('https://tgiles.github.io/web-resume.html');
    expect(row[2]).toBe('0.55');
    expect(row[148]).toBe('-1');
  });
});

describe("reportToRowHeaders", () => {

  it('is long list or metrics', () => {
    expect(reportToRowHeaders[0]).toBe('Requested URL');
    expect(reportToRowHeaders[1]).toBe('Final URL');
    expect(reportToRowHeaders[2]).toBe("Performance: First Contentful Paint (numeric)");
    expect(reportToRowHeaders.length).toBe(150);
  });
});
