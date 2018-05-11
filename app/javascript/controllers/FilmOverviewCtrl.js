/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * FilmOverviewCtrl
 */
angular.module('MUSE').controller('FilmOverviewCtrl', ['$scope', 'dbREST', '$route', '$timeout', '$log', function ($scope, dbREST, $route, $timeout, $log) {
    $scope.filme = [];
    dbREST.Filme.query().$promise.then(function(result) {
        $timeout(() => {
            $scope.filme = result;
        }, 0);
    });
    $scope.abc = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    $scope.selectedFilm = {};

    $scope.setSelectedFilm = function (film) {
        $scope.selectedFilm = film;
    };
    $scope.deleteFilm = function () {
        dbREST.Filme.delete({filmId: $scope.selectedFilm.FilmID}, {}, function (value, responseHeader) {
            $log.debug('FILM ERFOLGREICH GELÖSCHT!');
            $log.debug(JSON.stringify(value));
            $log.debug(JSON.stringify(responseHeader));
            $scope.selectedFilm.deleted = true;
            for (var i = 0; i < $scope.filme.length; i++) {
                if ($scope.filme[i].FilmID === $scope.selectedFilm.FilmID) {
                    $scope.filme.splice(i, 1);
                }
            }
            $scope.selectedFilm = {};
        }, function (httpResponse) {
            $log.debug('FILM NICHT ERFOLGREICH GELÖSCHT');
            $log.debug(JSON.stringify(httpResponse));
        });
    };
}]);