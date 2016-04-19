(function () {
    'use strict';

    angular.module('directives')
    .directive("photo", function() {

        return {
            restrict: 'E',
            scope: {
                photo: '=',
                photos: '=',
                isInEditMode: '=',
                isInDeleteMode: '=',
                editPhotoAction: '&',
                deletePhotoAction: '&',
                openPhotoAction: '&'
            },
            templateUrl: "common/directives/photo.template.html"
        };
    });

})();