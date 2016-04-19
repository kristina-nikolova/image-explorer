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

        $rootScope.$on('allPhotos:Loaded', function (event, photos) {
            $rootScope.allPhotosCount = photos.length;
            if($rootScope.allPhotosCount) {
                $rootScope.notesCount = photos.filter(function (photo) {
                    return photo.note != "";
                }).length;
            } else {
                $rootScope.notesCount = 0;
            }
            $rootScope.$applyAsync();
        });

    }

})();