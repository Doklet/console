'use strict';

angular.module('consoleApp')
  .filter('dashboardFilter', function() {

    return function(doclets) {

      var filtered = [];

      if (doclets === undefined) {
        return filtered;
      }

      for (var i = 0; i < doclets.length; i++) {

        var doclet = doclets[i];

        // Only include bricks package
        if (doclet.packageId === 'bricks') {
          filtered.push(doclet);
        }
      }

      return filtered;
    };

  });
