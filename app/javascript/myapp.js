/**
 * Created by michaelfalkenthal on 02.12.13.

'use strict';


/**
 * Module Definition: MUSE
 */
angular.module('MUSE', ['ngResource', 'ui.bootstrap', 'ngRoute', 'angularFileUpload', 'ui.utils', 'pascalprecht.translate', 'angular-loading-bar', 'ui.select', 'ngSanitize', 'angular-confirm']);
angular.module('MUSE')
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/filmuebersicht', {
                    templateUrl: 'templates/filmoverview.html'
                }).
                when('/filme/:filmId', {
                    templateUrl: 'templates/film.html'
                }).
                when('/genreuebersicht', {
                    templateUrl: 'templates/genreoverview.html',
                    reloadOnSearch: false
                }).
                when('/analysis', {
                    templateUrl: 'templates/analysis.html',
                    reloadOnSearch: false
                }).
                when('/filme/:filmId/rollen/:rollenId', {
                    templateUrl: 'templates/film.html'
                }).
                when('/filme/:filmId/rollen/:rollenId/kostueme', {
                    templateUrl: 'templates/rolecostumeoverview.html'
                }).
                when('/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId', {
                    templateUrl: 'templates/costume.html'
                }).
                when('/test', {
                    templateUrl: 'templates/test.html'
                }).
                when('/search', {
                    templateUrl: 'templates/search.html'
                }).
                when('/taxonomies', {
                    templateUrl: 'templates/taxonomyEditing.html'
                }).
                when('/login', {
                    templateUrl: 'templates/login.html'
                }).
                                otherwise({
                    redirectTo: '/filmuebersicht'
                });
        }])
    // Add an Interceptor to add a user token for every backend request
    .config(['$httpProvider',function($httpProvider) {
        'use strict';
        $httpProvider.interceptors.push('AuthInterceptor')
    }])
    // Global status error mechanism. Catches http-status errors and redirects or shows error to user
    .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q,$location, $rootScope) {
        return {
            'responseError': function(rejection){
                var defer = $q.defer();
                // Redirect to Login page
                if(rejection.status == 401){

                    $location.path('/login');
                }
                // If an other error above 400 happened, safe the error message in $rootScope.
                // IndexCtrl.js handles the error and shows a error modal
                if(rejection.status == 400 || rejection.status >= 402){
                    $rootScope.states.error = true;
                    $rootScope.states.errorMessage = rejection.data;
                }
                defer.reject(rejection);
                return defer.promise;
            }
        };
    });
}])

    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 0;
    }])

    .config(['$resourceProvider', function($resourceProvider) {
        $resourceProvider.cache = true;
    }])

    .run(['$rootScope', '$translate', '$location','$log','$anchorScroll', function ($rootScope, $translate, $location, $log, $anchorScroll) {
        $anchorScroll.yOffset = 100;


        $rootScope.gotoAnchor = function(id) {
            if ($location.hash() !== id) {
                $location.hash(id);
            } else {
                $anchorScroll();
            }
        };

        $rootScope.states = {
            loading: false,
            error: false,
            errorMessage: "",
            showingTreeView: true,
            language: 'de'
        };
        $rootScope.changeLanguage = function(lang){
            $translate.use(lang);
            $rootScope.states.language = lang;
        };

        // enhanced logging mechanism to show time etc.
        $log.getInstance = function(context) {
            return {
                log   : enhanceLogging($log.log, context),
                info  : enhanceLogging($log.info, context),
                warn  : enhanceLogging($log.warn, context),
                debug : enhanceLogging($log.debug, context),
                error : enhanceLogging($log.error, context)
            };
        };

        /**
         * Extend logging mechanism with timestamp. Method uses moment package
         * @param loggingFunc
         * @param context
         * @returns {Function}
         */
        function enhanceLogging(loggingFunc, context) {
            return function() {
                var modifiedArguments = [].slice.call(arguments);
                modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
                loggingFunc.apply(null, modifiedArguments);
            }}

            //var serverPort = $location.port();
        var serverPort = 3000;
        $rootScope.backend = {

            restBackendAddress: $location.protocol() + '://' + $location.host() + ':' + serverPort
        };

        $rootScope.user;
    }]);
