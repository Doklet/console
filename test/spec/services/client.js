'use strict';

describe('Service: client', function () {

  // load the service's module
  beforeEach(module('consoleApp'));

  // instantiate service
  var client;
  beforeEach(inject(function (_client_) {
    client = _client_;
  }));

  it('should do something', function () {
    expect(!!client).toBe(true);
  });

});
