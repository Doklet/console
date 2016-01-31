'use strict';

angular.module('consoleApp')
  .controller('MainCtrl', function($scope, $location, $window, $timeout, $log,
    Client, AccountService, DocletService, PipeService, AutosaveService) {

    $scope.FORMAT = {
      TEXT: 0,
      TABLE: 1
    };

    // $scope.account = undefined;

    // $scope.in = {
    //   commands: undefined,
    //   text: undefined
    // };

    // $scope.out = {
    //   processing: false,
    //   format: $scope.FORMAT.TEXT,
    //   result: undefined
    // };

    // $scope.save = {
    //   name: undefined
    // };

    $scope.autoComplete = {
      show: false,
      filterBy: undefined,
      command: undefined,
      showAccounts: false
    };

    $scope.init = function() {

      // Get the main scope from the client
      // will be the default one 
      var mainScope = Client.getMainScope();

      $scope.in = mainScope.in;
      $scope.out = mainScope.out;


      if (Client.getSessionId() === undefined) {

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

          // Fetch any autosave for the default context
          AutosaveService.getAutoSave(undefined)
            .success(function(autosave) {
              $scope.in.commands = autosave.commands;
              $scope.in.text = autosave.input;
            })
            .error(function() {
              // can happen!
            });
        }

        // Fetch the users doclets
        DocletService.list()
          .success(function(doclets) {
            Client.setDoclets(doclets);
            $scope.doclets = Client.getDoclets();
          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch doclets';
          });

        // Fetch all available commands
        PipeService.getAllCommands()
          .success(function(commands) {
            Client.setAvailableCommands(commands);
            $scope.availableCommands = Client.getAvailableCommands();
          })
          .error(function() {
            $scope.info = undefined;
            $scope.error = 'Failed to fetch commands';
          });

        AccountService.getAllAccounts()
          .success(function(accounts) {
            Client.setAccounts(accounts);
            $scope.accounts = accounts;
          })
          .error(function() {
            $scope.error = 'Failed to fetch accounts';
          });

      } else {

        // Get the main scope from the client
        // will be the default one 
        var savedScope = Client.getMainScope();

        $scope.in = savedScope.in;
        $scope.out = savedScope.out;
        $scope.account = Client.getAccount();
        $scope.doclets = Client.getDoclets();
        $scope.availableCommands = Client.getAvailableCommands();

        // // Fetch default autosave
        // AutosaveService.getAutoSave(undefined)
        //   .success(function(autosave) {
        //     $scope.in.commands = autosave.commands;
        //     $scope.in.text = autosave.input;
        //   })
        //   .error(function() {
        //     // 
        //   });
      }
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

    // For auto complete
    $scope.commandSelected = function(command) {

      var commands = $scope.in.commands;

      if (commands === undefined || commands.length === 0) {
        $scope.in.commands = command.name;
      } else {

        // remove the last word
        var lastIndex = commands.lastIndexOf(' ');
        var trimmed = commands.substring(0, lastIndex);

        $scope.in.commands = trimmed + ' ' + command.name;
      }

    };

    $scope.optionSelected = function(option) {

      var commands = $scope.in.commands;

      // remove the last word
      var lastIndex = commands.lastIndexOf(' ');
      var trimmed = commands.substring(0, lastIndex);

      $scope.in.commands = trimmed + ' --' + option.name;
    };

    $scope.accountSelected = function(account) {

      $scope.in.commands += account.name;
    };

    $scope.hasWrittenAccountOption = function(commands) {

      // Get the last word
      var n = commands.split(' ');
      var lastword = n[n.length - 1];

      if (lastword !== undefined) {

        var contains = lastword.lastIndexOf('--account=') !== -1;

        return contains;
      }

      return false;
    };

    // end autocomplete

    $scope.commandsBlur = function() {
      $timeout(function() {
          $scope.autoComplete.show = false;
        },
        300
      );
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

      $scope.autoComplete.filterBy = $scope.parseFilterBy($scope.in.commands);
      $scope.autoComplete.command = Client.findCommand($scope.autoComplete.filterBy);
      $scope.autoComplete.showAccounts = $scope.hasWrittenAccountOption($scope.in.commands);

      var account = Client.getAccount();

      AutosaveService.autoSave(account, $scope.in.commands, $scope.in.text)
        .success(function() {
          // Ignore any result
        })
        .error(function() {
          // Ignore any error
        });
    };

    $scope.parseFilterBy = function(commandPipe) {

      var commands = commandPipe.split('|');

      var reversed = commands.reverse()[0];

      var currentWithOpts = reversed.trim().split(' ');

      return currentWithOpts[0];
    };

  });
