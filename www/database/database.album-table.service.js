(function () {
    'use strict';

    angular.module('database')
    .factory('DatabaseAlbumTableService', DatabaseAlbumTableService)

    DatabaseAlbumTableService.$inject = ['$rootScope', '$ionicPlatform', 'DatabaseService'];

    function DatabaseAlbumTableService ($rootScope, $ionicPlatform, DatabaseService) {

        var service = {};

        service.crateAlbumTable = crateAlbumTable;
        service.insertAlbum = insertAlbum;
        service.updateAlbum = updateAlbum;
        service.deleteAlbumById = deleteAlbumById;
        service.selectAlbumById = selectAlbumById;
        service.selectAllAlbums = selectAllAlbums;

        $ionicPlatform.ready(function() {
            crateAlbumTable();
        });

        function crateAlbumTable () {
            DatabaseService.db.transaction(function (tx) {
                //tx.executeSql("DROP TABLE IF EXISTS album");
                tx.executeSql("CREATE TABLE IF NOT EXISTS album (id integer primary key, name text, description text)");
            });
        }

        function insertAlbum(newAlbum) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO album (name, description) VALUES (?, ?)', [newAlbum.name, newAlbum.description],
                    function(tx, res) {
                        newAlbum.id = res.insertId;
                        DatabaseService.albums.push(newAlbum);
                        $rootScope.$broadcast('success', 'Successful created album');

                        //dashboards data
                        $rootScope.albumsCount += 1;
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function updateAlbum(album) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('UPDATE album SET name=?, description=? WHERE id=?', [album.name, album.description, album.id],
                    function(tx, res) {
                        $rootScope.$broadcast('success', 'Successful edited album');
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deleteAlbumById(album) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM album WHERE id = ?', [album.id],
                    function(tx, res) {
                        DatabaseService.albums.splice(DatabaseService.albums.indexOf(album), 1);
                        $rootScope.$broadcast('albums:Updated');
                        $rootScope.$broadcast('success', 'Successful deleted album');

                        //dashboards data
                        $rootScope.albumsCount -= 1;
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
            deleteAllFileInAlbum(album.id);
        }

        function deleteAllFileInAlbum(album_id)  {

            DatabaseService.getAllFilesInAlbum(album_id);
            var albumFiles = angular.copy(DatabaseService.albumFiles);
            for(var i = 0; i < albumFiles.length; i++){
                var file = albumFiles[i];
                DatabaseService.deleteFile(file);
            }

            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM file WHERE album_id = ?', [album_id],
                    function(tx, res) {
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAlbumById(id) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM album WHERE id = ?', [id],
                    function(tx, res) {
                        $rootScope.$broadcast('album:Loaded', res.rows.item(0));
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllAlbums() {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM album', [],
                    function(tx, res) {
                        var array = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            DatabaseService.albums = array;
                        }
                        $rootScope.$broadcast('allAlbums:Loaded', array);
                }, function (err) {
                    $rootScope.$broadcast('error', err);
                });
            });
        }

        return service;
    }

})();


