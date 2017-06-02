/**
 * Created by michaelfalkenthal on 08.04.14.
 */

'use strict';

angular.module('MUSE').directive('materialPicker', ['$log', function ($log) {
    return{
        restrict: 'EA',
        scope: {
            treeModel: '=',
            selectableMaterialien: '=',
            selectableMaterialeindruecke: '=',
            selection: '=',
            idFieldName: '@',
            targetId: '@',
            validation: '='
        },
        templateUrl: 'templates/directives/materialPicker.html',
        link: function ( scope, element, attrs ) {
            //setting default value initially
            scope.tempMaterialImpression = 'normal';
            scope.showvalidation = angular.isDefined(attrs.showvalidation);
            scope.addMaterialToSelection = function(mName, mImpression){
                mName = mName || '';
                if(mName !== ''){
                    //setting default value of impression to normal
                    mImpression = mImpression || 'normal';
                    var found = false;
                    for(var i = 0; i < scope.selection.length; i++){
                        if(scope.selection[i].Materialname === mName && scope.selection[i].Materialeindruck === mImpression){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        var data = {};
                        data[scope.idFieldName] = scope.targetId;
                        data.Materialname = mName;
                        data.Materialeindruck = mImpression;
                        scope.selection.push(data);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };

            scope.deleteMaterialFromSelection = function(material){
                for(var i = 0; i < scope.selection.length; i++){
                    if(scope.selection[i].Materialname === material.Materialname && scope.selection[i].Materialeindruck === material.Materialeindruck){
                        scope.selection.splice(i,1);
                        scope.selection = angular.copy(scope.selection);
                    }
                }
            };
        }
    };
}]);