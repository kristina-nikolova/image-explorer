(function () {
    'use strict';

    angular.module('albums', [])
        .controller('AlbumsCtrl', AlbumsCtrl)

    AlbumsCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$ionicModal', 'DatabaseService', 'DatabaseAlbumTableService'];

    function AlbumsCtrl ($rootScope, $scope, $timeout, $ionicModal, DatabaseService, DatabaseAlbumTableService) {

        $scope.isAlbumCreated = false;
        $scope.isAlbumInDeleteMode = false;
        $scope.isAlbumInEditMode = false;
        $scope.newAlbum = {
            name: "",
            description: ""
        }

        function init() {
            $scope.albums = DatabaseService.albums;

            $ionicModal.fromTemplateUrl('views/albums/create-album.modal.template.html', function(modal) {
                $scope.createEditAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        //TODO: use in one place for edit album/photo!
        $rootScope.$on('state:changed', function(){
            if($scope.isAlbumInEditMode || $scope.isAlbumInDeleteMode) {
                $scope.exitFromEditDeleteMode();
            }
        });

        //TODO: update the scope not with broadcasted event!
        $scope.$on('albums:Updated', function () {
            $scope.$applyAsync();
        });

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

        $scope.exitFromEditDeleteMode = function(){
            $scope.isAlbumInDeleteMode = false;
            $scope.isAlbumInEditMode = false;
        }

        init();
    }

})();