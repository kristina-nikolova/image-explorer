(function () {
    'use strict';

    angular.module('directives', [])
    .directive("actionButtons", function() {

       var Ctrl = function($scope, $rootScope) {

           $scope.$on('editDeleteAction:finish', function () {
               $scope.exitFromEditDeleteMode();
           });

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
                   $rootScope.$broadcast('editMode:exit');
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
                items: '=',
                onDeleteButtonClicked: '&'
            },
            templateUrl: "common/directives/action-buttons.template.html",
            controller: Ctrl
        };
    });

})();