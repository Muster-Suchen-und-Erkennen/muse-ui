/**
 * Angular list-taxonomy editor directive.
 *
 * @description: A directive to edit taxonomies.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularListTaxonomyEditorDirective($log, dbREST, $timeout) {

    var taxonomyMapping = {
        'Materialeindruck': dbREST.selectables.materialeindruecke,
        'Farbeindruck': dbREST.selectables.farbeindruecke,
    };

    function link (scope, element, attr) {

        scope.isEditable = angular.isDefined(scope.editable) ? (scope.editable !== 'false' ? true : false) : false;

        scope.data = [];
        scope.newItem = {name:''};

        var first = true;

        scope.reloadTaxonomy = function () {
            if (!(scope.taxonomy in taxonomyMapping)) {
                scope.data = [];
                return;
            }
            taxonomyMapping[scope.taxonomy].query().$promise.then(function(result) {
                $timeout(() => {
                    scope.data = result;
                }, 0);
            });
        };

        scope.$watch('taxonomy', function (newVal, oldVal) {
            if (first || newVal !== oldVal) {
                first = false;
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
    .directive('listTaxonomyEditor', ['$log', 'dbREST', '$timeout', AngularListTaxonomyEditorDirective]);
