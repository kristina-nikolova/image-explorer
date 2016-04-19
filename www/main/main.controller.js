(function () {
    'use strict';

    angular.module('main', [])
        .controller('MainCtrl', MainCtrl)

    MainCtrl.$inject = ['$scope', '$rootScope', '$timeout',  'SettingsService', 'DatabaseAlbumTableService', 'DatabasePhotoTableService', '$ionicPlatform'];

    function MainCtrl ($scope, $rootScope, $timeout, SettingsService, DatabaseAlbumTableService, DatabasePhotoTableService, $ionicPlatform) {

        $scope.settings = SettingsService.settings;

        $ionicPlatform.ready(function() {
            DatabaseAlbumTableService.selectAllAlbums();
            DatabasePhotoTableService.selectAllPhotos();
        });

        $rootScope.$on('success', function(e, message){
            $scope.$applyAsync();
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