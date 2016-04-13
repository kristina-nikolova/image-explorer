(function () {
    'use strict';

    angular.module('camera', [])
    .factory('CameraService', CameraService)

    CameraService.$inject = ['$q'];

    function CameraService ($q) {

        var service = {};

        service.getPhoto = getPhoto;

        function getPhoto (fromPhotolibrary) {
            var q = $q.defer();
            var options = {
                quality: 75,
                sourceType: fromPhotolibrary ? navigator.camera.PictureSourceType.PHOTOLIBRARY : navigator.camera.PictureSourceType.CAMERA,
                encodingType: navigator.camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300
               // destinationType: navigator.camera.DestinationType.NATIVE_URI
            };

            navigator.camera.getPicture(
                function(result) {
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

            return q.promise;
        }

        return service;
    }

})();

