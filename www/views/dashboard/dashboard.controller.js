(function () {
    'use strict';

    angular.module('dashboard', [])
        .controller('DashboardCtrl', DashboardCtrl)

    DashboardCtrl.$inject = ['$rootScope'];

    function DashboardCtrl ($rootScope) {

        $rootScope.$on('allAlbums:Loaded', function (event, albums) {
            $rootScope.albumsCount = albums.length;
            $rootScope.$applyAsync();
        });

        $rootScope.$on('allFiles:Loaded', function (event, files) {
            $rootScope.allFilesCount = files.length;
            if($rootScope.allFilesCount) {
                $rootScope.notesCount = files.filter(function (file) {
                    return file.note != "";
                }).length;
            } else {
                $rootScope.notesCount = 0;
            }
            $rootScope.$applyAsync();
        });

    }

})();