(function () {
    'use strict';

    angular.module('database')
    .factory('DatabasePhotoTableService', DatabasePhotoTableService)

    DatabasePhotoTableService.$inject = ['$rootScope', 'DatabaseService'];

    function DatabasePhotoTableService ($rootScope, DatabaseService) {

        var service = {};

        service.insertPhoto = insertPhoto;
        service.updatePhoto = updatePhoto;
        service.deletePhotos = deletePhotos;
        service.selectAllPhotos = selectAllPhotos;
        service.selectAllPhotosInAlbum = selectAllPhotosInAlbum;

        function insertPhoto(album_id, photo) {

            DatabaseService.pouchdb.post({
                type: 'photo',
                album_id: album_id,
                name: photo.name,
                url: photo.url,
                note: photo.note,
                location: photo.location,
                dateCreated: photo.dateCreated,
                long: photo.long,
                lat: photo.lat
            }).then(function (res) {
                photo.album_id = album_id;
                photo.id = res.id;
                photo.rev = res.rev;
                DatabaseService.albumPhotos.push(photo);
                DatabaseService.allPhotos.push(photo);
                $rootScope.$broadcast('success', 'Successful added to the album');

                //dashboards data
                $rootScope.allPhotosCount += 1;
                if (photo.note != "") {
                    $rootScope.notesCount += 1;
                }
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function updatePhoto(photo) {
            DatabaseService.pouchdb.get(photo.id).then(function (res) {
                res.name = photo.name;
                res.note = photo.note;
                DatabaseService.pouchdb.put(res);

                $rootScope.$broadcast('success', 'Successful updated photo');
                $rootScope.$broadcast('editDeleteAction:finish');
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function deletePhotoById(photo) {
            DatabaseService.pouchdb.remove(photo.id, photo.rev).then(function (res) {
                DatabaseService.deletePhoto(photo);
            }).catch(function(err){
                $rootScope.$broadcast('error', err);
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
            DatabaseService.pouchdb.query(DatabaseService.mapTypeFunction, {
                key : 'photo'
            }).then(function (res) {
                var array = [];
                DatabaseService.allPhotos = [];

                if(res.rows && res.rows.length > 0) {
                    for(var i=0; i<res.rows.length; i++){
                        DatabaseService.pouchdb.get(res.rows[i].id).then(function (doc) {
                            doc.id = doc._id;
                            array.push(doc);

                            DatabaseService.allPhotos = array;
                            $rootScope.$broadcast('allPhotos:Loaded', array);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                } else {
                    $rootScope.$broadcast('allPhotos:Loaded', array);
                }
            }).catch(function(err) {
                $rootScope.$broadcast('error', err);
            });
        }

        function selectAllPhotosInAlbum(album_id)  {
            DatabaseService.pouchdb.query(DatabaseService.mapAlbumIDFunction, {
                key: album_id
            }).then(function (res) {
                var array = [];
                DatabaseService.albumPhotos = [];

                if(res.rows && res.rows.length > 0) {
                    for(var i=0; i<res.rows.length; i++){
                        DatabaseService.pouchdb.get(res.rows[i].id).then(function (doc) {
                            doc.id = doc._id;
                            doc.rev = doc._rev;
                            array.push(doc);

                            DatabaseService.albumPhotos = array;
                            $rootScope.$broadcast('allPhotosInAlbum:Loaded', array);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                } else {
                    $rootScope.$broadcast('allPhotosInAlbum:Loaded', array);
                }
            }).catch(function (err) {
                $rootScope.$broadcast('error', err);
            });

        }

        return service;
    }

})();


