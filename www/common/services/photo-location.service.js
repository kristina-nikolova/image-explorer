(function () {
    'use strict';

    angular.module('photo-location', [])

        .factory('Geocode', function($http) {
            function getAddress(long,lat) {
                var KEY = 'AIzaSyDO6ALuwCxd8LJY8AgB4XJeGCeJXfsbSJk';

                return $http({
                    method: 'GET',
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ','+long + '&key=' + KEY
                });
            }

            return {
                getAddress: getAddress
            };

        })
        .factory('Location', function($q, Geocode) {

            function getInfo(long,lat) {
                var deferred = $q.defer();

                Geocode.getAddress(long,lat).then(function(result) {
                    if(result.data && result.data.results && result.data.results.length >= 1) {
                        var bestMatch = result.data.results[0];
                        console.log(JSON.stringify(bestMatch));
                        var result = {
                            type:"geocode",
                            address:bestMatch.formatted_address
                        }
                        deferred.resolve(result);
                    }
                });

                return deferred.promise;
            }

            return {
                getInfo:getInfo
            };
        })
})();


