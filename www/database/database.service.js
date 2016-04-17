(function () {
    'use strict';

    angular.module('database', [])
    .factory('DatabaseService', DatabaseService)

    DatabaseService.$inject = ['$rootScope', '$ionicPlatform'];

    function DatabaseService ($rootScope, $ionicPlatform) {

        var service = {};

        service.deleteFile = deleteFile;
        service.getAlbumById = getAlbumById;
        service.getAllFilesInAlbum = getAllFilesInAlbum;

        service.db = null;

        service.albums = [];
        service.albumFiles = [];
        service.allFiles = [];

        $ionicPlatform.ready(function() {
            service.db = openDatabase("my.db", "1.0", "File Explorer DB", 200000);
        });

        //helper used in album and file tables
        function deleteFile(file) {
            service.albumFiles.splice(service.albumFiles.indexOf(file), 1);
            service.allFiles.splice(service.allFiles.indexOf(file), 1);

            //dashboards data
            $rootScope.allFilesCount -= 1;
            if (file.note != "") {
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

        function getAllFilesInAlbum(albumId) {
            service.albumFiles = [];

            for (var i = 0; i < service.allFiles.length; i++) {
                var file =  service.allFiles[i];
                if (file.album_id === parseInt(albumId)) {
                    service.albumFiles.push(file);
                }
            }
        }

        return service;
    }

})();


