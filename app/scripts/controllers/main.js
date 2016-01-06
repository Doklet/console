'use strict';

angular.module('consoleApp')
  .controller('MainCtrl', function($scope, $location, $window,
    Client, AccountService, DocletService, PipeService) {

    $scope.FORMAT = {
      TEXT: 0,
      TABLE: 1
    };

    $scope.account = undefined;

    $scope.in = {
      commands: undefined,
      text: undefined
    };

    $scope.out = {
      processing: false,
      format: $scope.FORMAT.TEXT,
      result: undefined
    };

    $scope.init = function() {

      // Store session id
      var sessionId = $location.search().token;
      if (sessionId !== undefined) {
        Client.setSessionId($window.unescape(sessionId));
      }

      // Store account if available
      var accountId = $location.search().accountId;
      if (accountId !== undefined) {
        var accountId = $window.unescape($location.search().accountId);

        AccountService.fetchAccount(accountId)
          .success(function(account) {
            Client.setAccount(account);
            $scope.account = account;
          })
          .error(function() {
            $scope.error = 'Failed to fetch account';
          });
      }

      // Store doclets
      DocletService.list()
        .success(function(doclets) {
          Client.setDoclets(doclets);
          $scope.doclets = Client.getDoclets();
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to fetch doclets';
        });
    };

    // Perform init
    $scope.init();

    $scope.run = function() {

      $scope.info = undefined;
      $scope.error = undefined;

      $scope.out.processing = true;

      var commands = $scope.in.commands;
      var input = $scope.in.text;

      PipeService.execute(commands, input)
        .success(function(response) {
          $scope.out.processing = false;
          $scope.out.result = response;
        })
        .error(function(response) {
          $scope.out.processing = false;
          $scope.out.format = $scope.FORMAT.TEXT;
          $scope.out.result = response;

          $scope.info = undefined;
          $scope.error = 'Failed to execute command';
        });
    };

    $scope.saveTo = function(dashboard) {

      // Execute the pipe with the provided parameters
      var commands = $scope.in.commands;

      var cmd = 'brick --name=New --cmds="' + $window.btoa(commands) + '" --bricksid=' + dashboard.id;

      // Set the type depending on selected output view
      switch ($scope.out.format) {
        case $scope.FORMAT.TABLE:
          cmd += ' --table';
          break;
        default:
          cmd += ' --text';
      }

      PipeService.execute(cmd)
        .success(function() {
          var home = $window.unescape($location.search().home);
          $window.top.location = home + '/' + dashboard.id;
        })
        .error(function() {
          $scope.info = undefined;
          $scope.error = 'Failed to save brick';
        });

    };

  });
