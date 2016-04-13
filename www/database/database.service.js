(function () {
    'use strict';

    angular.module('database', [])
    .factory('DatabaseService', DatabaseService)

    DatabaseService.$inject = ['$rootScope', '$ionicPlatform', 'AlbumService'];

    function DatabaseService ($rootScope, $ionicPlatform, AlbumService) {

        var service = {};

        service.db = null;

        service.albums = [];
        service.albumFiles = [];
        service.allFiles = [];

        service.crateAlbumTable = crateAlbumTable;
        service.insertAlbum = insertAlbum;
        service.deleteAlbumById = deleteAlbumById;
        service.selectAlbumById = selectAlbumById;
        service.selectAllAlbums = selectAllAlbums;
        service.getAlbumById = getAlbumById;

        service.createFileTable = createFileTable;
        service.insertFile = insertFile;
        service.deleteFileById = deleteFileById;
        service.selectAllFiles = selectAllFiles;
        service.selectAllFilesInAlbum = selectAllFilesInAlbum;

        $ionicPlatform.ready(function() {
            service.db = openDatabase("my.db", "1.0", "File Explorer DB", 200000);

            crateAlbumTable();
            createFileTable();
        });

        //////Albums Table

        function crateAlbumTable () {
            service.db.transaction(function (tx) {
                //tx.executeSql("DROP TABLE IF EXISTS album");
                tx.executeSql("CREATE TABLE IF NOT EXISTS album (id integer primary key, name text, description text)");
            });
        }

        function insertAlbum(newAlbum) {
            service.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO album (name, description) VALUES (?, ?)', [newAlbum.name, newAlbum.description],
                    function(tx, res) {
                        newAlbum.id = res.insertId;
                        service.albums.push(newAlbum);
                        $rootScope.$broadcast('success', 'Successful created album');

                        //dashboards data
                        $rootScope.albumsCount += 1;
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deleteAlbumById(album) {
            service.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM album WHERE id = ?', [album.id],
                    function(tx, res) {
                        service.albums.splice(service.albums.indexOf(album), 1);
                        $rootScope.$broadcast('albums:Updated', service.albums);
                        $rootScope.$broadcast('success', 'Successful deleted album');

                        //dashboards data
                        $rootScope.albumsCount -= 1;
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
            deleteAllFileInAlbum(album.id);
        }

        function selectAlbumById(id) {
            service.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM album WHERE id = ?', [id],
                    function(tx, res) {
                        $rootScope.$broadcast('album:Loaded', res.rows.item(0));
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllAlbums() {
            service.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM album', [],
                    function(tx, res) {
                        var array = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            service.albums = array;
                        }
                        $rootScope.$broadcast('allAlbums:Loaded', array);
                }, function (err) {
                    $rootScope.$broadcast('error', err);
                });
            });
        }

        //use selectAlbumById instead of this!
        function getAlbumById(albumId) {
            for (var i = 0; i < service.albums.length; i++) {
                if (service.albums[i].id === parseInt(albumId)) {
                    return service.albums[i];
                }
            }
            return null;
        }

        /////Files Table

        function createFileTable () {
            service.db.transaction(function (tx) {
                //tx.executeSql("DROP TABLE IF EXISTS file");
                tx.executeSql("CREATE TABLE IF NOT EXISTS file (id integer primary key, album_id integer, name text, url text, note text, location text, dateCreated datetime)");
            });
        }

        function insertFile(album_id, file) {
            service.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO file (album_id, name, url, note, location, dateCreated) VALUES (?, ?, ?, ?, ?, ?)', [album_id, file.name, file.url, file.note, file.location, file.dateCreated],
                    function(tx, res) {
                        file.id = res.insertId;
                        service.albumFiles.push(file);
                        service.allFiles.push(file);
                        $rootScope.$broadcast('success', 'Successful added to the album');

                        //dashboards data
                        $rootScope.allFilesCount += 1;
                        if (file.note != "") {
                            $rootScope.notesCount += 1;
                        }
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deleteFileById(file) {
            service.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM file WHERE id = ?', [file.id],
                    function(tx, res) {
                        deleteFile(file);
                        $rootScope.$broadcast('success', 'Successful deleted from the album');
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deleteAllFileInAlbum(album_id)  {

            for(var i = 0; i < service.albumFiles.length; i++){
                var file = service.albumFiles[i];
                deleteFile(file);
            }

            service.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM file WHERE album_id = ?', [album_id],
                    function(tx, res) {
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        // delete function helper
        function deleteFile(file) {
            service.albumFiles.splice(service.albumFiles.indexOf(file), 1);
            service.allFiles.splice(service.allFiles.indexOf(file), 1);
            $rootScope.$broadcast('filesInAlbum:Updated', service.albumFiles);

            //dashboards data
            $rootScope.allFilesCount -= 1;
            if (file.note != "") {
                $rootScope.notesCount -= 1;
            }
        }

        function selectAllFiles()  {
            service.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM file', [],
                    function(tx, res) {
                        var array = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            service.allFiles = array;
                        }
                        $rootScope.$broadcast('allFiles:Loaded', array);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllFilesInAlbum(album_id)  {
            service.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM file WHERE album_id = ?', [album_id],
                    function(tx, res) {
                        var array = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            service.albumFiles = array;
                        }
                        $rootScope.$broadcast('allFilesInAlbum:Loaded', array);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        return service;
    }

})();


