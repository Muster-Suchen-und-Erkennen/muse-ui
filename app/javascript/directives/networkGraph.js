/**
 * Angular Network graph directive.
 *
 * @description: A directive to display a graph of a costume.
 *
 * @author: Fabian Bühler
 */

'use strict';

function AngularD3networkGraphDirective($log, dbREST) {

    function link (scope, element, attr) {

        scope.autoReload = angular.isDefined(scope.autoReload) ? scope.autoReload : true;

        var padding = 15;
        var paddingLeft = 120;

        //costumeData: '=',
        //    height: 0,
        //    width: 0,
        //    yScale: null,
        //    xScale: null,
        //    nodes: [],
        //    links: []

        scope.data = {};
        scope.data.nodes = [];
        scope.data.links = [];

        scope.male = false;

        scope.nodesize = '100';

        scope.nodescale = 0.5;


        // select the svg container for the network graph
        var direktiveBody = d3.select(element[0]);
        var svg = direktiveBody.select('svg.graph');
        scope.height = +svg.style('height').replace('px', '');
        scope.width = +svg.style('width').replace('px', '');

        // setup the scales
        scope.yScale = d3.scaleLinear()
            .domain([10, 0])
            .range([0 + padding, scope.height - padding]);

        scope.xScale = d3.scaleLinear()
            .domain([0,3])
            .range([0 + paddingLeft, scope.width - padding]);

        // Domain knowledge:
        var domainToGroupID = {
            'Bein zugehörige Teile': 166,
            //'Externe Accessoires': ,
            'Fuß zugehörige Teile': 167,
            'Ganzkörper zugehörige Teile': 168,
            'Hals zugehörige Teile': 162,
            'Hand zugehörige Teile': 164,
            'Kopf zugehörige Teile': 161,
            'Oberkörper zugehörige Teile': 163,
            'Taille zugehörige Teile': 165

        };

        var groupMap = {};

        var baseelementDomain = dbREST.selectables.basiselemente;

        baseelementDomain.$promise.then(function (result) {
            // fill groupMap with domain knowledge about baseelemnt belonging to group
            var trees = baseelementDomain[0].children;
            function recursiveFlatten(tree) {
                var erg = [];
                tree.children.forEach(function (child) {
                    erg.push(child.id);
                    erg = erg.concat(recursiveFlatten(child));
                });
                return erg;
            }

            trees.forEach(function (node) {
                if (node.id in domainToGroupID) {
                    var group = domainToGroupID[node.id];
                    recursiveFlatten(node).forEach(function (be) {
                        groupMap[be] = group;
                    });
                }
            });
        });

        // map group id to height
        scope.heightmap = {
            161:8, // head
            162:7, // neck
            165:5.5, // taille
            166:2, // leg
            1:9, // FIXME no koerperteil reference // accessoires
            163:6, // upper body
            168:4, // full body
            164:4.8, // hands
            167:0, // foot
            0:10 // unmapped
        };

        // map koerperteil node to x offset
        scope.widthmap = {
            161:0, // head
            162:0, // neck
            165:0, // taille
            166:0, // leg
            163:0, // upper body
            168:0, // full body
            164:0, // hands
            167:0 // foot
        };

        // simulation: setup forces
        var simulation = d3.forceSimulation()
          .force('link', d3.forceLink().id(function(d) { return d.BasiselementID; }).strength(0.4)) // force between related elements
          .force('charge', d3.forceManyBody().strength(-200)) // force to declutter graph (negative gravity between nodes)
          .force('collision', d3.forceCollide(70)) // force to keep nodes from colliding
          .force('positionY', d3.forceY(function(d) {return scope.yScale(scope.heightmap[d.group]);}).strength(0.8)) // force to keep nodes on respective level they belong to
          .force('positionX', d3.forceX(function(d) {return scope.xScale(d.level);}).strength(0.8)); // force to layout nodes based on how far from body they appear in the network

        var defs = svg.append('defs');

        // append marker for direction to svg
        defs.append('marker')
            .attr('id','arrow')
            .attr('viewBox','0 -5 10 10')
            .attr('refX',5)
            .attr('refY',0)
            .attr('markerWidth',4)
            .attr('markerHeight',4)
            .attr('orient','auto')
          .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('class','arrowHead');

        // select conatiner that gets zoomed and apply zoom behaviour
        scope.graph = svg.select('g.zoomable');

        var zoom = d3.zoom().on('zoom', zoomed)
            .scaleExtent([1/4,4]);

        svg.call(zoom);

        scope.graph.append('g')
            .attr('class', 'links');

        var linkLine;

        var linkText;

        scope.graph.append('g')
            .attr('class', 'nodes');

        var nodes, node;

        /**
         * Load and prepare the costume data.
         */
        function loadData() {
            var nodeDict = {};
            function onError(error) {
                scope.loadingData = false;
            }

            // get constant body part data
            var prom = dbREST.selectables.koerperteile.$promise.then(function(koerperteile){
                var result = [];
                koerperteile.forEach(function(koerperteil){
                    var node = {
                        BasiselementID: koerperteil.BasiselementID,
                        Basiselementname: koerperteil.Koerperteilname,
                        koerperteil: true,
                        level:0
                    };
                    scope.data.nodes.push(node);
                    nodeDict[node.BasiselementID] = node;
                    result.push(node);
                });
                return result;
            });

            // get role gender
            // selectedRole.Geschlecht
            try {
            var role = dbREST.Rollen.get({filmId: scope.filmid,
                                          rollenId: scope.rollenid},
                                         function (success) {},
                                         function (error) {
                                            scope.loadingData = false;
                                         });
            } catch (Exception ) {
                // don't update anything if rest call goes wrong
                scope.loadingData = false;
                return;
            }

            // get costume data
            try {
            scope.costumeData = dbREST.Kostueme.get({filmId: scope.filmid,
                                                     rollenId: scope.rollenid,
                                                     kostuemId: scope.kostuemid},
                                                    function (success) {},
                                                    function (error) {
                                                        scope.loadingData = false;
                                                    });
            } catch (Exception ) {
                // don't update anything if rest call goes wrong
                scope.loadingData = false;
                return;
            }

            role.$promise.then(function (role) {
                scope.male = role.Geschlecht === 'männlich';
            }, onError);

            // parse data
            var promData = scope.costumeData.$promise.then(function (result) {
                function smallBE(be) {
                    var newBE = {
                        BasiselementID: be.BasiselementID,
                        Basiselementname: be.Basiselementname,
                        BasiselementFarben: be.BasiselementFarben,
                        image: scope.$root.backend.restBackendAddress + '/basiselement/' + be.Basiselementname + '/image/', // FIXME bad workaround for REST API badness
                        koerperteil: false,
                        level: undefined
                    };
                    return newBE;
                }

                var relations = new Set();
                var relationdict = {};
                result.KostuemBasiselemente.forEach(function (basisElement) {
                    basisElement.BasiselementRelationen.forEach(function (relation) {
                        var rel = {
                            source: relation.SubjektBasiselement,
                            target: relation.ObjektBasiselement,
                            name: relation.PraedikatBasiselement
                        };
                        relations.add(rel);
                        if (!relationdict[rel.target]) {
                            relationdict[rel.target] = new Set();
                        }
                        relationdict[rel.target].add(rel);
                    });
                    var be = smallBE(basisElement);
                    scope.data.nodes.push(be);
                    nodeDict[be.BasiselementID] = be;
                });
                scope.data.links = [...relations];
                // calculate node levels
                var promDataCalculation = prom.then(function (visited) {
                    var change = true;
                    // set start distances
                    visited.forEach(function (node){
                        node.distance = {};
                        node.distance[node.BasiselementID] = 0;
                    });

                    // calculate new distances for each source individually
                    function calcDistances (dist1, dist2) {
                        for (var source in dist1) {
                            if (dist2[source]) {
                                dist2[source] = Math.min(dist1[source]+1, dist2[source]);
                            } else {
                                dist2[source] = dist1[source] + 1;
                            }
                        }
                        return dist2;
                    }

                    // update all distances from thos node
                    function updateDistances (node) {
                        if (relationdict[node.BasiselementID]) {
                            relationdict[node.BasiselementID].forEach(function (relation) {
                                var node2 = nodeDict[relation.source];
                                if (node2.distance){
                                    var dist = angular.copy(node2.distance);
                                    node2.distance = calcDistances(node.distance, node2.distance);
                                    change = change || node2.distance === dist;
                                } else {
                                    change = true;
                                    var newdist = angular.copy(node.distance);
                                    for (var source in newdist) {
                                        newdist[source] = newdist[source] + 1;
                                    }
                                    node2.distance = newdist;
                                    visited.push(node2);
                                }
                            });
                        }
                    }

                    // as long as the distances change keep updating them
                    while (change){
                        change = false;
                        visited.forEach(updateDistances);
                    }

                    // Calculate level and group based on distance to source
                    scope.data.nodes.forEach(function (node) {
                        if (node.distance) {
                            var min, minID;
                            var max, maxID;
                            for (var source in node.distance) {
                                var dist = node.distance[source]
                                if (!min || dist < min) {
                                    minID = source;
                                    min = dist;
                                }
                                if (!max || dist > max) {
                                    maxID = source;
                                    max = dist;
                                }
                            }
                            node.level = max;
                            node.group = minID;
                            if (node.Basiselementname in groupMap) {
                                node.group = groupMap[node.Basiselementname];
                            }
                        } else {
                            node.level = 1;
                            node.group = 0;
                        }
                        // set start coordinates:
                        node.x = scope.xScale(node.level);
                        node.y = scope.yScale(scope.heightmap[node.group]);
                        if (node.koerperteil) {
                            node.x = scope.xScale(scope.widthmap[node.group]);
                            node.fx = node.x;
                            node.fy = node.y;
                        }
                    });

                    // set source and target in links to actual node objects
                    scope.data.links.forEach(function (link) {
                        link.source = nodeDict[link.source];
                        link.target = nodeDict[link.target];
                    });

                // finished loading data
                scope.loadingData = false;

                // update graph, because data changed
                promDataCalculation.then(updateGraph);
                }, function (error) {
                    console.log(error);
                    scope.loadingData = false;
                });
            });

        }

        function recalculateScaleRanges() {
            var svg = direktiveBody.select('svg.graph');
            // update bounds of graph
            scope.height = +svg.style('height').replace('px', '');
            scope.width = +svg.style('width').replace('px', '');

            scope.yScale.range([0 + padding, scope.height - padding]);
            scope.xScale.range([0 + paddingLeft, scope.width - padding]);
        }

        /**
         * Adds and removes nodes to the graph after changes.
         */
        function updateGraph() {

            var svg = direktiveBody.select('svg.graph');

            scope.graph = svg.select('g.zoomable');

            recalculateScaleRanges();

            // reset domains
            scope.xScale.domain(d3.extent(scope.data.nodes, function (d) { return d.level;}));

            // adapt scale
            scope.graph.select('g.figure')
                .attr('transform', function () {
                    var scaleFactor = (scope.height - 2* padding- 50) / 100;
                    return 'translate(' + paddingLeft + ',50) scale(' + scaleFactor + ')';
                });

            // update figure
            changeFigure();

            // add / remove nodes&links

            nodes = scope.graph.select('g.nodes')
              .selectAll('g.node')
              .data(scope.data.nodes);

            // update nodes
            nodes.transition()
                .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ') scale(' + scope.nodescale + ')';});

            // reposition bodyparts
            nodes.enter().each(function (d) {
                if (d.koerperteil) {
                    d.fx = scope.xScale(scope.widthmap[d.group]);
                    d.fy = scope.yScale(scope.heightmap[d.group]);
                }
            });

            node = nodes.enter().append('g')
                .classed('node', true)
                .classed('bodypart', function (d) {return d.koerperteil;})
                .attr('data-node', function(d) {return d.group;})
                .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ') scale(' + scope.nodescale + ')';})
                .on('dblclick', doubleclick)
                .on('mouseover', mouseover)
                .on('mouseout', mouseout)
                .call(d3.drag()
                  .on('start', dragstarted)
                  .on('drag', dragged)
                  .on('end', dragended));

            node.append('title')
              .text(function(d) { return d.Basiselementname + ' (' + d.BasiselementID + ')'; });

            node.append('rect')
                .attr('height', '250')
                .attr('width', '180')
                .attr('ry', '12')
                .attr('class', 'node-frame')
                .attr('x', '-90')
                .attr('y', '-125');

            node.append('image')
                .attr('xlink:href', '')
                .attr('ng-attr-xlink:href', function (d) {return d.image; })
                .attr('x', -80)
                .attr('y', -115)
                .attr('height', 160)
                .attr('width', 160);

            node.append('text')
          	  .text(function(d) { return d.Basiselementname; })
          	    .attr('data-text', function(d) { return d.Basiselementname; })
          	  .style('fill-opacity', 1)
                .style('text-anchor', 'middle')
                .style('font-size', '22px')
                .attr('y', '75')
                .call(wrapText, 160);

            node.append('text')
          	  .text(function(d) { return '(' + d.BasiselementID + ')'; })
              .attr('class', 'clickable-svg-text')
          	  .style('fill-opacity', 1)
                .style('text-anchor', 'middle')
                .style('font-size', '16px')
                .attr('y', '100')
              .on('click', function (d) {
                  if (scope.onClickBe) {
                      scope.onClickBe({beID: d.BasiselementID});
                  }
                  d3.event.stopPropagation();
              });

            nodes.exit().remove();

            var links = scope.graph.select('g.links')
              .selectAll('g.link')
              .data(scope.data.links);

            // update links
            var link = links.enter().append('g')
                .attr('class', 'link')
                .attr('data-link-from', function(d) {return d.source.BasiselementID; })
                .attr('data-link-to', function(d) {return d.target.BasiselementID; });

            linkLine = link.append('polyline')
                .classed('linkline', true)
                .attr('marker-mid', 'url(#arrow)');

            linkText = link.append('text')
                .attr('font-family', 'Arial, Helvetica, sans-serif')
                .attr('text-anchor', 'middle')
                .attr('class', 'clickable-svg-text')
                .attr('dy', '-.35em')
                .text(function(d) {
                  return d.name;
                })
                .on('click', function (d) {
                    if (scope.onClickRelation) {
                        scope.onClickRelation({
                            from: d.source.BasiselementID,
                            to: d.target.BasiselementID
                        });
                    }
                });

            link.exit().remove();
            startSimulation();
        }

        /**
         * Shortens the text of each given textElement to fit into width.
         *
         * @param {any} textElements (d3.selection)
         * @param {number} width
         */
        function wrapText(textElements, width) {
            textElements.each(function () {
                var text = d3.select(this);
                var fulltext = text.attr('data-text');
                var line;
                var len = fulltext.length - 1;
                while (text.node().getComputedTextLength() > width && len > 0) {
                    len --;
                    line = fulltext.substr(0, len) + '…';
                    text.text(line);
                }
            });
        }

        function ticked() {
            linkLine
                .attr('points', function(d) {
                    var sourceX = d.source.x;
                    var sourceY = d.source.y;
                    var targetX = d.target.x;
                    var targetY = d.target.y;
                    return sourceX + ',' + sourceY + ' ' +
                        (sourceX + targetX)/2 + ',' + (sourceY + targetY)/2 + ' ' +
                        targetX + ',' + targetY; });
                //.attr('x1', function(d) { return d.source.x; })
                //.attr('y1', function(d) { return d.source.y; })
                //.attr('x2', function(d) { return d.target.x; })
                //.attr('y2', function(d) { return d.target.y; });
            linkText
                .attr('transform', function(d) {
                    var sourceX = d.source.x;
                    var sourceY = d.source.y;
                    var targetX = d.target.x;
                    var targetY = d.target.y;
                    var x = (sourceX + targetX)/2;
                    var y = (sourceY + targetY)/2;
                    var beta = ((Math.atan2(targetY - sourceY, targetX - sourceX) * 180/Math.PI) + 360) % 360;
                    if (beta>90 && beta <= 270) {
                        beta = beta - 180;
                    }
                    return 'translate(' + x + ',' + y + ') rotate(' + beta + ' ' + 0 + ',' + 0 + ')' ;
                });

            node
                .attr('transform', function(d) {
                    var x = d.x;
                    var y = d.y;
                    return 'translate(' + x + ',' + y + ') scale(' + scope.nodescale + ')' ;
                });
        }

        function zoomed() {
            scope.graph.attr('transform', d3.event.transform);
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            //d.fx = null;
            //d.fy = null;
        }

        function doubleclick(d) {
            d.fx = null;
            d.fy = null;
            d3.event.stopPropagation();
        }

        function mouseover(d) {
            // notify callback
            if (scope.onHoverBe) {
                scope.onHoverBe({beID: d.BasiselementID});
            }

            // figure part
            scope.graph.selectAll('.c'+d.group).classed('bodypart-selected', true);

            // nodes
            node.selectAll('rect')
                .classed('node-frame-selected', function(n) {return n.group === d.group;})
                .classed('node-frame-hovered', function(n) {return n.BasiselementID === d.BasiselementID;});

            // links
            linkLine.classed('incoming', function(l) {return l.target.BasiselementID === d.BasiselementID;})
                .classed('outgoing', function(l) {return l.source.BasiselementID === d.BasiselementID;});
        }

        function mouseout(d) {
            // notify callback
            if (scope.onHoverBe) {
                scope.onHoverBe({beID: undefined});
            }

            // figure part
            scope.graph.selectAll('.c'+d.group).classed('bodypart-selected', false);

            // nodes
            node.selectAll('rect')
                .classed('node-frame-selected', false)
                .classed('node-frame-hovered', false);

            // links
            linkLine.classed('incoming', false)
                .classed('outgoing', false);
        }

        function checkIfReload() {
            if (scope.autoReload && scope.autoReload !== 'false'){
                scope.reload();
            }
        }

        scope.resetZoom = function() {
            var svg = direktiveBody.select('svg.graph');
            var graph = svg.select('g.zoomable');
            graph.call(zoom.transform, d3.zoomIdentity);
        };

        scope.redraw = function() {
            scope.resetZoom();
            recalculateScaleRanges();
            calculateBodyPartPositions();
            nodes.enter().each(function (d) {
                if (! d.koerperteil) {
                    d.fx = null;
                    d.fy = null;
                } else {
                    d.fx = scope.xScale(scope.widthmap[d.group]);
                    d.fy = scope.yScale(scope.heightmap[d.group]);
                }
            });
            simulation.alpha(1).alphaTarget(0).restart();
        };

        scope.reload = function() {
            if (!((parseInt(scope.filmid) >= 0) && (parseInt(scope.rollenid, 10) >= 0) && (parseInt(scope.kostuemid, 10) >= 0))) {
                // return if any one of the id's is empty'
                return;
            }
            if (scope.loadingData) {
                return;
            }
            scope.loadingData = true;
            resetGraph();
            scope.data.nodes = [];
            scope.data.links = [];
            loadData();
        };

        // fill reloadController ////////////
        if (scope.reloadController) {
            scope.reloadController.reload = scope.reload;
            scope.reloadController.redraw = scope.redraw;
        }

        /**
         * Removes al existing nodes and links from graph.
         */
        function resetGraph() {
            scope.resetZoom();
            var svg = direktiveBody.select('svg.graph');
            var graph = svg.select('g.zoomable');
            graph.selectAll('g.node').remove();
            graph.selectAll('g.link').remove();
        }

        /**
         * Updates the figure according to role gender.
         */
        function changeFigure() {
            var svg = direktiveBody.select('svg.graph');
            var graph = svg.select('g.zoomable');
            graph.selectAll('#female')
                .classed('hidden', scope.male);
            graph.selectAll('#femaleBoxes')
                .classed('hidden', scope.male);
            graph.selectAll('#male')
                .classed('hidden', ! scope.male);
            graph.selectAll('#maleBoxes')
                .classed('hidden', ! scope.male);

            calculateBodyPartPositions();
        }

        /**
         * Dynamically calculates the bounding boxes for the bodyparts based
         * on svg attributes.
         */
        function calculateBodyPartPositions() {
            var svg = direktiveBody.select('svg.graph');
            var graph = svg.select('g.zoomable');
            var matrix = graph.select('g.figure').node().transform.baseVal.consolidate().matrix;

            /**
             * Transform a point with a svg transformation matrix.
             *
             * @param {number} x
             * @param {number} y
             * @param {any} matrix
             * @returns {point}
             */
            function transform(x, y, matrix) {
                var point = svg.node().createSVGPoint();
                point.x = x;
                point.y = y;
                return point.matrixTransform(matrix);
            }

            var boxes;

            if (scope.male) {
                boxes = graph.select('g.figure').select('#maleBoxes');
            } else {
                boxes = graph.select('g.figure').select('#femaleBoxes');
            }

            [
                161, // head
                162, // neck
                165, // taille
                166, // leg
                163, // upper body
                168, // full body
                164, // hands
                167, // foot
            ].forEach(function (beID) {
                var node = boxes.select('.c'+beID).node();
                if (! node) {
                    return;
                }
                var bbox = node.getBBox();

                var y = bbox.y + (bbox.height / 2); // half way up
                var x = bbox.x - 25 + bbox.width; // FIXME static -25

                var point = transform(x, y, matrix);

                y = scope.yScale.invert(point.y);
                x = scope.xScale.invert(point.x);
                scope.heightmap[beID] = y;
                scope.widthmap[beID] = x;
            });
        }

        /**
         * (Re-)Starts the Simulation.
         */
        function startSimulation() {

            simulation
                .nodes(scope.data.nodes)
                .on('tick', ticked);

            simulation.force('link')
                .links(scope.data.links);

            simulation.alpha(1).alphaTarget(0).restart();

        }


        // Load Graph and start simulation: ////////////////////////////////////

        checkIfReload();

        // Setup watchers to automattically reload directive on change.

        scope.$watch('filmid', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                checkIfReload();
            }
        });
        scope.$watch('rollenid', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                checkIfReload();
            }
        });
        scope.$watch('kostuemid', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                checkIfReload();
            }
        });
        scope.$watch('nodesize', function(newVal, oldVal) {
            var newScale = parseFloat(scope.nodesize);
            scope.nodescale = newScale / 200;
            if (newVal !== oldVal) {
                node.attr('transform', function(d) {
                    var x = d.x;
                    var y = d.y;
                    return 'translate(' + x + ',' + y + ') scale(' + scope.nodescale + ')' ;
                });
            }
        });



    }

    return {
        restrict: 'E',
        templateUrl: 'templates/directives/networkgraph.html',
        scope: {
            filmid: '@',
            rollenid: '@',
            kostuemid: '@',
            autoReload: '@',
            reloadController: '=?',
            onClickBe: '&?',  // args: beID
            onHoverBe: '&?',  // args: beID
            onClickRelation: '&?' // args: from, to
        },
        link: link
    };
}

angular.module('MUSE')
    .directive('networkGraph', ['$log', 'dbREST', AngularD3networkGraphDirective]);