/**
 * Created by michaelfalkenthal on 19.02.14.
 */
'use strict';

angular.module('MUSE')
    .directive('myAlert', ['$timeout', function ($timeout) {
        return{
            restrict: 'EA',
            template: '\
                <div class="alert" ng-class="css">\
                    <button ng-show="closeable" type="button" class="close" ng-click="close()">&times;</button>\
                    <div ng-transclude></div>\
                </div>',
            transclude: true,
            replace: true,
            scope: {
                type: '=',
                close: '&',
                autoCloseDelay: '=',
                autoClose: '&'
            },
            link: function (scope, element, attrs) {
                if (scope.autoClose) {
                    var delay = 5000;
                    if (scope.autoCloseDelay) {
                        delay = scope.autoCloseDelay;
                    }
                    $timeout(function () {
                        scope.autoClose();
                    }, delay);
                }
                scope.closeable = 'close' in attrs;
                if (angular.isDefined(scope.type)) {
                    scope.css = 'alert-' + scope.type;
                } else {
                    scope.css = 'alert-info';
                }
                if (scope.closeable) {
                    scope.css += ' alert-dismissable';
                }
            }
        };
    }]);