'use strict';

describe('Filter: dashboardFilter', function () {

  // load the filter's module
  beforeEach(module('consoleApp'));

  // initialize a new instance of the filter before each test
  var dashboardFilter;
  beforeEach(inject(function ($filter) {
    dashboardFilter = $filter('dashboardFilter');
  }));

  it('should return the input prefixed with "dashboardFilter filter:"', function () {
    var text = 'angularjs';
    expect(dashboardFilter(text)).toBe('dashboardFilter filter: ' + text);
  });

});
