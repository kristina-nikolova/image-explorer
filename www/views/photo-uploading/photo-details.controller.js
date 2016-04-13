(function () {
    'use strict';

    angular.module('photo-details', [])
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)

    PhotoDetailsCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$timeout', '$ionicTabsDelegate', 'DatabaseService', 'AlbumService', 'PhotoService'];

    function PhotoDetailsCtrl ($scope, $rootScope, $state, $ionicModal, $timeout, $ionicTabsDelegate, DatabaseService, AlbumService, PhotoService) {

        $scope.file = {
            name: '',
            url: '',
            note: '',
            location: "",
            dateCreated: ""
        };
        $scope.isPhotoAddedToAlbum = false;

        function init(){

            $scope.albums = DatabaseService.albums;
            $scope.file.url = PhotoService._uploadedPhoto.url;

            $ionicModal.fromTemplateUrl('views/photo-uploading/select-album.modal.template.html', function(modal) {
                $scope.createSelectAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        $rootScope.$on('photo:getLocationDone', function(){
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

                DatabaseService.insertFile(albumId, file);
                $rootScope.$broadcast('filesInAlbum:Updated', AlbumService.files);

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
                    DatabaseService.insertFile(album.id, file);
                    $rootScope.$broadcast('filesInAlbum:Updated', AlbumService.files);
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

        init();
    }

})();
