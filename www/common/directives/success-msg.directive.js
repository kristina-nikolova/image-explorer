(function () {
    'use strict';

    angular.module('directives')
    .directive("successMsg", function() {
        return {
            restrict : 'E',
            template : '<div class="success-msg center animated fadeInDown">{{message}}</div>',
            scope: {
                message: '='
            }
        };
    });

})();