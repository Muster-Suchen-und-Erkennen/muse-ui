'use strict';


angular.module('MUSE')

    .directive('treeSelect', ['$window', '$filter', '$document', function ($window, $filter, $document) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/directives/treeselect.tpl.html',
            scope: {
                id: '@',
                treeModel: '=',
                selection: '=',
                btnDivClass: '@',
                selectDivClass: '@',
                indicatorDivClass: '@',
                preparedFlattenList: '=',
                defaultValue: '@'
            },
            link: function (scope, element, attrs) {

                scope.selectables = scope.preparedFlattenList;

                function close(e, callback) {
                    var target = $(e.target);
                    if (!target) {
                        return;
                    }
                    if (!target.hasClass('tree-menu') && !target.is($(element).find('.tree-menu').find('*'))) {
                        callback();
                    }
                }

                scope.temp = {
                    items: []
                };

                scope.$watch('selection', function(newValues){
                    scope.temp.items = newValues;
                });

                // Hack to implement binding of external selection
                // and value presented and changed by drop down
                scope.$watch('temp.items', function(newValues){
                    scope.selection = newValues;
                });

                if (attrs.placeholder) { // FIXME update: if observer doesn't work right, then migration failed
                    attrs.$observe('placeholder', function (value) {
                        scope.placeholder = angular.isDefined(value) ? value : '';
                    });
                } else {
                    scope.placeholder = '';
                }

                // Tree dropdown
                scope.open = false;
                scope.toggle = function (e) {
                    if (e) {
                        e.stopPropagation();
                    }
                    scope.open = !scope.open;
                    if (scope.open) {
                        $window.onclick = function (event) {
                            close(event, scope.toggle);
                            scope.$apply();
                        };
                    } else {
                        scope.open = false;
                        $window.onclick = null;
                    }
                };

                $document.on('keydown', function(e){
                    if(e.keyCode === 9){
                        if(scope.open){
                            scope.toggle(e);
                            scope.$apply();
                        }
                    }
                });

                // Collapse / Enlarge
                scope.collapseAll = function () {
                    scope.treeModel[0].collapsed = true;
                    scope.treeModel[0].children.forEach(function (node){
                        collapseAllNodes(node);
                    });
                };

                scope.enlargeAll = function () {
                    scope.treeModel[0].collapsed = false;
                    scope.treeModel[0].children.forEach(function (node) {
                        openAllNodes(node);
                    });
                };

                function collapseAllNodes(node){
                    node.collapsed = true;
                    node.children.forEach(function(childNode){
                        collapseAllNodes(childNode);
                    });
                }

                function openAllNodes(node){
                    node.collapsed = false;
                    node.children.forEach(function(childNode){
                        openAllNodes(childNode);
                    });
                }

                //Search
                function recursiveSearch(txt, node, fatherNode){
                    node.visible = node.label.toLowerCase().indexOf(txt.toLowerCase()) > -1;

                    node.children.forEach(function(childNode){
                        recursiveSearch(txt, childNode, node);
                        if(childNode.visible){
                            node.visible = true;
                            node.collapsed = false;
                        }
                    });
                }

                function showAll(node){
                    node.visible = true;
                    node.collapsed = false;
                    node.children.forEach(function(childNode){
                        showAll(childNode);
                    });
                }

                function hideAll(node){
                    node.visible = false;
                    node.collapsed = true;
                    node.children.forEach(function(childNode){
                        hideAll(childNode);
                    });
                }

                scope.searchByText = function(txt){
                    if(txt.length > 0){
                        scope.treeModel.forEach(function(rootTreeNode){
                            recursiveSearch(txt, rootTreeNode);
                        });
                    }else{
                        scope.treeModel.forEach(function(rootTreeNode){
                            showAll(rootTreeNode);
                        });
                    }
                };
            }
        };
    }])

    .directive('treeModel', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                function selectNodes(items) {
                    if(scope.selection !== undefined && scope.selection !== null && scope.selection.length > 0)
                    {
                        _.forEach(items, function (item) {
                            if (_.contains(scope.selection, item.id)) {
                                item.selected = true;
                            } else {
                                item.selected = false;
                            }

                            if (angular.isArray(item.children) && item.children.length > 0) {
                                selectNodes(item.children);
                            }
                        });
                    }
                    else
                    if(scope.defaultValue != null && scope.defaultValue !== undefined )
                    {
                        scope.selection = scope.defaultValue;
                    }


                }

                var treeId = attrs.treeId;
                var treeModel = attrs.treeModel;

                var template = '<ul>' +
                    '<li ng-show="node.visible" data-ng-repeat="node in ' + treeModel + '">' +
                    '<i class="collapsed" data-ng-show="node.children.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                    '<i class="expanded" data-ng-show="node.children.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                    '<i class="normal" data-ng-hide="node.children.length"></i> ' +
                    '<span data-ng-class="{selected: node.selected}" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{ node.label }}</span>' +
                    '<div ng-if="!node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.children"></div>' +
                    '</li>' +
                    '</ul>';
                //check tree id, tree model
                if (treeId && treeModel) {
                    //root node
                    if (attrs.angularTreeview) {
                        //create tree object if not exists
                        scope[treeId] = scope[treeId] || {};

                        //if node head clicks,
                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {
                            //Collapse or Expand
                            selectedNode.collapsed = !selectedNode.collapsed;
                        };
                        //if node label clicks,
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
                            if (selectedNode.selected) {
                                selectedNode.selected = false;
                                scope.temp.items = _.filter(scope.temp.items, function (item) {
                                    return item !== selectedNode.id;
                                });
                                //set highlight to selected node
                            } else {
                                selectedNode.selected = true;
                                scope.temp.items.push(selectedNode.id);
                                scope.temp.items = angular.copy(scope.temp.items);
                            }
                            //selectNodes(scope.treeModel);
                        };

                        scope.$watch('selection', function () {
                            selectNodes(scope.treeModel);
                        });
                    }

                    element.html('').append($compile(template)(scope));
                }
            }
        };
    }]);

/*.filter('flatten', [function () {
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
 }]);*/