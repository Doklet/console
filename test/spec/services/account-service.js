'use strict';

describe('Service: accountService', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var accountService;
  beforeEach(inject(function (_accountService_) {
    accountService = _accountService_;
  }));

  it('should do something', function () {
    expect(!!accountService).toBe(true);
  });

});
