/**
 * Created by michaelfalkenthal on 30.09.14.
 */
'use strict';

/**
 * FILTER flatten
 */
angular.module('MUSE').filter('flatten', [function () {
        return function (items) {
            var flatitems = [];

            function flatten(items) {
                _.forEach(items, function (item) {
                    flatitems.push({ 'id': item.id, 'label': item.label });
                    if (angular.isArray(item.children) && item.children.length > 0) {
                        flatten(item.children);
                    }
                });
            }

            flatten(items);
            return _.uniq(_.sortBy(flatitems, 'label'), 'id');
        };
    }]);