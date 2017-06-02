/**
 * Created by michaelfalkenthal on 08.04.14.
 */

'use strict';

angular.module('MUSE').directive('spielortPicker', ['$log', function ($log) {
    return{
        restrict: 'EA',
        scope: {
            treeModel: '=',
            treeModelDetail: '=',
            selectableSpielorte: '=',
            selectableSpielortFreitexte: '=',
            selection: '=',
            costumeId: '@',
            roleId: '@',
            filmId: '@',
            validation: '='
        },
        templateUrl: 'templates/directives/spielortPicker.html',
        link: function ( scope, element, attrs ) {

            scope.showvalidation = angular.isDefined(attrs.showvalidation);
            scope.addSpielortToCostume = function(tempSpielort, tempSpielortfreitext){
                tempSpielort = tempSpielort || '';
                tempSpielortfreitext = tempSpielortfreitext || '';
                var found = false;
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Spielort === tempSpielort && scope.selection[i].SpielortDetail === tempSpielortfreitext){
                        found = true;
                        break;
                    }
                }
                if(!found){
                    scope.selection.push({KostuemID: scope.costumeId, RollenID: scope.roleId, FilmID: scope.filmId, Spielort: tempSpielort, SpielortDetail: tempSpielortfreitext});
                    scope.selection = angular.copy(scope.selection);
                }
            };

            scope.deleteSpielortFromCostume = function(s){
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Spielort === s.Spielort && scope.selection[i].SpielortDetail === s.SpielortDetail){
                        scope.selection.splice(i,1);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };
        }
    };
}]);