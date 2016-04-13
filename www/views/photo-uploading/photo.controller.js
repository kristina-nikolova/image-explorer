(function () {
    'use strict';

    angular.module('photo', [])
        .controller('PhotoCtrl', PhotoCtrl)

    PhotoCtrl.$inject = ['$scope', 'PhotoService'];

    function PhotoCtrl ($scope, PhotoService) {
        $scope.takePhoto = function() {
            PhotoService.getUploadedPhoto();
        };

        $scope.choosePhoto = function() {
            PhotoService.getUploadedPhoto(true);
        };

    }

})();
