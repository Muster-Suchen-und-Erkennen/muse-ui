/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * FILTER hasLiteral
 */
angular.module('MUSE').filter('hasLiteral', function () {
    return function (films, literal) {
        var out = [];
        films.forEach(function (film) {
            if (literal === '#') {
                //Alle Zahlen und Sonderzeichen
                if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].indexOf(film.Filmtitel.charAt(0).toUpperCase()) === -1) {
                    out.push(film);
                }
            } else {
                if (film.Filmtitel.charAt(0).toUpperCase() === literal) {
                    out.push(film);
                }
            }
        });
        return out;
    };
});