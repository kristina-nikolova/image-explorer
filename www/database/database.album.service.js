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
                description: newAlbum.description
            }).then(function (res) {
                newAlbum.id = res.id;
                newAlbum.rev = res.rev;
                DatabaseService.albums.push(newAlbum);

                $rootScope.$broadcast('success', 'Successful created album');

                //dashboards data
                $rootScope.albumsCount += 1;
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function updateAlbum(album) {
            DatabaseService.pouchdb.get(album.id).then(function (res) {
                res.name = album.name;
                res.description = album.description;
                album.rev = res._rev;
                DatabaseService.pouchdb.put(res);

                $rootScope.$broadcast('success', 'Successful edited album');
                $rootScope.$broadcast('editDeleteAction:finish');
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function deleteAlbumById(album) {
            DatabaseService.pouchdb.remove(album.id, album.rev).then(function (res) {
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
                key: 'album'
            }).then(function (res) {
                var array = [];

                if(res.rows && res.rows.length > 0) {
                    for(var i=0; i<res.rows.length; i++){
                        DatabaseService.pouchdb.get(res.rows[i].id).then(function (doc) {
                            doc.id = doc._id;
                            doc.rev = doc._rev;
                            array.push(doc);

                            DatabaseService.albums = array;
                            $rootScope.$broadcast('allAlbums:Loaded', array);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }

                } else {
                    $rootScope.$broadcast('allAlbums:Loaded', array);
                }
            }).catch(function(err) {
                $rootScope.$broadcast('error', err);
                console.log(err);
            });
        }

        return service;
    }

})();


