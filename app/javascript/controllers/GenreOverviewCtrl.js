/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * GenreOverviewCtrl
 */
angular.module('MUSE').controller('GenreOverviewCtrl', ['$scope', 'dbREST', '$route', '$timeout', '$q', '$log', '$location', '$anchorScroll', function ($scope, dbREST, $route, $timeout, $q, $log, $location, $anchorScroll) {
    var genres = dbREST.Genres.query();
    var filme = dbREST.Filme.query();
    var tempGenres = {};
    $scope.abc = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    $scope.selectedFilm = {};

    $anchorScroll.yOffset = 50;
    var genrePromise = genres.$promise.then(function () {
            var backlog = genres[0].children;
            var current = backlog.pop();
            while (current){
                if (current.children){
                    backlog = backlog.concat(current.children);
                    current.children = null;
                }
                current.films = [];
                tempGenres[current.label] = current;
                current = backlog.pop();
            }
        } , function (params) {

        }, function (params) {

        });



    filme.$promise.then(function (filme) {
            var promises = [];
            filme.forEach(function (film) {
                // get genres for film
                dbREST.Filme.get({filmId: film.FilmID}, function (value) {
                    film.Genres = value.Genres;
                    promises.push(
                        genrePromise.then(function () {
                            film.Genres.forEach(function (genre) {
                                tempGenres[genre].films.push(film);
                            });
                        })
                    );
                });
            });
            $q.all(promises).then(function () {
                var temp = [];
                for (var key in tempGenres) {
                    temp.push(tempGenres[key]);
                }
                $timeout(() => {
                    $scope.genres = temp;
                }, 0);
            });
        } , function (params) {

        }, function (params) {

        });

    $scope.setSelectedFilm = function (film) {
        $scope.selectedFilm = film;
    };
}]);
