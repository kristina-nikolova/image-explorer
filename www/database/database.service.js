(function () {
    'use strict';

    angular.module('database', [])
    .factory('DatabaseService', DatabaseService)

    DatabaseService.$inject = ['$rootScope', '$ionicPlatform'];

    function DatabaseService ($rootScope, $ionicPlatform) {

        var service = {};

        service.mapTypeFunction = mapTypeFunction;
        service.mapAlbumIDFunction = mapAlbumIDFunction;
        service.deletePhoto = deletePhoto;
        service.getAlbumById = getAlbumById;
        service.getAllPhotosInAlbum = getAllPhotosInAlbum;

        service.db = null;

        service.albums = [];
        service.albumPhotos = [];
        service.allPhotos = [];

        $ionicPlatform.ready(function() {
            //PouchDB('imageExplorer.db').destroy();
            service.pouchdb = new PouchDB('imageExplorer.db');
        });

        function mapTypeFunction(doc) {
            emit(doc.type);
        }

        function mapAlbumIDFunction(doc) {
            if (doc.type === 'photo') {
                emit(doc.album_id);
            }
        }

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
                if (service.albums[i].id === albumId) {
                    return service.albums[i];
                }
            }
            return null;
        }

        function getAllPhotosInAlbum(albumId) {
            service.albumPhotos = [];

            for (var i = 0; i < service.allPhotos.length; i++) {
                var photo =  service.allPhotos[i];
                if (photo.album_id === albumId) {
                    service.albumPhotos.push(photo);
                }
            }
        }

        return service;
    }

})();


