'use strict';

describe('Controller: CommandsCtrl', function () {

  // load the controller's module
  beforeEach(module('consoleApp'));

  var CommandsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommandsCtrl = $controller('CommandsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
