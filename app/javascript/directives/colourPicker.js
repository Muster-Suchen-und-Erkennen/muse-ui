/**
 * Created by michaelfalkenthal on 08.04.14.
 */

'use strict';

angular.module('MUSE').directive('colourPicker', ['$log', function ($log) {
    return{
        restrict: 'EA',
        scope: {
            treeModel: '=',
            selectableDominantefarbe: '=',
            selectableFarbeindruecke: '=',
            selection: '=',
            idFieldName: '@',
            targetId: '@',
            validation: '='
        },
        templateUrl: 'templates/directives/colourPicker.html',
        link: function ( scope, element, attrs ) {
            //setting default value initially
            scope.tempColourImpression = 'normal';
            scope.showvalidation = angular.isDefined(attrs.showvalidation);
            scope.addColourToSelection = function(cName, cImpression){
                cName = cName || '';
                if(cName !== ''){
                    //setting default value of impression to normal
                    cImpression = cImpression || 'normal';
                    var found = false;
                    for(var i = 0; i < scope.selection.length; i++){
                        if(scope.selection[i].Farbname === cName && scope.selection[i].Farbeindruck === cImpression){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        var data = {};
                        data[scope.idFieldName] = scope.targetId;
                        data.Farbname = cName;
                        data.Farbeindruck = cImpression;
                        scope.selection.push(data);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };

            scope.deleteColourFromSelection = function(colour){
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Farbname === colour.Farbname && scope.selection[i].Farbeindruck === colour.Farbeindruck){
                        scope.selection.splice(i,1);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };
        }
    };
}]);