'use strict';

angular.module('consoleApp')
  .service('Client', function() {

    var _mainScope = { 

      in : {
        query: undefined
      },
      out: {
        processing: false,
        format: 0, // text
        result: undefined
      }
    };

    var _sessionId;
    var _docletId;
    var _account;
    var _accounts;
    var _doclets;
    var _availableCommands;

    this.getMainScope = function() {
      return _mainScope;
    };

    this.getSessionId = function() {
      return _sessionId;
    };

    this.setSessionId = function(sessionId) {
      _sessionId = sessionId;
    };

    this.setDocletId = function(docletId) {
      if (docletId !== undefined) {
        _docletId = docletId;
      }
    };

    this.getDocletId = function() {
      return _docletId;
    };

    this.getAccount = function() {
      return _account;
    };

    this.setAccount = function(account) {
      _account = account;
    };

    this.getAccounts = function() {
      return _accounts;
    };

    this.setAccounts = function(accounts) {
      _accounts = accounts;
    };

    this.setDoclets = function(doclets) {
      _doclets = doclets;
    };

    this.getDoclets = function() {
      return _doclets;
    };

    this.setAvailableCommands = function(availableCommands) {
      _availableCommands = availableCommands;
    };

    this.getAvailableCommands = function() {
      return _availableCommands;
    };

    this.findCommand = function(commandName) {
      
      for (var i = 0; i < _availableCommands.length; i++) {

        if (commandName === _availableCommands[i].name) {
          return _availableCommands[i];
        }
      }

      return undefined;
    };

  });
