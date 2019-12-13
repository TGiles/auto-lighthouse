const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
describe("main", () => {
  it('was called once', () => {
    let lighthouse_runner = require("../../lighthouse_runner");
    spyOn(lighthouse_runner, "main");
    lighthouse_runner.main(1);
    expect(lighthouse_runner.main).toHaveBeenCalled();
  });
  it('should return true if the crawler starts', () => {
    let runner = require('../../lighthouse_runner');
    let error = new Error('error');
    spyOn(runner, "main").and.callFake((crawler) => {
      if (crawler) {
        return true;
      } else {
        throw error;
      }
    });
    let crawler = {};
    let result = runner.main(crawler);
    expect(runner.main).toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(() => { runner.main();}).toThrow(error);
  });
  it('should run without errors and not open reports', () => {
    let runner = require('../../lighthouse_runner');
    let mockProgram = {
      port: 8000,
      url: 'https://tgiles.github.io'
    };
    expect(runner.openReports).toBeDefined();
    expect(runner.openReportsWithoutServer).toBeDefined();
    spyOn(runner, "openReports");
    spyOn(runner, "openReportsWithoutServer");
    let result = runner.main(mockProgram);
    expect(result).toBeTruthy();
    expect(runner.openReports).not.toHaveBeenCalled();
    expect(runner.openReportsWithoutServer).not.toHaveBeenCalled();
  });
  it('should use the passed parameters over defaults', () => {
    let runner = require('../../lighthouse_runner');
    let mockProgram = {
      express: true,
      url: 'https://tgiles.github.io',
      port: 8000
    };
    spyOn(runner, "main").and.callThrough();

    let result = runner.main(mockProgram);
    expect(runner.main).toHaveBeenCalledWith(mockProgram);
    expect(result).toBeTruthy();
  });
  it('should use fail if required params are not present', () => {
    let runner = require('../../lighthouse_runner');
    let errorMessage = 'No URL given, quitting!'
    spyOn(runner, "main").and.callThrough();
    let mockProgram = {
      url: undefined,
      port: 9000
    };
    expect(() => { runner.main(mockProgram);}).toThrowError(errorMessage);
  });
});
describe("openReportsWithoutServer", () => {
  let runner = null;
  beforeEach(() => {
    runner = require("../../lighthouse_runner");
  });
  it('returns true if file(s) were opened successfully, false otherwise', () => {
    spyOn(runner, "openReportsWithoutServer").and.callFake((tempFilePath) => {
      if (tempFilePath) {
        return true;
      } else {
        return false;
      }
    })
    let result = runner.openReportsWithoutServer(true);
    expect(runner.openReportsWithoutServer).toHaveBeenCalled();
    expect(result).toBeTruthy();

    result = runner.openReportsWithoutServer(false);
    expect(runner.openReportsWithoutServer).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });
  it('returns true if the file path exists', () => {
    spyOn(runner, "openReportsWithoutServer").and.callFake((filePath) => {
      if (fs.existsSync(filePath)) {
        return true;
      } else {
        return false;
      }
    });
    let someActualPath = path.join(__dirname, '../../', 'spec', 'helpers', 'lighthouse');
    let result = runner.openReportsWithoutServer(someActualPath);
    expect(runner.openReportsWithoutServer).toHaveBeenCalledWith(someActualPath);
    expect(result).toBeTruthy();
    let someFakePath = path.join(__dirname, 'spec', 'helpers', 'non');
    result = runner.openReportsWithoutServer(someFakePath);
    expect(runner.openReportsWithoutServer).toHaveBeenCalledWith(someFakePath);
    expect(result).toBeFalsy();
  });
  it('returns false if the file path does not exist', () => {
    spyOn(runner, "openReportsWithoutServer").and.callFake((filePath) => {
      if (fs.existsSync(filePath)) {
        return true;
      } else {
        return false;
      }
    });
    let someFakePath = path.join(__dirname, 'spec', 'helpers', 'non');
    let result = runner.openReportsWithoutServer(someFakePath);
    expect(runner.openReportsWithoutServer).toHaveBeenCalledWith(someFakePath);
    expect(result).toBeFalsy();
    let someActualPath = path.join(__dirname, '../../', 'spec', 'helpers', 'lighthouse');
    result = runner.openReportsWithoutServer(someActualPath);
    expect(runner.openReportsWithoutServer).toHaveBeenCalledWith(someActualPath);
    expect(result).toBeTruthy();
  });
});

describe("openReports", () => {
  let runner = null;
  beforeEach(() => {
    runner = require('../../lighthouse_runner');
  });
  it('returns true if the server started successfully, throws exception otherwise', () => {
    let errorMsg = 'Server did not start!';
    spyOn(runner, "openReports").and.callFake((port) => {
      if (port > 1 && port < 65536) {
        return true;
      } else {
        throw new Error(errorMsg);
      }
    });
    let validPort = 8080;
    let invalidPort = -1;
    let result = runner.openReports(validPort);
    expect(runner.openReports).toHaveBeenCalled();
    expect(runner.openReports).toHaveBeenCalledWith(validPort);
    expect(result).toBeTruthy();

    expect(() => { runner.openReports(invalidPort); }).toThrowError(errorMsg);
  });
  it('should only be called when autoOpen is set to true', () => {
    let runner = require('../../lighthouse_runner');
    spyOn(runner, "openReports");
    spyOn(runner, "main").and.callFake((autoOpen) => {
      if (autoOpen) {
        runner.openReports();
      }
    });
    let result = runner.main(false);
    expect(runner.openReports).not.toHaveBeenCalled();
    result = runner.main(true);
    expect(runner.openReports).toHaveBeenCalled();
  });
  it('return true on success', () => {
    let runner = require('../../lighthouse_runner');
    let port = 8500;
    spyOn(runner, "openReports").and.callThrough();
    let result = runner.openReports(port);
    expect(result).toBeTruthy();
    expect(runner.openReports).toHaveBeenCalledWith(port);
  });
  it('should throw an error if the server cannot be started', () => {
    let runner = require('../../lighthouse_runner');
    let port = -1;
    spyOn(runner, "openReports").and.callThrough();
    expect(() => { runner.openReports(port);}).toThrowError();
  });
});