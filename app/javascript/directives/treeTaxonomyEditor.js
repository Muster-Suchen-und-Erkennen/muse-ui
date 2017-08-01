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

        scope.data = taxonomyMapping[scope.taxonomy].query();
        scope.selectedParent = '';
        scope.newItem = '';

        scope.selectAsParent = function (item) {
            scope.selectedParent = item.id;
        };

        scope.deleteElement = function (item) {
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
            taxonomy: '@?',
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('treeTaxonomyEditor', ['$log', 'dbREST', AngularTreeTaxonomyEditorDirective]);
