(function () {
    'use strict';

    angular.module('database', [])
    .factory('DatabaseService', DatabaseService)

    DatabaseService.$inject = ['$rootScope', '$ionicPlatform'];

    function DatabaseService ($rootScope, $ionicPlatform) {

        var service = {};

        service.deletePhoto = deletePhoto;
        service.getAlbumById = getAlbumById;
        service.getAllPhotosInAlbum = getAllPhotosInAlbum;

        service.db = null;

        service.albums = [];
        service.albumPhotos = [];
        service.allPhotos = [];

        $ionicPlatform.ready(function() {
            service.db = openDatabase("my.db", "1.0", "Image Explorer DB", 200000);
        });

        //helper used in album and photo tables
        function deletePhoto(photo) {
            service.albumPhotos.splice(service.albumPhotos.indexOf(photo), 1);
            service.allPhotos.splice(service.allPhotos.indexOf(photo), 1);

            //dashboards data
            $rootScope.allPhotosCount -= 1;
            if (photo.note != "") {
                $rootScope.notesCount -= 1;
            }
        }

        function getAlbumById(albumId) {
            for (var i = 0; i < service.albums.length; i++) {
                if (service.albums[i].id === parseInt(albumId)) {
                    return service.albums[i];
                }
            }
            return null;
        }

        function getAllPhotosInAlbum(albumId) {
            service.albumPhotos = [];

            for (var i = 0; i < service.allPhotos.length; i++) {
                var photo =  service.allPhotos[i];
                if (photo.album_id === parseInt(albumId)) {
                    service.albumPhotos.push(photo);
                }
            }
        }

        return service;
    }

})();


