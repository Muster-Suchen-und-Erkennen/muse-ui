/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * FilmCtrl
 */
angular.module('MUSE').controller('FilmCtrl', ['$scope', '$timeout', 'dbREST', '$routeParams', '$route', '$log', 'ValidationService', 'ValidationFunctions', 'EntityFactory', function ($scope, $timeout, dbREST, $routeParams, $route, $log, ValidationService, ValidationFunctions, EntityFactory) {

    $scope.fadeIn = true;
    $scope.fadeOut = false;
    $scope.film = EntityFactory.getNewFilmInstance();
    $scope.genresTree = dbREST.selectables.genres;
    $scope.loadingScreenshots = true;
    $scope.roles = [];
    $scope.routeParams = $routeParams;
    $scope.savedProperly = false;
    $scope.selectables = dbREST.selectables;
    $scope.selectedRole = EntityFactory.getNewRoleInstance();
    $scope.treeselectselection = [];
    $scope.uploading = false;



    $scope.showSelected= function(node){
        $log.debug(JSON.stringify(node));
    };


    $scope.filmValidator = ValidationService.getNewInstance();
    function prepareFilmValidation(validator){
        validator.addValidationConstraint($scope, 'film.Filmtitel', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'film.Originaltitel', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'film.Erscheinungsjahr', ValidationFunctions.isPositiveValue);
        validator.addValidationConstraint($scope, 'film.Dauer', ValidationFunctions.isPositiveValue);
        validator.addValidationConstraint($scope, 'film.Stil', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'film.Genres', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'film.Produktionsorte', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'film.Farbkonzepte', ValidationFunctions.ArrayLengthGTZero);
    }
    prepareFilmValidation($scope.filmValidator);

    $scope.roleValidator = ValidationService.getNewInstance();
    function prepareRoleValidation(validator){
        validator.addValidationConstraint($scope, 'selectedRole.Geschlecht', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedRole.DominanterAlterseindruck', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedRole.DominanteCharaktereigenschaften', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedRole.Familienstaende', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedRole.Rollenrelevanz', ValidationFunctions.StringNotEmpty);
    }
    prepareRoleValidation($scope.roleValidator);

    $scope.deleteRole = function (roleId) {
        $scope.states.loading = true;
        dbREST.Rollen.delete({filmId: $scope.film.FilmID, rollenId: roleId}, function (successResult) {
            $log.debug('ROLE DELETED SUCCESSFULLY');
            $log.debug(JSON.stringify(successResult));
            for (var i = 0; i < $scope.roles.length; i++) {
                if ($scope.roles[i].RollenID === roleId) {
                    $scope.roles.splice(i, 1);
                }
            }
            $scope.states.loading = false;
        }, function (errResult) {
            $log.debug('FAILURE AT DELETING ROLE');
            $log.debug(JSON.stringify(errResult));
            $scope.states.loading = false;
        });
    };
    $scope.showCreateRoleModal = function () {
        $scope.initSelectedRole();
    };
    $scope.showRoleDetailsModal = function (role) {
        $scope.setSelectedRole(role);
    };
    $scope.showRoleDeleteModal = function (role){
        $scope.setSelectedRole(role);
    };
    $scope.setSelectedRole = function (role) {
        $scope.selectedRole = role;
    };
    $scope.createFilm = function () {
        $scope.states.loading = true;
        dbREST.Filme.save({}, $scope.film, function (value) {
            $log.debug('FILM SUCCESSFULLY CREATED');
            $log.debug(JSON.stringify(value));
            $scope.film = value;
            $scope.savedProperly = true;
            $scope.states.loading = false;
            $timeout(function () {
                $scope.savedProperly = false;
            }, 5000);
        }, function (httpResponse) {
            $log.debug('FAILURE AT CREATING FILM');
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };
    $scope.updateFilm = function () {
        $scope.states.loading = true;
        dbREST.Filme.update({filmId: $scope.film.FilmID}, $scope.film, function (value) {
            $log.debug('FILM UPDATE SUCCESSFULL');
            $log.debug(JSON.stringify(value));
            $scope.savedProperly = true;
            $scope.states.loading = false;
            $timeout(function () {
                $scope.savedProperly = false;
            }, 5000);
        }, function (httpResponse) {
            $scope.savedProperly = false;
            $scope.states.loading = false;
            $log.debug('FAILURE AT UPDATING FILM');
            $log.debug(JSON.stringify(httpResponse));
        });
    };
    $scope.createRole = function (){
        $scope.states.loading = true;
        $scope.selectedRole.FilmID = $scope.film.FilmID;
        dbREST.Rollen.save({filmId: $scope.selectedRole.FilmID}, $scope.selectedRole, function (value) {
            $log.debug('ROLE SUCCESSFULLY CREATED');
            $log.debug(JSON.stringify(value));
            $scope.roles.push(value);
            $scope.initSelectedRole();
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug('FAILURE AT CREATING ROLE');
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };
    $scope.updateSelectedRole = function () {
        $scope.states.loading = true;
        dbREST.Rollen.update({filmId: $scope.selectedRole.FilmID, rollenId: $scope.selectedRole.RollenID}, $scope.selectedRole, function (value, respondeHeader) {
            $log.debug('ROLE UPDATE SUCCESSFULL');
            $log.debug(JSON.stringify(value));
            $scope.states.loading = false;
            $scope.initSelectedRole();
        }, function (httpResponse) {
            $log.debug('FAILURE AT UPDATING ROLE');
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };
    $scope.reloadPage = function () {
        $route.reload();
    };
    $scope.clearAll = function () {
        $scope.film = EntityFactory.getNewFilmInstance();
        $scope.savedProperly = false;
        $timeout(function () {
            $scope.readyToAnimate = true;
        }, 2000);

    };

    $scope.testVar = true;
    $scope.initSelectedRole = function () {
        $scope.selectedRole = EntityFactory.getNewRoleInstance();
    };
    $scope.init = function () {
        $scope.clearAll();
        if ($routeParams.filmId === 'new') {
            $scope.film.FilmID = 'new';
        } else {
            dbREST.Filme.get({filmId: $routeParams.filmId}, function (value) {
                $scope.film = value;
            }, function(responseHeader){
                $log.debug('FAILURE AT LOADING FILM');
                $log.debug(JSON.stringify(responseHeader));
            });
            $scope.roles = dbREST.Rollen.query({filmId: $routeParams.filmId});
        }
    };
    $scope.init();
}]);

