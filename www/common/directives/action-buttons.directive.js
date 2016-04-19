(function () {
    'use strict';

    angular.module('directives', [])
    .directive("actionButtons", function() {

       var Ctrl = function($scope, $rootScope) {

           $scope.enterInEditMode = function(){
               $scope.isInEditMode = true;
           }

           $scope.enterInDeleteMode = function(){
               $scope.isInDeleteMode = true;
           }

           $scope.exitFromEditDeleteMode = function() {
               if($scope.isInEditMode || $scope.isInDeleteMode) {
                   $scope.isInDeleteMode = false;
                   $scope.isInEditMode = false;
               }
           }
        }

        return {
            restrict: 'E',
            scope: {
                addAction: '&',
                isInEditMode: '=',
                isInDeleteMode: '=',
                condition: '=',
                items: '='
            },
            templateUrl: "common/directives/action-buttons.template.html",
            controller: Ctrl
        };
    });

})();