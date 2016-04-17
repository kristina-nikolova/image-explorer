(function () {
    'use strict';

    angular.module('photo')
        .factory('PhotoService', PhotoService)

    PhotoService.$inject = ['$rootScope', 'CameraService', 'Location', '$state'];

    function PhotoService ($rootScope, CameraService, Location, $state) {

        var service = {};

        service._uploadedPhoto = {
            url: "",
            location: "",
            dateCreated: ""
        };
        service.getUploadedPhoto = getUploadedPhoto;

        function getUploadedPhoto(fromPhotolibrary) {
            CameraService.getPhoto(fromPhotolibrary).then(function(imageURI) {
                service._uploadedPhoto.url = imageURI;

                getPhotoInfo(imageURI);

                $state.go('tab.photo-details');
            }, function(err) {
                console.log(err);
            });
        }

        function getPhotoInfo(imageURI) {
            window.resolveLocalFileSystemURL(imageURI,
                function(entry) {
                    entry.file(function(file) {
                        EXIF.getData(file, function() {
                            var datetime = EXIF.getTag(this, "DateTime");
                            service._uploadedPhoto.dateCreated = datetime;

                            var long = EXIF.getTag(this,"GPSLongitude");
                            var lat = EXIF.getTag(this,"GPSLatitude");
                            if(!long || !lat) {
                                service._uploadedPhoto.location = 'No location info';
                                $rootScope.$broadcast('photo:getLocationDone');
                                return;
                            }
                            long = convertDegToDec(long);
                            lat = convertDegToDec(lat);
                            //handle W/S
                            if(EXIF.getTag(this,"GPSLongitudeRef") === "W") long = -1 * long;
                            if(EXIF.getTag(this,"GPSLatitudeRef") === "S") lat = -1 * lat;
                            locateAddress(long,lat);
                        });
                    });
                },
                function(err) {
                    console.log(err);
                });
        }

        //utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
        var convertDegToDec = function(arr) {
            return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
        };

        var locateAddress = function(long,lat) {

            Location.getInfo(long, lat).then(function(result) {
                if (result.type === 'geocode') {
                    service._uploadedPhoto.location = result.address;
                } else {
                    service._uploadedPhoto.location = 'No location info';
                }
                $rootScope.$broadcast('photo:getLocationDone');
            });
        };

        return service;
    }

})();
