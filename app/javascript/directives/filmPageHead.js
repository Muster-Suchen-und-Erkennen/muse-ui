/**
 * Created by michaelfalkenthal on 03.01.14.
 */
'use strict';
angular.module('MUSE').directive('myFilmPageHead', function () {
    return {
        restrict: 'EA',
        scope: {
            film: '=film'

        },
        templateUrl: 'templates/directives/filmpagehead.html'
    };
});