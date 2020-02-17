/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * AnalysisCtrl
 */
angular.module('MUSE').controller('AnalysisCtrl', ['$scope', '$http','dbREST','$log','$q', function ($scope, $http , dbREST, $log, $q ) {


    $scope.statistic = dbREST.Statistic.get();
    $scope.diagnostic = dbREST.Diagnostic.get();


}]);