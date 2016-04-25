(function () {
    'use strict';

    angular.module('directives')
    .directive("clickOutside",['$document', function($document) {
            return {
                link: function postLink(scope, element, attrs) {
                    var onClick = function (event) {
                        var isChild = element[0].contains(event.target);
                        var isSelf = element[0] == event.target;
                        var isInside = isChild || isSelf;
                        var isSpecialElements = event.target.id == "not-close-on-click";
                        if (!isInside && !isSpecialElements) {
                            scope.$apply(attrs.clickOutside)
                        }
                    }
                    $document.bind('click', onClick);
                }
            };
    }]);

})();