/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * TaxonomiesCtrl
 */
angular.module('MUSE').controller('TaxonomiesCtrl', ['$scope', '$http','dbREST','$log','$q', function ($scope, $http , dbREST, $log, $q ) {


    $scope.taxonomies = dbREST.EditableTaxonomies.get();
    $scope.currentTaxonomy = 'test';
    $scope.test = 't';

    $scope.onSelect = function (item) {
        $scope.currentTaxonomy = item;
    };


}]);
