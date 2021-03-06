/**
 * Angular tree-taxonomy editor directive.
 *
 * @description: A directive to edit taxonomies.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularTreeTaxonomyEditorDirective($log, dbREST, $timeout) {

    var taxonomyMapping = {
        Basiselement: dbREST.BasiselementDomaene,
        Genre: dbREST.Genres,
        Körpermodifikationen: dbREST.Koerpermodifikationen,
        Material: dbREST.Materialien,
        Produktionsort: dbREST.Produktionsorte,
        Beruf: dbREST.Rollenberufe,
        Spielort: dbREST.Spielorte,
        'Spielort (Detail)': dbREST.SpielortDetails,
        Spielzeit: dbREST.Spielzeiten,
        Stereotyp: dbREST.Stereotypen,
        Teilelement: dbREST.TeilelementDomaene,

        'Charaktereigenschaft': dbREST.Charaktereigenschaften,
        'Tageszeit': dbREST.Tageszeiten,
        'Alterseindruck': dbREST.Alterseindruecke,
        'Zustand': dbREST.Zustaende,
        'Farbe': dbREST.Farbe,
        'Farbkonzept': dbREST.Farbkonzepte,
        'Design': dbREST.Designs,
        'Form': dbREST.Formen,
        'Trageweise': dbREST.Trageweisen,
        'Funktion': dbREST.Funktionen,
        'Operator': dbREST.Operatoren,
        'Körperteil': dbREST.Körperteile,
        'Dominante Charaktereigenschaft': dbREST.Typus,
    };

    function link (scope, element, attr) {

        scope.isEditable = angular.isDefined(scope.editable) ? (scope.editable !== 'false' ? true : false) : false;

        scope.data = [];
        scope.selectedParent = '';
        scope.newItem = {name:''};

        var first = true;

        scope.reloadTaxonomy = function () {
            if (taxonomyMapping[scope.taxonomy] == undefined) {
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

        scope.$watch('editable', function (newVal, oldVal) {
            scope.isEditable = angular.isDefined(scope.editable) ? (scope.editable !== 'false' ? true : false) : false;
        });

        scope.selectAsParent = function (item) {
            if (!scope.isEditable) {
                return;
            }
            scope.selectedParent = item.id;
        };

        scope.addElement = function () {
            if (!scope.isEditable) {
                return;
            }
            var body = {
                name: scope.newItem.name,
                parent: scope.selectedParent,
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
        templateUrl: 'templates/directives/treeTaxonomyEditor.html',
        scope: {
            editable: '@?',
            taxonomy: '@',
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('treeTaxonomyEditor', ['$log', 'dbREST', '$timeout', AngularTreeTaxonomyEditorDirective]);
