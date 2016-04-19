(function () {
    'use strict';

    angular.module('directives')
    .directive("errorMsg", function() {
        return {
            restrict : 'E',
            template : '<div class="error-msg center">{{message}}</div>',
            scope: {
                message: '='
            }
        };
    });

})();