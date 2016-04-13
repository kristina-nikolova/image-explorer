(function () {
    'use strict';

    angular.module('main', [])
        .controller('MainCtrl', MainCtrl)

    MainCtrl.$inject = ['$scope', '$rootScope', '$timeout',  'SettingsService', 'DatabaseService', '$ionicPlatform'];

    function MainCtrl ($scope, $rootScope, $timeout, SettingsService, DatabaseService, $ionicPlatform) {

        $scope.settings = SettingsService.settings;

        $ionicPlatform.ready(function() {
            DatabaseService.selectAllAlbums();
            DatabaseService.selectAllFiles();
        });

        $rootScope.$on('success', function(e, message){
            $rootScope.success = message;

            $timeout(function(){
                $rootScope.success = "";
            }, 3000)
        });

        $rootScope.$on('error', function(e, message){
            $rootScope.error = message;

            $timeout(function(){
                $rootScope.error = "";
            }, 3000)
        });
    }

})();