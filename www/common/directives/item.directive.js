(function () {
    'use strict';

    angular.module('directives')
    .directive("item", function() {

        return {
            restrict: 'E',
            scope: {
                item: '=',
                items: '=',
                isInEditMode: '=',
                isInDeleteMode: '=',
                onItemClicked: '&'
            },
            templateUrl: "common/directives/item.template.html"
        };
    });

})();