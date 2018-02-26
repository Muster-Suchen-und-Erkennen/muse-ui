/**
 * Angular list-taxonomy editor directive.
 *
 * @description: A directive to edit taxonomies.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularListTaxonomyEditorDirective($log, dbREST) {

    var taxonomyMapping = {
        'Materialeindruck': dbREST.Materialeindruck,
        'Farbeindruck': dbREST.Farbeindruck,
    };

    function link (scope, element, attr) {

        scope.isEditable = angular.isDefined(scope.editable) ? (scope.editable !== 'false' ? true : false) : false;

        scope.data = [];
        scope.newItem = {name:''};

        scope.reloadTaxonomy = function () {
            if (!(scope.taxonomy in taxonomyMapping)) {
                scope.data = [];
                return;
            }
            taxonomyMapping[scope.taxonomy].query().$promise.then(function(result) {
                scope.$apply(() => {
                    scope.data = result;
                });
            });
        };

        scope.$watch('taxonomy', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                scope.reloadTaxonomy();
            }
        });

        scope.addElement = function () {
            if (!scope.isEditable) {
                return;
            }
            var body = {
                name: scope.newItem.name,
            };
            dbREST.AddTaxonomyItem.save({taxonomy: scope.taxonomy}, body, function (success) {
                scope.reloadTaxonomy();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };

        scope.deleteElement = function (item) {
            if (!scope.isEditable) {
                return;
            }
            dbREST.DeleteTaxonomyItem.delete({taxonomy: scope.taxonomy, name: item.id}, function (success) {
                scope.reloadTaxonomy();
            }, function (htmlStatus) {
                // something bad happened
                // FIXME
            });
        };



    }

    return {
        restrict: 'E',
        templateUrl: 'templates/directives/listTaxonomyEditor.html',
        scope: {
            editable: '@?',
            taxonomy: '@',
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('listTaxonomyEditor', ['$log', 'dbREST', AngularListTaxonomyEditorDirective]);
