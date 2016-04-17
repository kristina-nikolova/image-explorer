(function () {
    'use strict';

    angular.module('photo-details', [])
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)

    PhotoDetailsCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicModal', '$timeout', '$ionicTabsDelegate', 'DatabaseService', 'DatabasePhotoTableService', 'PhotoService'];

    function PhotoDetailsCtrl ($scope, $rootScope, $state, $stateParams, $ionicModal, $timeout, $ionicTabsDelegate, DatabaseService, DatabasePhotoTableService, PhotoService) {

        $scope.file = {
            name: '',
            url: '',
            note: '',
            location: "",
            dateCreated: ""
        };
        $scope.isPhotoAddedToAlbum = false;
        $scope.isAlbumInEditMode = false;
        $scope.albums = DatabaseService.albums;
        $scope.file.url = PhotoService._uploadedPhoto.url;

        function init(){

            if ($stateParams.file) {
                $scope.file = $stateParams.file;
                $scope.isAlbumInEditMode = true;
            }

            $ionicModal.fromTemplateUrl('views/photo-uploading/select-album.modal.template.html', function(modal) {
                $scope.createSelectAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        //TODO: check if we have location/date when get photo from the camera

        $rootScope.$on('photo:getLocationDone', function() {
            $scope.file.location = PhotoService._uploadedPhoto.location;
            $scope.file.dateCreated = PhotoService._uploadedPhoto.dateCreated;
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

        $scope.addPhotoToAlbum = function(file, albums) {
            //add file from album view
            if($rootScope.isAlbumViewPrevSate) {
                var albumId = $rootScope.currentAlbum.id;

                DatabasePhotoTableService.insertFile(albumId, file);

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
                    DatabasePhotoTableService.insertFile(album.id, file);
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

        $scope.editPhoto = function(file) {
            DatabasePhotoTableService.updateFile(file);

            $timeout(function(){
                resetAddPhotoToAlbumForm();
            }, 1000);

            $timeout(function(){
                $state.go('tab.album', { albumId: file.album_id });
                $scope.isAlbumInEditMode = false;
            }, 1001);
        }

        init();
    }

})();
