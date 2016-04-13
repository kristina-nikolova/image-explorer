(function () {
    'use strict';

    angular.module('albums', [])
        .controller('AlbumsCtrl', AlbumsCtrl)

    AlbumsCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$ionicModal', 'DatabaseService'];

    function AlbumsCtrl ($rootScope, $scope, $timeout, $ionicModal, DatabaseService) {

        $scope.isAlbumCreated = false;
        $scope.editModeOn = false;
        $scope.newAlbum = {
            name: "",
            description: ""
        }

        function init() {
            $scope.albums = DatabaseService.albums;

            $ionicModal.fromTemplateUrl('views/albums/create-album.modal.template.html', function(modal) {
                $scope.createAlbumModal = modal;
            }, {
                scope: $scope
            });
        }

        //TODO: use in one place for edit album/photo!
        $rootScope.$on('state:changed', function(){
            if($scope.editModeOn) {
                $scope.exitFromEditMode();
            }
        });

        //TODO: update the scope not with broadcasted event!
        $scope.$on('albums:Updated', function (event, data) {
            $scope.albums = data;
            $scope.$applyAsync();
        });

        function resetCreateAlbumModal() {
            $scope.newAlbum = {
                name: "",
                description: ""
            }
        };

        $scope.openCreateAlbumModal = function() {
            $scope.createAlbumModal.show();
        };

        $scope.closeCreateAlbumModal = function() {
            $scope.createAlbumModal.hide();
            resetCreateAlbumModal();
        };

        $scope.createAlbum = function(newAlbum) {
            DatabaseService.insertAlbum(newAlbum);

            $timeout(function(){
                $scope.closeCreateAlbumModal();
            }, 1000);
        };

        $scope.deleteAlbum = function(album) {
            DatabaseService.deleteAlbumById(album);
        };

        $scope.enterInEditMode = function(){
            $scope.editModeOn = true;
        }

        $scope.exitFromEditMode = function(){
            $scope.editModeOn = false;
        }

        init();
    }

})();