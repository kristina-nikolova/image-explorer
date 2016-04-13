(function () {
    'use strict';

    angular.module('settings')
    .factory('SettingsService', SettingsService)

    SettingsService.$inject = [];

    function SettingsService () {

        var service = {};

        service.settings = {
            enableNotes: true
        }

        service.updateSettings = updateSettings;

        function updateSettings (newSettings) {
            service.settings = newSettings;
        }

        return service;
    }

})();


