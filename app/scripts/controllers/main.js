'use strict';

angular.module('consoleApp')
  .controller('MainCtrl', function($scope, $location, $window,
    Client, AccountService, DocletService, PipeService, AutosaveService) {

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

    $scope.save = {
      name: undefined
    };

    $scope.init = function() {

      // Store doclet id
      var docletId = $location.search().docletId;
      if (docletId !== undefined) {
        Client.setDocletId($window.unescape(docletId));
      }

      // Store session id
      var sessionId = $location.search().token;
      if (sessionId !== undefined) {
        Client.setSessionId($window.unescape(sessionId));
      }

      // Store account if available
      var accountId = $location.search().accountId;
      if (accountId !== undefined) {
        accountId = $window.unescape($location.search().accountId);

        AccountService.fetchAccount(accountId)
          .success(function(account) {
            Client.setAccount(account);
            $scope.account = account;

            // Fetch any autosave
            AutosaveService.getAutoSave(account)
              .success(function(autosave) {
                $scope.in.commands = autosave.commands;
                $scope.in.text = autosave.input;
              })
              .error(function() {
                // can happen!
              });

          })
          .error(function() {
            $scope.error = 'Failed to fetch account';
          });

      } else {

        // Fetch default autosave
        AutosaveService.getAutoSave(undefined)
          .success(function(autosave) {
            $scope.in.commands = autosave.commands;
            $scope.in.text = autosave.input;

          })
          .error(function() {
            // 
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

    $scope.keys = function(obj) {
      return obj ? Object.keys(obj) : [];
    };

    $scope.isTableOutput = function() {
      // If the output is a array it's valid
      if ($scope.out.result instanceof Array) {
        return true;
      }
      // otherwise it's a not a valid table output
      return false;
    };
    
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

      var name = 'New';
      if ($scope.save.name !== undefined) {
        name = $scope.save.name;
      }

      var commands = $scope.in.commands;
      var input = $scope.in.text;

      var cmd = 'brick --name="' + name + '" --cmds="' + $window.btoa(commands) + '" --bricksid=' + dashboard.id + ' --input=' + $window.btoa(input);

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

    $scope.autoSave = function() {

      var account = Client.getAccount();

      AutosaveService.autoSave(account, $scope.in.commands, $scope.in.text)
        .success(function() {
          // Ignore any result
        })
        .error(function() {
          // Ignore any error
        });
    };

  });
