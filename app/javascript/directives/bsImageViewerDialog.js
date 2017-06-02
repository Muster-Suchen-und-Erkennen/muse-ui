/**
 * Created by michaelfalkenthal on 24.09.14.
 */
'use strict';

angular.module('MUSE')

    .factory('bsImageViewerDialog', ['$rootScope', '$timeout', '$compile', '$http', '$q', '$templateCache', '$log',
        function ($rootScope, $timeout, $compile, $http, $q, $templateCache, $log) {

            var defaultOptions = {
                templateUrl: 'templates/modal/imageViewerModal.html',
                dialogClass: ''
            };

            return function (config) {
                var options = angular.extend({}, defaultOptions, config);

                // Load template, then go ahead in $q's success callback
                $q.when($templateCache.get(options.templateUrl) || $http.get(options.templateUrl, { cache: true }).then(function (response) {
                    return response.data;
                })).then(function onSuccess(template) {
                    var dialog = angular.element(template);
                    var scope = angular.isObject(options.scope) ? options.scope : $rootScope.$new();

                    var close = function () {
                        //dialog.modal('hide');
                        dialog.modal('toggle');
                        scope.imageViewerOpened = false;
                    };

                    /*dialog.on('hide.bs.modal', function (e) {
                        $log.debug('HIDE');

                    });*/

                    /*dialog.on('show.bs.modal', function (e) {
                        $log.debug('SHOW');
                    });*/

                    /*dialog.on('shown.bs.modal', function (e) {
                        $log.debug('SHOWN');
                    });*/

                    dialog.on('hidden.bs.modal', function (e) {
                        //$log.debug('HIDDEN');
                        dialog.remove();
                    });

                    /*dialog.on('loaded.bs.modal', function (e) {
                        $log.debug('LOADED');
                    });*/


                    $(dialog.children('div.modal-dialog')).addClass(options.dialogClass);

                    scope.$close = close;

                    $timeout(function () {
                        $compile(dialog)(scope);
                    });

                    $('body').append(dialog);
                    dialog.modal({ backdrop: 'static', keyboard: true });
                });

            };
        }
    ]);