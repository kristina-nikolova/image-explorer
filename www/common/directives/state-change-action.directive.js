(function () {
    'use strict';

    angular.module('directives', [])
    .directive("stateChangeAction", function() {

       var Ctrl = function($scope, $rootScope) {
           $rootScope.$on('$stateChangeStart',
               function(event, toState, toParams, fromState, fromParams){
                    $scope.action();
               });
        }

        return {
            restrict: 'A',
            scope: {
                action: '&'
            },
            controller: Ctrl
        };
    });

})();