/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * TestCtrl
 */
angular.module('MUSE').controller('TestCtrl', ['$scope', '$http','dbREST','$log','$q', function ($scope, $http , dbREST, $log, $q ) {


    $scope.filmIDInput = 55;
    $scope.rollenIDInput =1;
    $scope.kostuemIDInput =14;

    $scope.filmSelectionChanged = function() {
        if (!($scope.filmIDInput in $scope.jsonData)) {
            var smallest = undefined;
            for (var key in $scope.jsonData) {
                if ($scope.jsonData.hasOwnProperty(key)) {
                    if (! smallest || parseInt(smallest) > parseInt(key)) {
                        smallest = key;
                    }
                }
            }
            $scope.filmIDInput = smallest;
        }
        $scope.roleSelectionChanged(true);
    };

    $scope.roleSelectionChanged = function(reset) {
        if (reset || !($scope.rollenIDInput in $scope.jsonData[$scope.filmIDInput])) {
            var smallest = undefined;
            for (var key in $scope.jsonData[$scope.filmIDInput]) {
                if ($scope.jsonData[$scope.filmIDInput].hasOwnProperty(key)) {
                    if (! smallest || parseInt(smallest) > parseInt(key)) {
                        smallest = key;
                    }
                }
            }
            $scope.rollenIDInput = smallest;
        }
        var smallest = undefined;
        $scope.jsonData[$scope.filmIDInput][$scope.rollenIDInput].forEach( function (key) {
            if (! smallest || smallest > key) {
                smallest = key;
            }
        });
        $scope.kostuemIDInput = smallest;
    };

    $scope.beClicked = function (be) {
        console.log('clicked: ' + be);
    };

    $scope.beHovered = function (be) {
        console.log('hovered: ' + be);
    };

    $scope.linkClicked = function (from, to) {
        console.log('clicked: (' + from + ', ' + to + ')');
    };


    $scope.jsonData = {};

    var films = dbREST.Filme.query();

    films.$promise.then(function (result) {
        result.forEach(function (film) {
            var filmID = film.FilmID;
            var roles = dbREST.Rollen.query({filmId: filmID});
            roles.$promise.then(function (roles) {
                if (roles.length > 0) {
                    roles.forEach(function (role) {
                        var roleID = role.RollenID;
                        var costumes = dbREST.Kostueme.query({filmId: filmID, rollenId: roleID});
                        costumes.$promise.then(function (costumes) {
                            if (costumes.length > 0) {
                                if (! (filmID in $scope.jsonData)) {
                                    $scope.jsonData[filmID] = {};
                                }
                                $scope.jsonData[filmID][roleID] = [];
                                costumes.forEach(function (costume) {
                                    $scope.jsonData[filmID][roleID].push(costume.KostuemID);
                                });
                            }
                        });
                    });
                }
            });
        });
    });



}]);