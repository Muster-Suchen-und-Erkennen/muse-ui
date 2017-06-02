'use strict';


angular.module('MUSE')

    .directive('singleTreeSelect', ['$window', '$filter', '$document', function ($window, $filter, $document) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/directives/singletreeselect.tpl.html',
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

                scope.temp = {
                    item: ''
                };

                scope.$watch('selection', function(newValue){
                    scope.temp.item = newValue;
                });

                // Hack to implement binding of external selection
                // and value presented and changed by drop down
                scope.$watch('temp.item', function(newValue){
                    scope.selection = newValue;
                });


                function close(e, callback) {
                    var target = $(e.target);
                    if (!target) {
                        return;
                    }
                    if (!target.hasClass('tree-menu') && !target.is($(element).find('.tree-menu').find('*'))) {
                        callback();
                    }
                }

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

    .directive('singleTreeModel', ['$compile', function ($compile, $log) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var treeId = attrs.treeId;
                var treeModel = attrs.singleTreeModel;
                var notfirstload = false;

                function selectNode(items) {
                    if((scope.selection !== undefined && scope.selection !== null && scope.selection.length > 0) ||  notfirstload)
                    {
                    _.forEach(items, function (item) {
                        if (scope.selection === item.id) {
                            item.selected = true;
                        } else {
                            item.selected = false;
                        }

                        if (angular.isArray(item.children) && item.children.length > 0) {
                            selectNode(item.children);
                        }
                    });
                }
                    else
                        if (scope.defaultValue!= null && scope.defaultValue !== undefined )
                    {
                       scope.selection = scope.defaultValue;
                    }
                    if(notfirstload === false){
                    notfirstload = true;}
                }

                var template = '<ul>' +
                    '<li ng-show="node.visible" data-ng-repeat="node in ' + treeModel + '">' +
                    '<i class="collapsed" data-ng-show="node.children.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                    '<i class="expanded" data-ng-show="node.children.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                    '<i class="normal" data-ng-hide="node.children.length"></i> ' +
                    '<span data-ng-class="{selected: node.selected}" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{ node.label }}</span>' +
                    '<div ng-if="!node.collapsed" data-tree-id="' + treeId + '" data-single-tree-model="node.children"></div>' +
                    '</li>' +
                    '</ul>';

                if (treeId && treeModel) {
                    if (attrs.angularTreeview) {
                        scope[treeId] = scope[treeId] || {};

                        //click to enlarge/collapse nodes
                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {
                            selectedNode.collapsed = !selectedNode.collapsed;
                        };

                        //click to select nodes
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {
                            if (selectedNode.selected) {
                                scope.selection = '';

                            } else {
                                scope.selection = selectedNode.id;
                            }
                        };

                        scope.$watch('selection', function () {
                            selectNode(scope.treeModel);
                        })
                    }

                    element.html('').append($compile(template)(scope));
                }
            }
        };
    }]);