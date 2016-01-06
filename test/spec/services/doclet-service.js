'use strict';

describe('Service: docletService', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var docletService;
  beforeEach(inject(function (_docletService_) {
    docletService = _docletService_;
  }));

  it('should do something', function () {
    expect(!!docletService).toBe(true);
  });

});
