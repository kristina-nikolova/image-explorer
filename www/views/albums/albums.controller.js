(function () {
    'use strict';

    angular.module('albums', [])
        .controller('AlbumsCtrl', AlbumsCtrl)

    AlbumsCtrl.$inject = ['$scope', '$timeout', '$ionicModal', 'DatabaseService', 'DatabaseAlbumTableService'];

    function AlbumsCtrl ($scope, $timeout, $ionicModal, DatabaseService, DatabaseAlbumTableService) {

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

        function resetCreateEditAlbumModal() {
            $scope.newAlbum = {
                name: "",
                description: ""
            }
        };

        $scope.openCreateEditAlbumModal = function(album) {
            $scope.album = album;
            $scope.createEditAlbumModal.show();
        };

        $scope.closeCreateEditAlbumModal = function() {
            $scope.createEditAlbumModal.hide();
            resetCreateEditAlbumModal();
        };

        $scope.createAlbum = function(newAlbum) {
            DatabaseAlbumTableService.insertAlbum(newAlbum);

            $timeout(function(){
                $scope.closeCreateEditAlbumModal();
            }, 1000);
        };

        $scope.editAlbum = function(album) {
            DatabaseAlbumTableService.updateAlbum(album);
            $scope.isAlbumInEditMode = false;

            $timeout(function(){
                $scope.closeCreateEditAlbumModal();
            }, 1000);
        };

        $scope.deleteAlbum = function(album) {
            DatabaseAlbumTableService.deleteAlbumById(album);
        };

        $scope.enterInEditMode = function(){
            $scope.isAlbumInEditMode = true;
        }

        $scope.enterInDeleteMode = function(){
            $scope.isAlbumInDeleteMode = true;
        }

        $scope.exitFromEditDeleteMode = function() {
            if($scope.isAlbumInEditMode || $scope.isAlbumInDeleteMode) {
                $scope.isAlbumInDeleteMode = false;
                $scope.isAlbumInEditMode = false;
            }
        }

        init();
    }

})();