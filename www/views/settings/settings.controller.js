(function () {
    'use strict';

    angular.module('settings', [])
        .controller('SettingsCtrl', SettingsCtrl)

    SettingsCtrl.$inject = ['$scope', 'SettingsService'];

    function SettingsCtrl ($scope, SettingsService) {
        $scope.settings =  SettingsService.settings;

        $scope.updateSettings = function(){
            var settings = $scope.settings;
            SettingsService.updateSettings(settings);
        }
    }

})();