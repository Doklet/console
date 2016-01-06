'use strict';

angular.module('consoleApp')
  .service('AccountService', function($http) {

    this.fetchAccount = function(accountId) {
      return $http.get('/api/account/' + accountId);
    };

  });
