(function () {
    'use strict';

    angular.module('photo-details', [])
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)

    PhotoDetailsCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicModal', '$timeout', '$ionicTabsDelegate', 'DatabaseService', 'DatabasePhotoTableService', 'PhotoService'];

    function PhotoDetailsCtrl ($scope, $rootScope, $state, $stateParams, $ionicModal, $timeout, $ionicTabsDelegate, DatabaseService, DatabasePhotoTableService, PhotoService) {

        $scope.photo = {
            name: '',
            url: '',
            note: '',
            location: "",
            dateCreated: ""
        };
        $scope.isPhotoAddedToAlbum = false;
        $scope.isAlbumInEditMode = false;
        $scope.albums = DatabaseService.albums;
        $scope.photo.url = PhotoService._uploadedPhoto.url;

        function init(){

            if ($stateParams.photo) {
                $scope.photo = $stateParams.photo;
                $scope.isAlbumInEditMode = true;
            }

            $ionicModal.fromTemplateUrl('views/photo-uploading/select-album.modal.template.html', function(modal) {
                $scope.createSelectAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        $rootScope.$on('photo:getLocationDone', function() {
            $scope.photo.location = PhotoService._uploadedPhoto.location;
            $scope.photo.dateCreated = PhotoService._uploadedPhoto.dateCreated;
        });

        function resetSelectAlbumModal() {
            for(var i=0; i < $scope.albums.length; i++ ) {
                var album = $scope.albums[i];
                album.isSelected = false;
            }
        };

        function resetAddPhotoToAlbumForm() {

            if($rootScope.isAlbumViewPrevSate) {
                $rootScope.isAlbumViewPrevSate = false;
                if($rootScope.currentAlbum) {
                    delete $rootScope.currentAlbum;
                }
            }
            $ionicTabsDelegate.select(1);
        };

        $scope.openSelectAlbumModal = function() {
            $scope.createSelectAlbumModal.show();
        };

        $scope.closeSelectAlbumModal = function() {
            $scope.createSelectAlbumModal.hide();
            resetSelectAlbumModal();
        };

        $scope.addPhotoToAlbum = function(photo, albums) {
            //add photo from album view
            if($rootScope.isAlbumViewPrevSate) {
                var albumId = $rootScope.currentAlbum.id;

                DatabasePhotoTableService.insertPhoto(albumId, photo);

                $timeout(function(){
                    resetAddPhotoToAlbumForm();
                }, 1000);

                //TODO: try with one interval
                $timeout(function(){
                    $state.go('tab.album', { albumId: albumId });
                }, 1001);

                return;
            }

            albums.map(function(album){
                if(album.isSelected == true) {
                    DatabasePhotoTableService.insertPhoto(album.id, photo);
                }
            });

            $scope.isPhotoAddedToAlbum = true;
            $timeout(function(){
                $scope.isPhotoAddedToAlbum = false;
                $scope.closeSelectAlbumModal();
                $state.go('tab.photo');
            }, 1000);
        };

        $scope.cancelAddingPhotoToAlbum = function() {
            if($rootScope.isAlbumViewPrevSate) {
                $rootScope.isAlbumViewPrevSate = false;
                if($rootScope.currentAlbum) {
                    delete $rootScope.currentAlbum;
                }
            }
            $state.go('tab.photo');
        }

        $scope.editPhoto = function(photo) {
            DatabasePhotoTableService.updatePhoto(photo);

            $timeout(function(){
                resetAddPhotoToAlbumForm();
            }, 1000);

            $timeout(function(){
                $state.go('tab.album', { albumId: photo.album_id });
                $scope.isAlbumInEditMode = false;
            }, 1001);
        }

        init();
    }

})();
