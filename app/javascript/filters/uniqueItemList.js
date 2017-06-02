/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * FILTER uniqueItemList
 */
angular.module('MUSE').filter('uniqueItemList', function () {
    return function (items, fatherField, childField) {
        var out = [];
        _.map(items, function (value, key) {
            out.push(value[fatherField]);
            if (value[childField] !== '') {
                out.push(value[childField]);
            }
        });
        return _.uniq(out.sort(), true);
    };
});