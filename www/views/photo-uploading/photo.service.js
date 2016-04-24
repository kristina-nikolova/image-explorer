(function () {
    'use strict';

    angular.module('photo')
        .factory('PhotoService', PhotoService)

    PhotoService.$inject = ['$rootScope', 'CameraService', 'Location', '$state', '$cordovaGeolocation'];

    function PhotoService ($rootScope, CameraService, Location, $state, $cordovaGeolocation) {

        var service = {};

        service._uploadedPhoto = {
            url: "",
            location: "",
            dateCreated: "",
            long: "",
            lat: ""
        };
        service.getUploadedPhoto = getUploadedPhoto;

        function getUploadedPhoto(fromPhotolibrary) {
            CameraService.getPhoto(fromPhotolibrary).then(function(imageURI) {
                //fix the url when choose photo from the photo library
//                if (imageURI.substring(0,21)=="content://com.android") {
//                    var photo_split = imageURI.split("%3A");
//                    imageURI="content://media/external/images/media/" + photo_split[1];
//                }
                service._uploadedPhoto.url = imageURI;

                getPhotoInfo(fromPhotolibrary, imageURI);

                $state.go('app.photo-details');
            }, function(err) {
                console.log(err);
            });
        }

        function getPhotoInfo(fromPhotolibrary, imageURI) {
            window.resolveLocalFileSystemURL(imageURI,
                function (entry) {
                    entry.file(function (file) {
                        EXIF.getData(file, function () {
                            var datetime = EXIF.getTag(this, "DateTime");
                            service._uploadedPhoto.dateCreated = datetime;

                            if(fromPhotolibrary) {
                                var long = EXIF.getTag(this, "GPSLongitude");
                                var lat = EXIF.getTag(this, "GPSLatitude");
                                if (!long || !lat) {
                                    hasNoLocation();
                                    return;
                                }
                                long = convertDegToDec(long);
                                lat = convertDegToDec(lat);
                                //handle W/S
                                if (EXIF.getTag(this, "GPSLongitudeRef") === "W") long = -1 * long;
                                if (EXIF.getTag(this, "GPSLatitudeRef") === "S") lat = -1 * lat;
                                service._uploadedPhoto.long = long;
                                service._uploadedPhoto.lat = lat;
                                locateAddress(long, lat);
                            } else {
                                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                                $cordovaGeolocation
                                    .getCurrentPosition(posOptions)
                                    .then(function (position) {
                                        var lat  = position.coords.latitude;
                                        var long = position.coords.longitude;

                                        if (!long || !lat) {
                                            hasNoLocation();
                                            return;
                                        }

                                        service._uploadedPhoto.long = long
                                        service._uploadedPhoto.lat = lat;
                                        locateAddress(long, lat);
                                    }, function(err) {
                                        //when gps is turned off
                                        hasNoLocation();
                                        console.log(err);
                                    });
                            }
                        });
                    });
                },
                function (err) {
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

        var hasNoLocation = function() {
            service._uploadedPhoto.location = 'No location info';
            service._uploadedPhoto.long = ""
            service._uploadedPhoto.lat = "";
            $rootScope.$broadcast('photo:getLocationDone');
        };

        return service;
    }

})();
