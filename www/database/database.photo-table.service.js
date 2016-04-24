(function () {
    'use strict';

    angular.module('database')
    .factory('DatabasePhotoTableService', DatabasePhotoTableService)

    DatabasePhotoTableService.$inject = ['$rootScope', '$ionicPlatform', 'DatabaseService'];

    function DatabasePhotoTableService ($rootScope, $ionicPlatform, DatabaseService) {

        var service = {};

        service.createPhotoTable = createPhotoTable;
        service.insertPhoto = insertPhoto;
        service.updatePhoto = updatePhoto;
        service.deletePhotos = deletePhotos;
        service.selectAllPhotos = selectAllPhotos;
        service.selectAllPhotosInAlbum = selectAllPhotosInAlbum;

        $ionicPlatform.ready(function() {
            createPhotoTable();
        });

        function createPhotoTable () {
            DatabaseService.db.transaction(function (tx) {
                //tx.executeSql("DROP TABLE IF EXISTS photo");
                tx.executeSql("CREATE TABLE IF NOT EXISTS photo (id integer primary key, album_id integer, name text, url text, note text, location text, dateCreated datetime, long integer, lat integer)");
            });
        }

        function insertPhoto(album_id, photo) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('INSERT INTO photo (album_id, name, url, note, location, dateCreated, long, lat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [album_id, photo.name, photo.url, photo.note, photo.location, photo.dateCreated, photo.long, photo.lat],
                    function(tx, res) {
                        photo.id = res.insertId;
                        photo.album_id = album_id;
                        DatabaseService.albumPhotos.push(photo);
                        DatabaseService.allPhotos.push(photo);
                        $rootScope.$broadcast('success', 'Successful added to the album');

                        //dashboards data
                        $rootScope.allPhotosCount += 1;
                        if (photo.note != "") {
                            $rootScope.notesCount += 1;
                        }
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function updatePhoto(photo) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('UPDATE photo SET name=?, note=? WHERE id=?', [photo.name, photo.note, photo.id],
                    function(tx, res) {
                        $rootScope.$broadcast('success', 'Successful updated photo');
                        $rootScope.$broadcast('editDeleteAction:finish');

                        //dashboards data
//                        if (photo.note != "") {
//                            $rootScope.notesCount += 1;
//                        } else {
//                            $rootScope.notesCount -= 1;
//                        }
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deletePhotoById(photo) {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('DELETE FROM photo WHERE id = ?', [photo.id],
                    function(tx, res) {
                        DatabaseService.deletePhoto(photo);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function deletePhotos(photos) {
            photos.forEach(function(photo){
                deletePhotoById(photo);
            });
            $rootScope.$broadcast('success', 'Successful deleted from the album');
            $rootScope.$broadcast('editDeleteAction:finish');
        }

        function selectAllPhotos()  {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM photo', [],
                    function(tx, res) {
                        var array = [];
                        DatabaseService.allPhotos = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            DatabaseService.allPhotos = array;
                        }
                        $rootScope.$broadcast('allPhotos:Loaded', array);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        function selectAllPhotosInAlbum(album_id)  {
            DatabaseService.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM photo WHERE album_id = ?', [album_id],
                    function(tx, res) {
                        var array = [];
                        DatabaseService.albumPhotos = [];

                        if(res.rows && res.rows.length > 0) {
                            for(var i=0; i<res.rows.length; i++){
                                array.push(res.rows.item(i));
                            }
                            DatabaseService.albumPhotos = array;
                        }
                        $rootScope.$broadcast('allPhotosInAlbum:Loaded', array);
                    }, function (err) {
                        $rootScope.$broadcast('error', err);
                    });
            });
        }

        return service;
    }

})();


