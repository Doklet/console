'use strict';

describe('Service: autosaveService', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var autosaveService;
  beforeEach(inject(function (_autosaveService_) {
    autosaveService = _autosaveService_;
  }));

  it('should do something', function () {
    expect(!!autosaveService).toBe(true);
  });

});
