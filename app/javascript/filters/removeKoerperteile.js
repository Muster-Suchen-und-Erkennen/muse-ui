/**
 * Created by michaelfalkenthal on 16.04.14.
 */
'use strict';

/**
 * FILTER removeKoerperteile
 */
angular.module('MUSE').filter('removeKoerperteile', function () {
    return function (items, koerperteile) {
        var diff = _.difference(items, _.pluck(koerperteile, 'Koerperteilname'));
        return _.filter(items, function(item){return diff.indexOf(item) >= 0;});
    };
});

/**
 * FILTER removeKoerperteileFlat
 */
angular.module('MUSE').filter('removeKoerperteileFlat', function () {
    return function (items, koerperteile) {
        var plainItems = _.pluck(items, 'id');
        var plainKoerperteile = _.pluck(koerperteile, 'Koerperteilname');
        var diff = _.difference(plainItems, plainKoerperteile);
        return _.filter(items, function(item){return diff.indexOf(item.id) >= 0;});
    };
});