'use strict';

angular.module('consoleApp')
  .service('Client', function() {

    var _sessionId;
    var _account;
    var _doclets;

    this.getSessionId = function() {
      return _sessionId;
    };

    this.setSessionId = function(sessionId) {
      _sessionId = sessionId;
    };

    this.getAccount = function() {
      return _account;
    };

    this.setAccount = function(account) {
      _account = account;
    };

    this.setDoclets = function(doclets) {
      _doclets = doclets;
    };

    this.getDoclets = function() {
      return _doclets;
    };

  });
