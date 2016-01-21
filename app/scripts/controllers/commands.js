'use strict';
 
angular.module('consoleApp')
  .controller('CommandsCtrl', function ($scope, Client) {

    $scope.availableCommands = Client.getAvailableCommands();
  });
