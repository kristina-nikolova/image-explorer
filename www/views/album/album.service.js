(function () {
    'use strict';

    angular.module('album')
        .factory('AlbumService', AlbumService)

    AlbumService.$inject = ['$rootScope'];

    function AlbumService ($rootScope) {

        var service = {};

        return service;
    }

})();