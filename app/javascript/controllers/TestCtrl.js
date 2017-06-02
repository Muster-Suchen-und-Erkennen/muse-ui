/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';
/**
 * FilmCtrl
 */
angular.module('MUSE').controller('TestCtrl', ['$scope', '$http','dbREST','$log','$q','$jsPlumb', function ($scope, $http , dbREST, $log, $q ,$jsPlumb) {


    $scope.filmIDInput = 55;
    $scope.rollenIDInput =1;
    $scope.kostuemIDInput =14;
    var network;

    var mergeMe;
    var kopfArray = [];
    var halsArray = [];
    var oberkoerperArray = [];
    var handArray = [];
    var tailleArray = [];
    var beinArray = [];
    var fussArray = [];
    var ganzkoerperArray = [];

    var basiselementArray = [];/* new Array(100);
    for (var i = 0; i < 100; i++) {
        basiselementArray[i] = new Array(50);
    }*/
    $scope.basiselement = {};
    var relations = [];

    //$scope.drawAgain = drawAgain();

    jsPlumb.ready(function() {

        var plumbInstance = jsPlumb.getInstance();
        // your jsPlumb related init code goes here

    });

    var data =
    {
        "nodes": [
            {
                "id": "start",
                "type": "start",
                "text": "Start",
                "left": 50,
                "top": 50,
                "w": 100,
                "h": 70
            },
            {
                "id": "question1",
                "type": "question",
                "text": "Do Something?",
                "left": 290,
                "top": 79,
                "w": 150,
                "h": 150
            },
            {
                "id": "decide",
                "type": "action",
                "text": "Make Decision",
                "left": 660,
                "top": 187,
                "w": 120,
                "h": 120
            },
            {
                "id": "something",
                "type": "output",
                "text": "Do Something",
                "left": 827,
                "top": 414,
                "w": 120,
                "h": 50
            },
            {
                "id": "question2",
                "type": "question",
                "text": "Do Nothing?",
                "left": 74,
                "top": 330,
                "w": 150,
                "h": 150
            },
            {
                "id": "nothing",
                "type": "output",
                "text": "Do Nothing",
                "left": 433,
                "top": 558,
                "w": 100,
                "h": 50
            }
        ],
        "edges": [
            {
                "source": "start",
                "target": "question1",
                "data": {}
            },
            {
                "source": "question1",
                "target": "decide",
                "data": {
                    "label": "yes",
                    "type": "connection"
                }
            },
            {
                "source": "question1",
                "target": "question2",
                "data": {
                    "label": "no",
                    "type": "connection"
                }
            },
            {
                "source": "decide",
                "target": "nothing",
                "data": {
                    "label": "Can't Decide",
                    "type": "connection"
                }
            },
            {
                "source": "decide",
                "target": "something",
                "data": {
                    "label": "Decision Made",
                    "type": "connection"
                }
            },
            {
                "source": "question2",
                "target": "decide",
                "data": {
                    "label": "no",
                    "type": "connection"
                }
            },
            {
                "source": "question2",
                "target": "nothing",
                "data": {
                    "label": "yes",
                    "type": "connection"
                }
            }
        ]
    }
    ;

    var color = '#BFBFBF';
    // create an array with nodes
    var nodesArray = [
        {id: 161,  label: 'Kopf',       x: 0, y: 0,       basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 162,  label: 'Hals',       x: 0, y: 45,      basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 163,  label: 'Oberkörper', x: 0, y: 105,      basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 164,  label: 'Hand',       x: 45, y: 180,      basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 165,  label: 'Taille',     x: 0, y: 200,      basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 166,  label: 'Bein',       x: 0, y: 260,      basic: 1,  "fixed": { "x": true, "y": true }},
        {id: 167,  label: 'Fuß',        x: 0, y: 320,      basic: 1, "fixed": { "x": true, "y": true }},
        {id: 168,  label: 'Ganzkörper', x: 0, y: 400,      basic: 1,  "fixed": { "x": true, "y": true }}
    ];





    // create an array with edges
    var edgesArray = [
        {from: 168,   to: 167,  value: 3,   color: color},
        {from: 161,   to: 162,  value: 3,   color: color},
        {from: 162,   to: 163,  value: 3,   color: color},
        {from: 163,   to: 164,  value: 3,   color: color},
        {from: 163,   to: 165,  value: 3,   color: color},
        {from: 165,   to: 166,  value: 3,   color: color},
        {from: 166,   to: 167,  value: 3,   color: color}
    ];

    loadNetworkInformation();
/*
    network.on("selectNode", function(params) {
        if (params.nodes.length == 1) {
            if (network.isCluster(params.nodes[0]) == true) {
                network.openCluster(params.nodes[0]);
                setTimeout(function(){$log.debug("wait some time");
                }, 1000);

            }
        }
    });*/


    $scope.drawAgain= function(){
        var edges = new vis.DataSet(edgesArray);
        var nodes = new vis.DataSet(nodesArray);
        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {

                "height": "100%",
                "width": "100%",
                "interaction": {
                    "dragNodes":true,
                    "dragView": true,
                    "hideEdgesOnDrag": false,
                    "hideNodesOnDrag": false,
                    "hover": true,
                    "navigationButtons": true,
                    "selectable": true,
                    "selectConnectedEdges": true,
                    "tooltipDelay": 300,
                    "zoomView": true

                },
                "nodes": {
                    "shape": "box",
                    "color": {
                        "border" : "#2B7CE9",
                        "background" : "#97C2FC",
                        "highlight": {
                            "border": "#2B7CE9",
                            "background": "#D2E5FF"
                        }
                    }
                },
                "edges": {
                    "font": {
                        "size": 10

                    },
                    "scaling": {
                        "label": {
                            "min": 8,
                            "max": 15
                        }
                    },
                    "shadow": {
                        "enabled": true
                    }
                },
                "physics": {
                    "barnesHut": {
                        "springLength": 45

                    }
                }
            }


            ;
        network = new vis.Network(container, data, options);
        //$window.location.reload();
    };

    $scope.doTheDraw = function(){
        //network.destroy();

       network = new vis.Network(container, data, options);
        network.on("selectNode", function(params) {
        if (params.nodes.length == 1) {
        if (network.isCluster(params.nodes[0]) == true) {

        network.openCluster(params.nodes[0]);
        }
        }
        });
       // network.redraw();
        $log.debug("nodes " + JSON.stringify(nodes));
        $log.debug("edges " + JSON.stringify(edges));
        $log.debug("data " + JSON.stringify(data));

    };

    $scope.clusterByBasic = function() {
        network.setData(data);
        var clusterOptionsByData = {
            joinCondition:function(childOptions) {
                return childOptions.basic == 1;
            },
            clusterNodeProperties: {id:'BodyCluster', label: 'Körper', shape:'image' ,   "image": "/images/femaleForm_transparent.png"}
        };
        network.cluster(clusterOptionsByData);
    };

    function loadNetworkInformation() {
        var defered = $q.defer();
        var ix = 300;
        var iy = 0;
        $scope.selectedCostume = dbREST.Kostueme.get({filmId: $scope.filmIDInput, rollenId: $scope.rollenIDInput, kostuemId: $scope.kostuemIDInput});
        $scope.selectedCostume.$promise.then(function () {

            $scope.selectedCostume.KostuemBasiselemente.forEach(function (BE) {
                //Costume loaded, now read Baseelements and save in nodes
                dbREST.BasiselementLink.get({basiselementId: BE.Basiselementname}, "", function (value) {
                    //   $log.debug("Basiselementname " + BE.Basiselementname);
                    $scope.basiselement.id = BE.BasiselementID;
                    //basiselementArray.push(BE.BasiselementID);
                    $scope.temp = JSON.stringify(value.link);
                    $scope.temp = $scope.temp.substring(1, $scope.temp.length - 1);
                }, function (err) {
                    $log.debug(JSON.stringify(err));
                    //If Image can't be found, deliver empty image URL
                    $scope.temp = "";
                }).$promise.then(function () {
                        $log.debug("ID " + BE.BasiselementID + " Link " + $scope.temp);
                        // Workaround

                        relations = [];
                        // read the Relation and save in edges
                        for (var j = 0; j < BE.BasiselementRelationen.length; j++) {
                            var br = BE.BasiselementRelationen[j];
                            var from = br.ObjektBasiselement;
                            var to = br.SubjektBasiselement;
                            var label = br.PraedikatBasiselement;
                            if(BE.BasiselementID == from) {
                                relations.push(to);
                            }
                            if(BE.BasiselementID == to) {
                                relations.push(from   );
                            }
                            //safeBodyAttachments(from, to);

                               edgesArray.push({
                             "from": from,
                             "to": to,
                             "label": label

                             });
                        /*    edges.add([{
                                "from": from,
                                "to": to,
                                "label": label

                            }]);*/

                            // $log.debug("ID " + BE.BasiselementID + " label " + label);
                        }

                        $scope.basiselement.relations = relations;
                        basiselementArray.push($scope.basiselement);

                        $log.debug("Party "+JSON.stringify($scope.basiselement.id));
                        $log.debug("relations "+JSON.stringify($scope.basiselement.relations));
                        $log.debug("array "+JSON.stringify(basiselementArray));
                      /*  if(nodes.get(BE.BasiselementID) == null)  //&& nodes.get(label: BE.Basiselementname) == null)
                        {

                        nodes.add([{
                                "id": BE.BasiselementID,
                                "label": BE.Basiselementname,
                                "image": $scope.temp,
                                "brokenImage": "/images/Fragezeichen.png",
                                "shape": "image"
                            }]
                        )}*/
                        nodesArray.push({
                                "id": BE.BasiselementID,
                                "label": BE.Basiselementname,
                                "image": $scope.temp,
                                "brokenImage": "/images/Fragezeichen.png",
                                "shape": "image",
                                x: ix,
                                y: iy,
                                "fixed": { "x": true, "y": true }
                            }
                        );

                      //  ix +=60;
                      //  iy -=60;
                        $scope.basiselement = {};
                    });


            });
        }).catch(function (reason) {
            $log.debug(reason);
            defered.reject();

        });



        defered.resolve("Got Value");
      //  $scope.sortGraphElements();
        return defered.promise;
    }





      $scope.sortGraphElements = function(){

        deleteDuplicates();
        basiselementArray.forEach( function(value){
            $log.debug("value "+JSON.stringify(value));
            var bing = value.id;
            var height = 400;
            value.relations.forEach(function(to){
                if(to == 161){
                    kopfArray.push(bing);
                    height = 0;
                }
                if(to == 162){
                    halsArray.push(bing);
                    height = 45;
                }
                if(to == 163){
                    oberkoerperArray.push(bing);
                    height = 105;
                }
                if(to == 164){
                    handArray.push(bing);
                    height = 180;
                }
                if(to == 165){
                    tailleArray.push(bing);
                    height = 200;
                }
                if(to == 166){
                    beinArray.push(bing);
                    height = 260;
                }
                if(to == 167){
                    fussArray.push(bing);
                    height = 320;
                }
                if(to == 168){
                    ganzkoerperArray.push(bing);
                    height = 400;
                }
                setY(nodesArray, "id", value.id, height);
                height = 400;
            })
        });
    /*    $log.debug("kopf "+JSON.stringify(kopfArray));
        $log.debug("hals "+JSON.stringify(halsArray));
          $log.debug("oberkoerper "+JSON.stringify(oberkoerperArray));
          $log.debug("hand "+JSON.stringify(handArray));
          $log.debug("taille "+JSON.stringify(tailleArray));
          $log.debug("bein "+JSON.stringify(beinArray));
          $log.debug("fuss "+JSON.stringify(fussArray));
          $log.debug("ganzkoerper "+JSON.stringify(ganzkoerperArray));*/

          setEmpty(nodesArray);
          setX(kopfArray, nodesArray);
          setX(halsArray, nodesArray   );
          setX(oberkoerperArray, nodesArray);
          setX(handArray, nodesArray);
          setX(tailleArray, nodesArray);
          setX(beinArray, nodesArray);
          setX(fussArray, nodesArray);
          setX(ganzkoerperArray, nodesArray);

          $log.debug("Gesamt array: " + JSON.stringify(nodesArray));
    };


    function setY(arr, propName, propValue, y) {
        for (var i=0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                arr[i].y = y;

        // will return undefined if not found; you could return a default instead
    }

    function setX(koerperArr, arr) {
        var x = 90;
        for(var j = 0;j<koerperArr;j++) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]["id"] == koerperArr[j])
                    arr[i].x = x;
            }
            x+=60;
        }
    }

    function setEmpty(arr) {
        var x = 200;
        var y = 500;

        basiselementArray.forEach( function(value) {
            $log.debug("value " + JSON.stringify(value));
            var id = value.id;
            if (value.relations.keys({}).length = 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]["id"] == id)
                        arr[i].x = x;
                        arr[i].y = y;
                }
                x += 60;
            }
        })
    }

    function deleteDuplicates() {

        for (var j = 0; j < nodesArray.length; j++) {
            var label = nodesArray[j].label;
            var count = 0;
            console.log("label: " + label);
            for (var i = 0; i < nodesArray.length; i++) {
                if (nodesArray[i]["label"] == label) {
                    if (count == 1) {
                        nodesArray.splice(i, 1);
                        console.log("label found: " + label);
                    }
                    if (count == 0) {
                        count++;
                    }
                }
            }
            count = 0;
        }
    }


    $scope.loadNetwork = function ()
    {
        loadNetworkInformation();

        //promise.succes(function(){ $scope.draw()});


    };

    //"solver": "hierarchicalRepulsion"

 /*   $scope.loadNetworkInformation = function() {
        $scope.selectedCostume = dbREST.Kostueme.get({filmId: 55, rollenId: 1, kostuemId: 14});
        $scope.selectedCostume.$promise.then(function () {

            $scope.selectedCostume.KostuemBasiselemente.forEach(function (BE) {
                //Costume loaded, now read Baseelements and save in nodes
                dbREST.BasiselementImageFileName.get({basiselementId: BE.Basiselementname}, "", function (value) {
                    $scope.temp = JSON.stringify(value.Filename);
                    $scope.temp = $scope.temp.substring(1, $scope.temp.length - 1);
                    $scope.temp = $scope.path.concat($scope.temp);
                }, function (err) {
                    $log.debug(JSON.stringify(err));
                }).$promise.then(function () {
                        $log.debug("ID " + BE.BasiselementID + " Image " + $scope.temp);

                        nodes.push({
                                "id": BE.BasiselementID,
                                "label": BE.Basiselementname,
                                "image": $scope.temp,
                                "brokenImage": "/logo.jpg",
                                "shape": "image"
                            }
                        );
                    });
                // read the Relation and save in edges
                for (var j = 0; j < BE.BasiselementRelationen.length; j++) {
                    var br = BE.BasiselementRelationen[j];
                    var from = br.ObjektBasiselement;
                    var to = br.SubjektBasiselement;
                    var label = br.PraedikatBasiselement;

                    edges.push({
                        "from": from,
                        "to": to,
                        "label": label

                    });
                    $log.debug("ID " + BE.BasiselementID + " label " + label);
                }
            });
        }).catch(function (reason) {
            $log.debug(reason);

        });
    };*/

 /*   function loadNetworkInformation() {
        var deffered = $q.defer();
            $scope.selectedCostume = dbREST.Kostueme.get({filmId: $scope.filmIDInput, rollenId: $scope.rollenIDInput, kostuemId: $scope.kostuemIDInput});
            $scope.selectedCostume.$promise.then(function () {

                $scope.selectedCostume.KostuemBasiselemente.forEach(function (BE) {
                    //Costume loaded, now read Baseelements and save in nodes
                    dbREST.BasiselementImageFileName.get({basiselementId: BE.Basiselementname}, "", function (value) {
                        $log.debug("Basiselementname " + BE.Basiselementname);
                        $scope.temp = JSON.stringify(value.Filename);
                        $scope.temp = $scope.temp.substring(1, $scope.temp.length - 1);
                        $scope.temp = $scope.path.concat($scope.temp);
                    }, function (err) {
                        $log.debug(JSON.stringify(err));
                        $scope.temp = "";
                    }).$promise.then(function () {
                            $log.debug("ID " + BE.BasiselementID + " Image " + $scope.temp);
                            // Workaround


                            nodes.push({
                                    "id": BE.BasiselementID,
                                    "label": BE.Basiselementname,
                                    "image": $scope.temp,
                                    "brokenImage": "/logo.jpg",
                                    "shape": "image"
                                }
                            );
                        });
                    // read the Relation and save in edges
                    for (var j = 0; j < BE.BasiselementRelationen.length; j++) {
                        var br = BE.BasiselementRelationen[j];
                        var from = br.ObjektBasiselement;
                        var to = br.SubjektBasiselement;
                        var label = br.PraedikatBasiselement;

                        edges.push({
                            "from": from,
                            "to": to,
                            "label": label

                        });
                        $log.debug("ID " + BE.BasiselementID + " label " + label);
                    }
                });
            }).catch(function (reason) {
                $log.debug(reason);
                deffered.reject();

            });
            deffered.resolve("Got Value");
        return deffered.promise;
        }*/


$scope.test = function() {
        dbREST.BasiselementLink.get({basiselementId: "dfd"}, "", function (value) {

        //    $scope.temp = JSON.stringify(value.Image);
            $scope.temp = JSON.stringify(value.link);
            $log.debug("Basiselementname " + $scope.temp);
            //$scope.temp = $scope.temp.substring(1, $scope.temp.length - 1);
            //$scope.temp = $scope.path.concat($scope.temp);
        }, function (err) {
            $log.debug(JSON.stringify(err));
            //$scope.temp = "";
        });
    }




}]);