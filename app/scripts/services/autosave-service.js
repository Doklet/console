'use strict';


angular.module('consoleApp')
  .service('AutosaveService', function($http, Client) {

    this.getAutoSave = function(account) {

      var docletId = Client.getDocletId();

      var accountId = '__default';
      if (account !== undefined) {
      	accountId = account.id;
      }

      return $http.get('/api/doclet/' + docletId + '/bucket/autosave/' + accountId);
    };

    this.autoSave = function(account, commands, text) {

      var docletId = Client.getDocletId();

      var accountId = '__default';
      if (account !== undefined) {
      	accountId = account.id;
      }

      var autosave = {
        commands: commands,
        input: text
      };

      return $http.put('/api/doclet/' + docletId + '/bucket/autosave/' + accountId, autosave);
    };
  });
