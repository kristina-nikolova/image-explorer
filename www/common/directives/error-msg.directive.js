(function () {
    'use strict';

    angular.module('directives')
    .directive("errorMsg", function() {
        return {
            restrict : 'E',
            template : '<div class="error-msg center animated fadeInDown">{{message}}</div>',
            scope: {
                message: '='
            }
        };
    });

})();