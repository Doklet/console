'use strict';

angular.module('consoleApp')
  .service('PipeService', function($http) {

    this.execute = function(commands, text) {

      var args = '';
      var input = '';

      if (commands !== undefined) {
        args += 'pipe=' + commands;
      }

      if (text !== undefined) {
        input = text;
      }

      return $http.post('/api/pipe/run?' + args, input);
    };

  });
