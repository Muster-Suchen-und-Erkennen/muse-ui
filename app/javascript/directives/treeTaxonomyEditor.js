/**
 * Angular tree-taxonomy editor directive.
 *
 * @description: A directive to edit taxonomies.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularTreeTaxonomyEditorDirective($log, dbREST) {

    var taxonomyMapping = {
        Basiselement: dbREST.BasiselementDomaene,
    };

    function link (scope, element, attr) {

        scope.isEditable = angular.isDefined(scope.editable) ? (scope.editable !== 'false' ? true : false) : false;

        scope.data = taxonomyMapping[scope.taxonomy].query();
        scope.selectedParent = '';
        scope.newItem = {name:''};

        scope.selectAsParent = function (item) {
            if (!scope.editable) {
                return;
            }
            scope.selectedParent = item.id;
        };

        scope.addElement = function () {
            if (!scope.editable) {
                return;
            }
            var body = {
                name: scope.newItem.name,
                parent: scope.selectedParent,
            };
            dbREST.AddTaxonomyItem.save({taxonomy: scope.taxonomy}, body, function (success) {
                scope.data = taxonomyMapping[scope.taxonomy].query();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };

        scope.deleteElement = function (item) {
            if (!scope.editable) {
                return;
            }
            dbREST.DeleteTaxonomyItem.delete({taxonomy: scope.taxonomy, name: item.id}, function (success) {
                scope.data = taxonomyMapping[scope.taxonomy].query();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };



    }

    return {
        restrict: 'E',
        templateUrl: 'templates/directives/treeTaxonomyEditor.html',
        scope: {
            editable: '@?',
            taxonomy: '@',
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('treeTaxonomyEditor', ['$log', 'dbREST', AngularTreeTaxonomyEditorDirective]);
