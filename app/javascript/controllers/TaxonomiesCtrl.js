/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * TaxonomiesCtrl
 */
angular.module('MUSE').controller('TaxonomiesCtrl', ['$scope', '$rootScope', '$http','dbREST','$log','$q', function ($scope, $rootScope, $http , dbREST, $log, $q ) {


    $scope.taxonomies = dbREST.EditableTaxonomies.get();
    $scope.currentTaxonomy = 'test';
    $scope.isTaxAdmin = false;

    if ($rootScope.user && $rootScope.user.roles && ($rootScope.user.roles.indexOf('TaxAdmin') !== -1)) {
        $scope.isTaxAdmin = true;
    };


    $scope.onSelect = function (item) {
        $scope.currentTaxonomy = item;
    };

}]);
