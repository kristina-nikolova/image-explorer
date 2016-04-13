(function () {
    'use strict';

    angular.module('albums')
        .factory('AlbumsService', AlbumsService)

    AlbumsService.$inject = ['$rootScope'];

    function AlbumsService ($rootScope) {

        var service = {};

        return service;
    }

})();