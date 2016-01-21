'use strict';

angular
  .module('consoleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/commands', {
        templateUrl: 'views/commands.html',
        controller: 'CommandsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('consoleApp').config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});