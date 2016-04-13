(function () {
    'use strict';

    angular.module('directives')
    .directive("successMsg", function() {
        return {
            restrict : 'E',
            template : '<div class="success-msg center">{{message}}</div>',
            scope: {
                message: '='
            }
        };
    });

})();