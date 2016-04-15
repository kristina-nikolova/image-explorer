(function () {
    'use strict';

    angular.module('database')
    .factory('DatabasePhotoTableService', DatabasePhotoTableService)

    DatabasePhotoTableService.$inject = ['$rootScope', '$ionicPlatform', 'DatabaseService'];

    function DatabasePhotoTableService ($rootScope, $ionicPlatform, DatabaseService) {

        var service = {};

        service.createFileTable = createFileTable;
        service.insertFile = insertFile;
        service.updateFile = updateFile;
        service.deleteFileById = deleteFileById;
        service.selectAllFiles = selectAllFiles;
        service.selectAllFilesInAlbum = selectAllFilesInAlbum;

        $ionicPlatform.ready(function() {
            createFileTable();
        });

        function createFileTable () {
            DatabaseService.db.transaction(function (tx) {
                //tx.executeSql("DROP TABLE IF EXISTS file");
                tx.executeSql("CREATE TABLE IF NOT EXISTS file (id integer primary key, album_id integer, name text, url text, note text, location text, dateCreated datetime)");
            });
        }

        function insertFile(album_id, file) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO file (album_id, name, url, note, location, dateCreated) VALUES (?, ?, ?, ?, ?, ?)', [album_id, file.name, file.url, file.note, file.location, file.dateCreated],
                    function(tx, res) {
                        file.id = res.insertId;
                        file.album_id = album_id;
                        DatabaseService.albumFiles.push(file);
                        DatabaseService.allFiles.push(file);
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

        function updateFile(file) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('UPDATE file SET album_id=?, name=?, url=?, note=?, location=?, dateCreated=? WHERE id=?', [file.album_id, file.name, file.url, file.note, file.location, file.dateCreated, file.id],
                    function(tx, res) {
                        $rootScope.$broadcast('success', 'Successful updated photo');

                        //dashboards data
//                        if (file.note != "") {
//                            $rootScope.notesCount += 1;
//                        } else {
//                            $rootScope.notesCount -= 1;
//                        }
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deleteFileById(file) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM file WHERE id = ?', [file.id],
                    function(tx, res) {
                        DatabaseService.deleteFile(file);
                        $rootScope.$broadcast('success', 'Successful deleted from the album');
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllFiles()  {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM file', [],
                    function(tx, res) {
                        var array = [];
                        DatabaseService.allFiles = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            DatabaseService.allFiles = array;
                        }
                        $rootScope.$broadcast('allFiles:Loaded', array);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllFilesInAlbum(album_id)  {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM file WHERE album_id = ?', [album_id],
                    function(tx, res) {
                        var array = [];
                        DatabaseService.albumFiles = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            DatabaseService.albumFiles = array;
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


