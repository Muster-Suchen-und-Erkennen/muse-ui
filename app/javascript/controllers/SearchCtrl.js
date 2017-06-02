/**
 * Created by falkenml on 19.11.2014.
 */

'use strict';
/**
 * SearchCtrl
 */
angular.module('MUSE').controller('SearchCtrl', ['$scope', 'dbREST', '$routeParams', '$route','$location', '$log' , function ($scope, dbREST, $routeParams, $route, $location, $log) {

    $scope.selectables = dbREST.selectables;
    $scope.filmIDInput = '';
    $scope.rollenIDInput ='';
    $scope.kostuemIDInput ='';
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

    //Workarround for Authentication
    firstCheck();
    function firstCheck()
    {
        try{
           $scope.test= dbREST.Filme.get({filmId: 46});
        }
        catch (Exception ){}

    }

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



}]);