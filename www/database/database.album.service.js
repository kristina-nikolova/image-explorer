(function () {
    'use strict';

    angular.module('database')
    .factory('DatabaseAlbumTableService', DatabaseAlbumTableService)

    DatabaseAlbumTableService.$inject = ['$rootScope', 'DatabaseService'];

    function DatabaseAlbumTableService ($rootScope, DatabaseService) {

        var service = {};

        service.insertAlbum = insertAlbum;
        service.updateAlbum = updateAlbum;
        service.deleteAlbums = deleteAlbums;
        service.selectAlbumById = selectAlbumById;
        service.selectAllAlbums = selectAllAlbums;

        function insertAlbum(newAlbum) {
            DatabaseService.pouchdb.post({
                type: 'album',
                name: newAlbum.name,
                description: newAlbum.description,
                dateAdded: new Date().getTime()
            }).then(function (res) {
                newAlbum.id = res.id;
                DatabaseService.albums.push(newAlbum);
                $rootScope.$broadcast('success', 'Successful created album');

                //dashboards data
                $rootScope.albumsCount += 1;
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function updateAlbum(album) {
            DatabaseService.pouchdb.get(album.id).then(function (updatedAlbum) {
                updatedAlbum.name = album.name;
                updatedAlbum.description = album.description;
                DatabaseService.pouchdb.put(updatedAlbum);

                $rootScope.$broadcast('success', 'Successful edited album');
                $rootScope.$broadcast('editDeleteAction:finish');
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function deleteAlbumById(album) {
            DatabaseService.pouchdb.get(album.id).then(function (res) {
                DatabaseService.pouchdb.remove(res);
                DatabaseService.albums.splice(DatabaseService.albums.indexOf(album), 1);
                deleteAllPhotosInAlbum(album.id);

                //dashboards data
                $rootScope.albumsCount -= 1;
            }).catch(function(err){
                $rootScope.$broadcast('error', err);
            });
        }

        function deleteAlbums(albums) {
            albums.forEach(function(album){
                deleteAlbumById(album);
            });
            $rootScope.$broadcast('success', 'Successful deleted albums');
            $rootScope.$broadcast('editDeleteAction:finish');
        }

        function deleteAllPhotosInAlbum(album_id)  {

            DatabaseService.getAllPhotosInAlbum(album_id);
            var albumPhotos = angular.copy(DatabaseService.albumPhotos);
            if(albumPhotos.length) {
                for (var i = 0; i < albumPhotos.length; i++) {
                    var photo = albumPhotos[i];

                    DatabaseService.pouchdb.query(DatabaseService.mapAlbumIDFunction, {
                        key: album_id
                    }).then(function (res) {
                        DatabaseService.deletePhoto(photo);
                    }).catch(function (err) {
                        $rootScope.$broadcast('error', err);
                    });
                }
            }
        }

        function selectAlbumById(id) {
            DatabaseService.pouchdb.get(id).then(function (res) {
                $rootScope.$broadcast('album:Loaded', res.rows);
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
                console.log(err);
            });
        }

        function selectAllAlbums() {
            DatabaseService.pouchdb.query(DatabaseService.mapTypeFunction, {
                key: 'album',
                include_docs : true
            }).then(function (res) {
                var array = [];

                if(res.rows && res.rows.length > 0) {
                    for(var i=0; i<res.rows.length; i++){
                        var doc = res.rows[i].doc;
                            doc.id = doc._id;
                            array.push(doc);
                    }
                    DatabaseService.albums = array;
                    $rootScope.$broadcast('allAlbums:Loaded', array);
                } else {
                    $rootScope.$broadcast('allAlbums:Loaded', array);
                }
            }).catch(function(err) {
                $rootScope.$broadcast('error', err);
            });
        }

        return service;
    }

})();


