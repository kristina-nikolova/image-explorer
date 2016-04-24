(function () {
    'use strict';

    angular.module('albums', [])
        .controller('AlbumsCtrl', AlbumsCtrl)

    AlbumsCtrl.$inject = ['$scope', '$state', '$timeout', '$ionicModal', 'DatabaseService', 'DatabaseAlbumTableService'];

    function AlbumsCtrl ($scope, $state, $timeout, $ionicModal, DatabaseService, DatabaseAlbumTableService) {

        var selectedAlbums = [];
        $scope.isAlbumCreated = false;
        $scope.isAlbumInDeleteMode = false;
        $scope.isAlbumInEditMode = false;
        $scope.newAlbum = {
            name: "",
            description: ""
        }
        $scope.albums = DatabaseService.albums;

        function init() {
            $ionicModal.fromTemplateUrl('views/albums/create-album.modal.template.html', function(modal) {
                $scope.createEditAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        $scope.$on('editMode:exit', function () {
            selectedAlbums = [];
            $scope.albums.forEach(function(album){
                album.isSelected = false;
            });
        });

        function resetCreateEditAlbumModal() {
            $scope.newAlbum = {
                name: "",
                description: ""
            }
        };

        $scope.onItemClicked = function(album, isAlbumInEditMode, isAlbumInDeleteMode) {
            if(isAlbumInEditMode) {
                $scope.openCreateEditAlbumModal(album);
            } else if(isAlbumInDeleteMode) {
                selectAlbum(album);
            } else {
                openAlbum(album);
            }
        }

        $scope.openCreateEditAlbumModal = function(album) {
            if(album) {
                $scope.album = album;
                $scope.isAlbumInEditMode = true;
            } else {
                $scope.isAlbumInEditMode = false;
            }

            $scope.createEditAlbumModal.show();
        };

        $scope.closeCreateEditAlbumModal = function() {
            $scope.createEditAlbumModal.hide();
            resetCreateEditAlbumModal();

            $timeout(function(){
                $scope.isAlbumInEditMode = false;
            }, 100);
        };

        $scope.createAlbum = function(newAlbum) {
            DatabaseAlbumTableService.insertAlbum(newAlbum);

            $timeout(function(){
                $scope.closeCreateEditAlbumModal();
            }, 1000);
        };

        $scope.editAlbum = function(album) {
            DatabaseAlbumTableService.updateAlbum(album);

            $timeout(function(){
                $scope.closeCreateEditAlbumModal();
            }, 1000);
        };

        $scope.deleteAlbums  = function() {
            if(selectedAlbums.length) {
                DatabaseAlbumTableService.deleteAlbums(selectedAlbums);
                return;
            }
        };

        function selectAlbum(album) {
            if(!album.isSelected) {
                selectedAlbums.push(album);
                album.isSelected = true;
            } else {
                album.isSelected = false;
                selectedAlbums.splice(selectedAlbums.indexOf(album), 1);
            }
        };

        function openAlbum(album) {
            $state.go('app.album', { albumId: album.id });
        }

        init();
    }

})();