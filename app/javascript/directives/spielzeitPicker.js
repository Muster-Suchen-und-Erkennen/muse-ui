/**
 * Created by michaelfalkenthal on 08.04.14.
 */

'use strict';

angular.module('MUSE').directive('spielzeitPicker', ['$log', function ($log) {
    return{
        restrict: 'EA',
        scope: {
            treeModel: '=',
            selectableSpielzeiten: '=',
            selection: '=',
            costumeId: '@',
            roleId: '@',
            filmId: '@',
            validation: '='
        },
        templateUrl: 'templates/directives/spielzeitPicker.html',
        link: function ( scope, element, attrs ) {

            scope.tempSpielzeitVon = '';
            scope.tempSpielzeitBis = '';
            scope.showvalidation = angular.isDefined(attrs.showvalidation);

            scope.addSpielzeitToCostume = function(tempSpielzeit, tempSpielzeitVon, tempSpielzeitBis){
                tempSpielzeit = tempSpielzeit || '';
                tempSpielzeitVon = tempSpielzeitVon || '';
                tempSpielzeitBis = tempSpielzeitBis || '';
                var found = false;
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Spielzeit === tempSpielzeit && scope.selection[i].SpielzeitVon === tempSpielzeitVon && scope.selection[i].SpielzeitBis === tempSpielzeitBis){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    scope.selection.push({KostuemID: scope.costumeId, RollenID: scope.roleId, FilmID: scope.filmId, Spielzeit: tempSpielzeit, SpielzeitVon: tempSpielzeitVon, SpielzeitBis: tempSpielzeitBis});
                    scope.selection = angular.copy(scope.selection);
                }
            };

            scope.deleteSpielzeitFromCostume = function(s){
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Spielzeit === s.Spielzeit && scope.selection[i].SpielzeitVon === s.SpielzeitVon && scope.selection[i].SpielzeitBis === s.SpielzeitBis){
                        scope.selection.splice(i,1);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };
        }
    };
}]);