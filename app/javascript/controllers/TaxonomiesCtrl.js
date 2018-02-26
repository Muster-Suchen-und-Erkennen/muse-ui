/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * TaxonomiesCtrl
 */
angular.module('MUSE').controller('TaxonomiesCtrl', ['$scope', '$rootScope', '$http','dbREST','$log','$q', function ($scope, $rootScope, $http , dbREST, $log, $q ) {


    $scope.taxonomies = [];
    $scope.currentTaxonomy = null;
    $scope.isTaxAdmin = false;

    dbREST.EditableTaxonomies.get().$promise.then(function(result) {
        $scope.taxonomies = result;
    });

    $rootScope.$watch('user', function() {
        if ($rootScope.user && $rootScope.user.roles && ($rootScope.user.roles.indexOf('TaxAdmin') !== -1)) {
            $scope.isTaxAdmin = true;
        } else {
            $scope.isTaxAdmin = false;
        }
    });


    $scope.onSelect = function (item) {
        $scope.currentTaxonomy = item;
    };

    $scope.isEditable = function() {
        return $scope.isTaxAdmin && $scope.currentTaxonomy && $scope.currentTaxonomy.editable;
    }

}]);
