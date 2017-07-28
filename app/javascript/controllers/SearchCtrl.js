/**
 * Created by falkenml on 19.11.2014.
 */

'use strict';
/**
 * SearchCtrl
 */
angular.module('MUSE').controller('SearchCtrl', ['$scope', 'dbREST', '$routeParams', '$route','$location', '$log', '$window' , function ($scope, dbREST, $routeParams, $route, $location, $log, $window) {

    $scope.selectables = dbREST.selectables;
    $scope.basiselementIDInput='';
    $scope.teilelementIDInput='';
    $scope.notAvailable = "";
    $scope.notAvailable2 = "";
    $scope.emptyRelations = {
        relations : []
    };
    $scope.film= "";
    $scope.kostuem= "";
    $scope.rolle= "";

    // for costume graph
    $scope.filmIDInput = '';
    $scope.rollenIDInput ='';
    $scope.kostuemIDInput ='';
    $scope.costumeSet = false;
    $scope.costumeData = {};

    //Workarround for Authentication
    firstCheck();
    function firstCheck()
    {
        try{
           $scope.test= dbREST.Filme.get({filmId: 46});
        }
        catch (Exception ){}

    }

    $scope.openCostumeInNewTab = function() {
        $window.open($location.protocol() + '://' + $location.host() + "#/filme/" + $scope.filmIDInput + "/rollen/" + $scope.rollenIDInput + "/kostueme/" + $scope.kostuemIDInput);
    };

    $scope.navigateToCostume = function()
    {
        try {
            $scope.selectedCostume = dbREST.Kostueme.get({
                    filmId: $scope.filmIDInput,
                    rollenId: $scope.rollenIDInput,
                    kostuemId: $scope.kostuemIDInput
                }, function(value)
                {
                    if(value.FilmID !== undefined )
                    {
                        $scope.goToPath("/filme/" + $scope.filmIDInput + "/rollen/" + $scope.rollenIDInput + "/kostueme/" + $scope.kostuemIDInput);
                    }}
                ,function error ()
                {
                    $scope.notAvailable = true;
                });
        }
        catch (Exception){}
    };

    $scope.navigateToCostumeThroughBE = function()
    {
        $scope.kostuembasiselemente = $scope.selectables.kostuembasiselemente;
        $scope.kostuembasiselemente.forEach(
            function (auflistung) {
                if(auflistung.BasiselementID === $scope.basiselementIDInput)
                {
                    $scope.film = auflistung.FilmID;
                    $scope.kostuem = auflistung.KostuemID;
                    $scope.rolle = auflistung.RollenID;
                }
            }
        );
        if($scope.film !== "" || $scope.rolle !== "" || $scope.kostuem !== "") {
            $scope.goToPath("/filme/" + $scope.film + "/rollen/" + $scope.rolle + "/kostueme/" + $scope.kostuem);
        }
        else
        {
            $scope.notAvailable2 =  true;
        }
    };


    //Wenn die Seite verlassen wird, resette die scopes
    $scope.$on('$locationChangeStart', function() {
        $scope.resetValues();
    });

    $scope.resetValues = function ()
    {
        $scope.filmIDInput = '';
        $scope.rollenIDInput ='';
        $scope.kostuemIDInput ='';
        $scope.basiselementIDInput='';
        $scope.teilelementIDInput='';
        $scope.film= "";
        $scope.kostuem= "";
        $scope.rolle= "";
        $scope.notAvailable= "";
        $scope.notAvailable2= "";

    };

    $scope.goToPath = function(hash)
    {
        $location.path(hash);
    };

    $scope.searchRelations = function()
    {
        dbREST.GetEmptyBasiselementRelation.query( "", function (value) {
                value = arrUnique(value);
                value.sort(function(a,b) { return parseFloat(a.BasiselementID) - parseFloat(b.BasiselementID)});
                var count = 1;
                value.forEach(function (a){
                    $scope.emptyRelations.relations.push({Count :  count, BE :  a.BasiselementID});
                    count++;
                });
        },
            function (err) {
            $log.debug(JSON.stringify(err));
        }
        );


    };
    function arrUnique(arr) {
        var cleaned = [];
        arr.forEach(function(itm) {
            var unique = true;
            cleaned.forEach(function(itm2) {
                if (_.isEqual(itm, itm2)) unique = false;
            });
            if (unique)  cleaned.push(itm);
        });
        return cleaned;
    }


    // select the next costume and load it
    $scope.nextCostume = function() {
        var costumeIDindex = 1 + $scope.costumeData[$scope.filmIDInput][$scope.rollenIDInput].indexOf($scope.kostuemIDInput);
        if (costumeIDindex === $scope.costumeData[$scope.filmIDInput][$scope.rollenIDInput].length) {
            costumeIDindex = -1;
        }
        if (costumeIDindex >= 0) {
            $scope.kostuemIDInput = $scope.costumeData[$scope.filmIDInput][$scope.rollenIDInput][costumeIDindex];
        } else {
            var roleID = (parseInt($scope.rollenIDInput, 10) + 1).toString();
            if (roleID in $scope.costumeData[$scope.filmIDInput]) {
                $scope.rollenIDInput = roleID;
                $scope.roleSelectionChanged();
            } else {
                var filmID = (parseInt($scope.filmIDInput, 10) + 1).toString();
                if (filmID in $scope.costumeData) {
                    $scope.filmIDInput = filmID;
                    $scope.filmSelectionChanged();
                } else {
                    return;
                }
            }
        }
    };


    // handle changes in costume selection

    $scope.filmSelectionChanged = function() {
        if (!($scope.filmIDInput in $scope.costumeData)) {
            var smallest = undefined;
            for (var key in $scope.costumeData) {
                if ($scope.costumeData.hasOwnProperty(key)) {
                    if (! smallest || parseInt(smallest, 10) > parseInt(key, 10)) {
                        smallest = key;
                    }
                }
            }
            $scope.filmIDInput = smallest;
        }
        $scope.roleSelectionChanged(true);
    };

    $scope.roleSelectionChanged = function(reset) {
        if (reset || !($scope.rollenIDInput in $scope.costumeData[$scope.filmIDInput])) {
            var smallest = undefined;
            for (var key in $scope.costumeData[$scope.filmIDInput]) {
                if ($scope.costumeData[$scope.filmIDInput].hasOwnProperty(key)) {
                    if (! smallest || parseInt(smallest, 10) > parseInt(key, 10)) {
                        smallest = key;
                    }
                }
            }
            $scope.rollenIDInput = smallest;
        }
        var smallest = undefined;
        $scope.costumeData[$scope.filmIDInput][$scope.rollenIDInput].forEach( function (key) {
            if (! smallest || smallest > key) {
                smallest = key;
            }
        });
        $scope.kostuemIDInput = smallest;
    };

    // automatic beid from click in graph
    $scope.beClicked = function (be) {
        $scope.$apply(function () {
            $scope.basiselementIDInput = be;
        });
    };


    // load costume data
    var costumes = dbREST.Costumes.query();

    costumes.$promise.then(function (result) {
        result.forEach(function (x) {
            var filmID = x.FilmID.toString();
            var roleID = x.RollenID.toString();
            var costumeID = x.KostuemID;
            if (! (filmID in $scope.costumeData)) {
                $scope.costumeData[filmID] = {};
            }
            if (! (roleID in $scope.costumeData[filmID])) {
                $scope.costumeData[filmID][roleID] = [];
            }
            $scope.costumeData[filmID][roleID].push(x.KostuemID);
        });
        $scope.filmIDInput = result[0].FilmID.toString();
        $scope.rollenIDInput = result[0].RollenID.toString();
        $scope.kostuemIDInput = result[0].KostuemID;
    });



}]);