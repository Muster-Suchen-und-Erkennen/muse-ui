/**
 * Created by michaelfalkenthal on 23.09.14.
 */
'use strict';

angular.module('MUSE').directive('imageViewer', ['$log', 'dbREST', '$timeout', '$http', '$templateCache', '$q', 'bsImageViewerDialog', '$upload', '$rootScope', function ($log, dbREST, $timeout, $http, $templateCache, $q, bsImageViewerDialog, $upload, $rootScope) {
    return{
        restrict: 'EA',
        scope: {
            screenshotServiceName: '@',
            thumbServiceName: '@',
            queryParams: '='
        },
        templateUrl: 'templates/directives/imageViewer.html',
        link: function ( scope, element, attrs ) {
            scope.backend = $rootScope.backend;
            scope.screenshots = [];
            scope.imageViewerOpened = false;
            scope.screenshotIndex = 0;

            scope.screenshots = dbREST[scope.thumbServiceName].query(scope.queryParams, function(){
                scope.loadingScreenshots = false;
            }, function(err){
                $log.debug('SOMETHING WENT WRONG AT LOADING IMAGES: ' + JSON.stringify(err));
            });

            scope.openImageViewer = function(){
                prepareLargeImage();
                bsImageViewerDialog(
                    {
                        scope: scope
                    }
                );
                scope.imageViewerOpened = true;
            };

            function prepareLargeImage(){
                if(scope.screenshots[scope.screenshotIndex].Screenshot === null || scope.screenshots[scope.screenshotIndex].Screenshot === ''){
                    scope.screenshots[scope.screenshotIndex].Screenshot = scope.screenshots[scope.screenshotIndex].ScreenshotThumb;
                    //now load the big screenshot
                    scope.loadingLargeImage = true;
                    var qryObj = JSON.parse( JSON.stringify( scope.queryParams ) );
                    qryObj.screenshotId = scope.screenshots[scope.screenshotIndex].ScreenshotID.toString();
                    dbREST[scope.screenshotServiceName].get(qryObj, function (value) {
                        scope.loadingLargeImage = false;
                        scope.screenshots[scope.screenshotIndex].Screenshot = value.Screenshot;
                    }, function(responseHeader){
                        $log.debug('FAILURE AT LOADING IMAGES');
                        $log.debug('USING THUMBNAIL DATA');
                        $log.debug(JSON.stringify(responseHeader));
                    });
                }
            }

            scope.deleteSelectedScreenshot = function(){
                if(scope.screenshots[scope.screenshotIndex]){
                    var routeParams = angular.copy(scope.queryParams);
                    routeParams.screenshotId = scope.screenshots[scope.screenshotIndex].ScreenshotID;
                    var restEndPoint = {};
                    if(routeParams.kostuemId){
                        restEndPoint = dbREST.KostuemScreenshots;
                    }else if(routeParams.rollenId){
                        restEndPoint = dbREST.RollenScreenshots;
                    }else{
                        restEndPoint = dbREST.FilmScreenshots;
                    }

                    restEndPoint.delete(routeParams, function(successResult) {
                        scope.screenshots.splice(scope.screenshotIndex, 1);
                        if(scope.screenshots.length > 0){
                            scope.screenshotIndex--;
                        }else{
                            scope.screenshotIndex = 0;
                        }
                    }, function (errResult) {
                        $log.debug(JSON.stringify(errResult));
                    });
                }
            };

            scope.nextScreenshot = function(){
                if(scope.screenshotIndex < scope.screenshots.length - 1){
                    scope.screenshotIndex = scope.screenshotIndex + 1;
                    if(scope.imageViewerOpened){
                        prepareLargeImage();
                    }
                }
            };

            scope.prevScreenshot = function(){
                if(scope.screenshotIndex > 0){
                    scope.screenshotIndex = scope.screenshotIndex - 1;
                    if(scope.imageViewerOpened){
                        prepareLargeImage();
                    }
                }
            };

            /**
             * Photo Upload
             */
            scope.onFileSelect = function($files) {
                //$files: an array of files selected, each file has name, size, and type.
                var backend = scope.backend.restBackendAddress + '/filme/' + scope.queryParams.filmId;
                if(scope.queryParams.rollenId){
                    backend = backend + '/rollen/' + scope.queryParams.rollenId;
                }
                if(scope.queryParams.kostuemId){
                    backend = backend + '/kostueme/' + scope.queryParams.kostuemId;
                }
                backend = backend + '/screenshots';
                //var backend = scope.backend.restBackendAddress + '/filme/' + scope.routeParams.filmId + '/screenshots';
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'){
                        scope.uploading = true;
                        $log.debug(JSON.stringify(file));
                        scope.upload = $upload.upload({
                            url: backend,
                            method: 'POST',
                            // headers: {'headerKey': 'headerValue'},
                            // withCredential: true,
                            //data: {myObj: scope.myModelObj},
                            file: file,
                            // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                            /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                            fileFormDataName: 'screenshot' //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                            /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                            //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                        }).progress(function(evt) {
                            scope.max = evt.total;
                            scope.uploadProgress = evt.loaded;
                        }).success(function(data, status, headers, config) {
                            // file is uploaded successfully
                            console.log(JSON.stringify(file));
                            console.log(JSON.stringify(data));
                            if(status === 201){
                                scope.screenshots.push(data);
                                scope.screenshotIndex = scope.screenshots.length - 1;
                            }
                            resetUpload();
                        });
                        //.error(...)
                        //.then(success, error, progress);
                    }else{
                        //TODO Raise error message
                        $log.debug('FILE FORMAT NOT SUPPORTED FOR SCREENSHOTS. JUST USE JPEG, PNG OR GIF.');
                    }
                }
            };

            scope.abortUpload = function(){
                scope.upload.abort();
                resetUpload();
            };

            function resetUpload(){
                scope.uploading = false;
                scope.uploadProgress = 0;
                scope.max = 0;
            }

            scope.uploadProgress = 0;
            scope.max = 0;

        }
    };
}]);