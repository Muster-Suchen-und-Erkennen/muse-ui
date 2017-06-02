/**
 * Created by michaelfalkenthal on 08.04.14.
 */

'use strict';

angular.module('MUSE').directive('altersPicker', ['$log', function ($log) {
    return{
        restrict: 'EA',
        scope: {
            treeModel: '=',
            selectableAlterseindruecke: '=',
            selection: '=',
            costumeId: '@',
            roleId: '@',
            filmId: '@',
            validation: '='
        },
        templateUrl: 'templates/directives/altersPicker.html',
        link: function ( scope, element, attrs ) {

            scope.showvalidation = angular.isDefined(attrs.showvalidation);
            scope.addAlterseindruckToCostume = function(tempAlterseindruck, tempAlter){
                tempAlter = tempAlter || '';
                tempAlterseindruck = tempAlterseindruck || '';
                var found = false;
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Alterseindruck === tempAlterseindruck && scope.selection[i].NumAlter === tempAlter){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    scope.selection.push({KostuemID: scope.costumeId, RollenID: scope.roleId, FilmID: scope.filmId, Alterseindruck: tempAlterseindruck, NumAlter: tempAlter});
                    scope.selection = angular.copy(scope.selection);
                }
            };

            scope.deleteAlterseindruckFromCostume = function(a){
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Alterseindruck === a.Alterseindruck && scope.selection[i].NumAlter === a.NumAlter){
                        scope.selection.splice(i,1);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };

        }
    };
}]);