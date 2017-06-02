/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * CostumeCtrl
 */
angular.module('MUSE').controller('CostumeCtrl', ['$scope', '$timeout', '$interval', 'dbREST', '$routeParams', '$route', '$upload', '$log', '$filter', 'ValidationService', 'ValidationFunctions', 'EntityFactory', '$q', function ($scope, $timeout, $interval, dbREST, $routeParams, $route, $upload, $log, $filter, ValidationService, ValidationFunctions, EntityFactory, $q) {

    $scope.selectables = dbREST.selectables;
    $scope.isCollapsed = false;
    $scope.film = dbREST.Filme.get({filmId: $routeParams.filmId});
    $scope.role = dbREST.Rollen.get({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId});
    $scope.selectedScreenshot = {};
    $scope.selectedScreenshotData = '';
    $scope.screenshotIndex = 0;
    $scope.loadingScreenshots = true;
    $scope.uploading = false;
    $scope.fadeIn = true;
    $scope.fadeOut = false;
    $scope.savedProperly = false;
    $scope.selectedBasiselement = {};
    $scope.selectedTeilelement = {};
    $scope.routeParams = $routeParams;
    $scope.basiselementRelations = [];
    $scope.baseelementObjects = [];
    $scope.preparedKoerperteile = [];
    $scope.tempTeilelemente = [];
    $scope.tempSingleTeilelement = {};
    $scope.teilelementeDuplicateCheck = {};
    $scope.unsavedData = false;

    $scope.selectedCostume = dbREST.Kostueme.get({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId});
    $scope.selectedCostumeCopy = {}
    $scope.selectedCostume.$promise.then(function(result) {
        //copy costume data for later comparison
        angular.copy($scope.selectedCostume, $scope.selectedCostumeCopy);
        //add watcher to track changes
        $interval(compareCostumes, 1000);
        resetUnsavedData();
        //sort BEs
        $scope.selectedCostume.KostuemBasiselemente.sort(function(a, b){return a.BasiselementID > b.BasiselementID ? 1 : ((b.BasiselementID > a.BasiselementID) ? -1 : 0);});
        //Costume loaded, now prepare basiselementRelations list
        for(var i = 0; i < $scope.selectedCostume.KostuemBasiselemente.length; i++){
            var b = $scope.selectedCostume.KostuemBasiselemente[i];
            $scope.baseelementObjects.push(b);
            for(var j = 0; j < b.BasiselementRelationen.length; j++){
                var br = b.BasiselementRelationen[j];
                var save = true;
                for(var k = 0; k < $scope.basiselementRelations.length; k++){
                    var r = $scope.basiselementRelations[k];

                    if((br.SubjektBasiselement === r.SubjektBasiselement) && (br.PraedikatBasiselement === r.PraedikatBasiselement) && (br.ObjektBasiselement === r.ObjektBasiselement)){
                        save = false;
                        break;
                    }
                }
                if(save){
                    $scope.basiselementRelations.push(br);
                }
            }
            fixBasiselementRelations();
        }
    }).catch(function(reason){
        $log.debug(reason);
    });

    $scope.selectables.koerperteile.$promise.then(function(koerperteile){
        koerperteile.forEach(function(koerperteil){
            $scope.baseelementObjects.push({BasiselementID: koerperteil.BasiselementID, Basiselementname: koerperteil.Koerperteilname, koerperteil: true});
        });
    });

    $scope.costumeValidator = ValidationService.getNewInstance();
    function prepareCostumeValidation(validator) {
        $scope.timecodeValidator = validator.addValidationConstraint($scope, 'selectedCostume.KostuemTimecodes', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.Ortsbegebenheit', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedCostume.StereotypRelevant', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemCharaktereigenschaften', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemTageszeiten', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemSpielorte', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemAlterseindruecke', ValidationFunctions.ArrayLengthGTZero);
    }
    prepareCostumeValidation($scope.costumeValidator);

    $scope.beValidator = ValidationService.getNewInstance();
    function prepareBEValidation(validator){
        validator.addValidationConstraint($scope, 'selectedBasiselement.Basiselementname', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedBasiselement.BasiselementDesigns', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedBasiselement.BasiselementMaterialien', ValidationFunctions.ArrayLengthGTZero); //Todo show in ui
        validator.addValidationConstraint($scope, 'selectedBasiselement.BasiselementFarben', ValidationFunctions.ArrayLengthGTZero); //Todo show in ui
    }
    prepareBEValidation($scope.beValidator);

    $scope.teValidator = ValidationService.getNewInstance();
    function prepareTEValidation(validator){
        validator.addValidationConstraint($scope, 'selectedTeilelement.Teilelementname', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedTeilelement.TeilelementDesigns', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedTeilelement.TeilelementMaterialien', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedTeilelement.TeilelementFarben', ValidationFunctions.ArrayLengthGTZero);
    }
    prepareTEValidation($scope.teValidator);

    /**
     * Compares the stored costume data against the edited costume data.
     * And updates unsavedData change
     *
     * @param {any} scope
     * @returns true if any data has changed
     */
    function compareCostumes() {
        var changes = false;
        var oldC = $scope.selectedCostumeCopy;
        var newC = $scope.selectedCostume;

        if (! oldC) {
            return changes;
        }

        if (! newC) {
            return changes;
        }

        function compareArray(oldA, newA, keys) {
            if (oldA.length !== newA.length) {
                return true;
            }
            if (keys) {
                keys.forEach(function(key) {
                    for (var index = 0; index < oldA.length; index++) {

                        if (oldA[index][key] !== newA[index][key]) {
                            return true;
                        }
                    }
                });
            } else {
                for (var index = 0; index < oldA.length; index++) {
                    if (oldA[index] !== newA[index]) {
                        return true;
                    }
                }
            }
            return false;
        }

        changes += oldC.Szenenbeschreibung !== newC.Szenenbeschreibung;
        changes += oldC.Kostuemkurztext !== newC.Kostuemkurztext;
        changes += oldC.Ortsbegebenheit !== newC.Ortsbegebenheit;
        changes += oldC.DominanteFarbe !== newC.DominanteFarbe;
        changes += oldC.DominanteFunktion !== newC.DominanteFunktion;
        changes += oldC.DominanterZustand !== newC.DominanterZustand;
        changes += oldC.StereotypRelevant !== newC.StereotypRelevant;
        changes += compareArray(oldC.KostuemAlterseindruecke, newC.KostuemAlterseindruecke, ['Alterseindruck', 'NumAlter']);
        changes += compareArray(oldC.KostuemCharaktereigenschaften, newC.KostuemCharaktereigenschaften);
        changes += compareArray(oldC.KostuemKoerpermodifikationen, newC.KostuemKoerpermodifikationen);
        changes += compareArray(oldC.KostuemSpielorte, newC.KostuemSpielorte, ['Spielort', 'SpielortDetail']);
        changes += compareArray(oldC.KostuemSpielzeiten, newC.KostuemSpielzeiten, ['Spielzeit', 'SpielzeitVon', 'SpielzeitBis']);
        changes += compareArray(oldC.KostuemTageszeiten, newC.KostuemTageszeiten);
        changes += compareArray(oldC.KostuemTimecodes, newC.KostuemTimecodes, ['Timecodeanfang', 'Timecodeende']);

        if (changes) {
            setUnsavedData();
        } else {
            resetUnsavedData();
        }

        //return changes;
    }

    function setUnsavedData() {
        $scope.unsavedData = true;
    }

    function resetUnsavedData() {
        $scope.unsavedData = false;
    }

    //Todo shouldn't we use a function operating on local BEs instead of doing many http gets?
    function fixBasiselementRelations(){
        $scope.basiselementRelations.forEach(function(relation){
            prepareBasiselementRelation(relation);
        });
    }

    $scope.loadValuesFromBE = function(basiselementID){
        dbREST.QueryBasiselement.get({basiselementId: basiselementID}).$promise.then(function(result){
            if(result.BasiselementID == basiselementID){
                $scope.selectedBasiselement.Basiselementname = result.Basiselementname;
                $scope.selectedBasiselement.BasiselementDesigns = result.BasiselementDesigns;
                $scope.selectedBasiselement.BasiselementFarben = result.BasiselementFarben;
                $scope.selectedBasiselement.BasiselementFormen = result.BasiselementFormen;
                $scope.selectedBasiselement.BasiselementMaterialien = result.BasiselementMaterialien;
                $scope.selectedBasiselement.BasiselementTrageweisen = result.BasiselementTrageweisen;
                $scope.selectedBasiselement.BasiselementZustaende = result.BasiselementZustaende;
                $scope.selectedBasiselement.BasiselementFunktionen = result.BasiselementFunktionen;
            }
        });
    };

    $scope.loadValuesFromBEWithTE = function(basiselementID){
        dbREST.QueryBasiselement.get({basiselementId: basiselementID}).$promise.then(function(result){
            if(result.BasiselementID == basiselementID){
                $scope.selectedBasiselement.Basiselementname = result.Basiselementname;
                $scope.selectedBasiselement.BasiselementDesigns = result.BasiselementDesigns;
                $scope.selectedBasiselement.BasiselementFarben = result.BasiselementFarben;
                $scope.selectedBasiselement.BasiselementFormen = result.BasiselementFormen;
                $scope.selectedBasiselement.BasiselementMaterialien = result.BasiselementMaterialien;
                $scope.selectedBasiselement.BasiselementTrageweisen = result.BasiselementTrageweisen;
                $scope.selectedBasiselement.BasiselementZustaende = result.BasiselementZustaende;
                $scope.selectedBasiselement.BasiselementFunktionen = result.BasiselementFunktionen;
                $scope.selectedBasiselement.BasiselementTeilelemente = result.BasiselementTeilelemente;
                $scope.selectedBasiselement.BasiselementTeilelemente.forEach(function(value){
                    $scope.loadValuesFromTEForTETemp(value.TeilelementID);
                });
            }
        });
    };

    $scope.loadValuesFromTE = function(teilelementID){
        dbREST.QueryTeilelement.get({teilelementId: teilelementID}).$promise.then(function(result){
            if(result.TeilelementID == teilelementID){
                $scope.selectedTeilelement.Teilelementname = result.Teilelementname;
                $scope.selectedTeilelement.TeilelementDesigns = result.TeilelementDesigns;
                $scope.selectedTeilelement.TeilelementFarben = result.TeilelementFarben;
                $scope.selectedTeilelement.TeilelementFormen = result.TeilelementFormen;
                $scope.selectedTeilelement.TeilelementMaterialien = result.TeilelementMaterialien;
                $scope.selectedTeilelement.TeilelementTrageweisen = result.TeilelementTrageweisen;
                $scope.selectedTeilelement.TeilelementZustaende = result.TeilelementZustaende;
            }
        });
    };

    $scope.loadValuesFromTEForTETemp = function(teilelementID){
        $scope.tempSingleTeilelement = EntityFactory.getNewPrimitiveInstance();
        dbREST.QueryTeilelement.get({teilelementId: teilelementID}).$promise.then(function(result){
            if(result.TeilelementID == teilelementID && !(result.TeilelementID in $scope.teilelementeDuplicateCheck)){
                $scope.teilelementeDuplicateCheck[result.TeilelementID] = result.TeilelementID;
                $scope.tempSingleTeilelement.Teilelementname = result.Teilelementname;
                $scope.tempSingleTeilelement.TeilelementDesigns = result.TeilelementDesigns;
                $scope.tempSingleTeilelement.TeilelementFarben = result.TeilelementFarben;
                $scope.tempSingleTeilelement.TeilelementFormen = result.TeilelementFormen;
                $scope.tempSingleTeilelement.TeilelementMaterialien = result.TeilelementMaterialien;
                $scope.tempSingleTeilelement.TeilelementTrageweisen = result.TeilelementTrageweisen;
                $scope.tempSingleTeilelement.TeilelementZustaende = result.TeilelementZustaende;
                $scope.tempTeilelemente.push($scope.tempSingleTeilelement);
                $scope.tempSingleTeilelement = EntityFactory.getNewPrimitiveInstance();

            }
        });
    };


    function prepareBasiselementRelation(relation){
        dbREST.QueryBasiselement.get({basiselementId: relation.SubjektBasiselement}).$promise.then(function(beSubjekt){
            relation.SubjectCaption = beSubjekt.Basiselementname;
            dbREST.QueryBasiselement.get({basiselementId: relation.ObjektBasiselement}).$promise.then(function(beObjekt){
                relation.ObjectCaption = beObjekt.Basiselementname;
            });
        });
    }

    function reloadCostumeHeadData(){
        $scope.selectedCostume = dbREST.Kostueme.get({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId});
    }

    $scope.resetSelectedBasiselement = function(){
        var beID = $scope.selectedBasiselement.BasiselementID === 'new' ? 'new' : $scope.selectedBasiselement.BasiselementID;
        $scope.selectedBasiselement = EntityFactory.getNewBaseelementInstance();
        $scope.selectedBasiselement.BasiselementID = beID;
    };

    $scope.resetSelectedTeilelement = function(){
        var teID = $scope.selectedTeilelement.TeilelementID === 'new' ? 'new' : $scope.selectedTeilelement.TeilelementID;
        $scope.selectedTeilelement = EntityFactory.getNewPrimitiveInstance();
        $scope.selectedTeilelement.TeilelementID = teID;
    };

    $scope.reloadPage = function(){
        $route.reload();
    };

    $scope.showCreateBasiselementModal = function () {
        $scope.initTempValues();
        $scope.initSelectedBasiselement();
    };
    $scope.showBasiselementDetailsModal = function (b) {
        $scope.initTempValues();
        $scope.setSelectedBasiselement(b);
    };
    $scope.showBasiselementDeleteModal = function (b) {
        $scope.setSelectedBasiselement(b);
    };
    $scope.setSelectedBasiselement = function (b) {
        $scope.selectedBasiselement = b;
    };
    $scope.initSelectedBasiselement = function () {
        $scope.selectedBasiselement = EntityFactory.getNewBaseelementInstance();
        if(($scope.selectedCostume.DominanteFunktion !== '') && ($scope.selectedCostume.DominanteFunktion !== null)){$scope.selectedBasiselement.BasiselementFunktionen.push($scope.selectedCostume.DominanteFunktion);}
        if(($scope.selectedCostume.DominanterZustand !== '') && ($scope.selectedCostume.DominanterZustand !== null)){$scope.selectedBasiselement.BasiselementZustaende.push($scope.selectedCostume.DominanterZustand);}
        if($scope.selectedCostume.KostuemBasiselemente.length > 0){
            $scope.selectedBasiselement.BasiselementDesigns = [].concat($scope.selectedCostume.KostuemBasiselemente[$scope.selectedCostume.KostuemBasiselemente.length - 1].BasiselementDesigns);
            $scope.selectedBasiselement.BasiselementFarben = [].concat($scope.selectedCostume.KostuemBasiselemente[$scope.selectedCostume.KostuemBasiselemente.length - 1].BasiselementFarben);
            $scope.selectedBasiselement.BasiselementFormen = [].concat($scope.selectedCostume.KostuemBasiselemente[$scope.selectedCostume.KostuemBasiselemente.length - 1].BasiselementFormen);
            $scope.selectedBasiselement.BasiselementMaterialien = [].concat($scope.selectedCostume.KostuemBasiselemente[$scope.selectedCostume.KostuemBasiselemente.length - 1].BasiselementMaterialien);
            $scope.selectedBasiselement.BasiselementTrageweisen = [].concat($scope.selectedCostume.KostuemBasiselemente[$scope.selectedCostume.KostuemBasiselemente.length - 1].BasiselementTrageweisen);
        }
    };
    $scope.showCreateTeilelementModal = function (b) {
        $scope.initTempValues();
        $scope.setSelectedBasiselement(b);
        $scope.initSelectedTeilelement();
    };
    $scope.showTeilelementDetailsModal = function (b, t) {
        $scope.initTempValues();
        $scope.setSelectedBasiselement(b);
        $scope.setSelectedTeilelement(t);
    };
    $scope.showTeilelementDeleteModal = function (b, t) {
        $scope.setSelectedBasiselement(b);
        $scope.setSelectedTeilelement(t);
    };
    $scope.setSelectedTeilelement = function (t) {
        $scope.selectedTeilelement = t;
    };
    $scope.initSelectedTeilelement = function () {
        $scope.selectedTeilelement = EntityFactory.getNewPrimitiveInstance();
        $scope.selectedTeilelement.TeilelementDesigns = [].concat($scope.selectedBasiselement.BasiselementDesigns);
        $scope.selectedTeilelement.TeilelementFarben = [].concat($scope.selectedBasiselement.BasiselementFarben);
        $scope.selectedTeilelement.TeilelementFormen = [].concat($scope.selectedBasiselement.BasiselementFormen);
        $scope.selectedTeilelement.TeilelementMaterialien = [].concat($scope.selectedBasiselement.BasiselementMaterialien);
        $scope.selectedTeilelement.TeilelementTrageweisen = [].concat($scope.selectedBasiselement.BasiselementTrageweisen);
        $scope.selectedTeilelement.TeilelementZustaende = [].concat($scope.selectedBasiselement.BasiselementZustaende);
    };

    $scope.initTempValues = function(){
        /**
        $scope.tempSubject = '';
        $scope.tempOperator = '';
        $scope.tempObject = '';
        $scope.beTempSubject = '';
        $scope.beTempOperator = '';
        $scope.beTempObject = '';
        $scope.tempColour = '';
        $scope.tempColourImpression = '';
        $scope.tempMaterial= '';
        $scope.tempMaterialImpression = '';
        */
    };

    $scope.addRelation = function(subjectId, operator, objectId){
        var save = true;
        if(subjectId !== objectId){
            for(var i = 0; i < $scope.basiselementRelations.length; i++){
                if($scope.basiselementRelations[i].SubjektBasiselement == subjectId && $scope.basiselementRelations[i].PraedikatBasiselement === operator && $scope.basiselementRelations[i].ObjektBasiselement == objectId){
                    save = false;
                    break;
                }
            }
        }else{
            save = false;
        }
        if(save){
            $scope.states.loading = true;
            var triple = {SubjektBasiselement: subjectId, PraedikatBasiselement: operator, ObjektBasiselement: objectId};
            dbREST.BasiselementRelation.save({}, triple, function(value, responseHeader) {
                $scope.basiselementRelations.push(triple);
                prepareBasiselementRelation(triple);
                $scope.states.loading = false;
            }, function (httpResponse) {
                $log.debug(JSON.stringify(httpResponse));
                $scope.states.loading = false;
            });
        }
    };
    $scope.deleteRelation = function(relation){
        for(var i = 0; i < $scope.basiselementRelations.length; i++){
            if(($scope.basiselementRelations[i].SubjektBasiselement == relation.SubjektBasiselement) && ($scope.basiselementRelations[i].PraedikatBasiselement === relation.PraedikatBasiselement) && ($scope.basiselementRelations[i].ObjektBasiselement == relation.ObjektBasiselement)){
                // TODO react with callback, now just a delete request is sent but front end can't react on failures etc.
                $scope.states.loading = true;
                var myIndex = i;
                dbREST.BasiselementRelation.delete({subjekt: relation.SubjektBasiselement, praedikat: relation.PraedikatBasiselement, objekt: relation.ObjektBasiselement}, function(successResult) {
                    $scope.basiselementRelations.splice(myIndex,1);
                    $scope.states.loading = false;
                }, function (errResult) {
                    $scope.states.loading = false;
                    $log.debug(JSON.stringify(errResult));
                });
            }
        }
    };

    $scope.createBasiselement = function(b) {
        $scope.states.loading = true;
        $scope.selectedBasiselement.BasiselementTeilelemente = [];
        dbREST.Basiselemente.save({
            filmId: $routeParams.filmId,
            rollenId: $routeParams.rollenId,
            kostuemId: $routeParams.kostuemId
        }, b, function (value, responseHeader) {
            $log.debug('CREATED BASISELEMENT');
            $scope.selectedCostume.KostuemBasiselemente.push(b);
            $scope.baseelementObjects.push(b);
            b.BasiselementID = value.BasiselementID;
            $log.debug('VALUE: ' + JSON.stringify(value));
            $log.debug('RESPONSEHEADER: ' + JSON.stringify(responseHeader));
            createLoop(b).then(function(){reloadCostumeHeadData();});
            $scope.tempTeilelemente = [];
            $scope.tempSingleTeilelement = [];
            $scope.teilelementeDuplicateCheck = {};
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });

    };

    var createLoop = function(b){
        var deferred = $q.defer();
        if ($scope.tempTeilelemente) {
            $scope.tempTeilelemente.forEach(function (value) {
                $scope.createTeilelementWithBE(value, b);
            });
            return deferred.promise;
        } };

    $scope.createTeilelement = function(t){
        $scope.states.loading = true;
        dbREST.Teilelemente.save({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: $scope.selectedBasiselement.BasiselementID}, t, function(value, responseHeader) {
            $log.debug('CREATED TEILELEMENT');
            $scope.selectedBasiselement.BasiselementTeilelemente.push(t);
            t.TeilelementID = value.TeilelementID;
            $log.debug('VALUE: ' + JSON.stringify(value));
            $log.debug('RESPONSEHEADER: ' + JSON.stringify(responseHeader));
            $scope.initSelectedBasiselement();
            $scope.initSelectedTeilelement();
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };

    $scope.createTeilelementWithBE = function(t, b){
        $scope.states.loading = true;
        $scope.setSelectedBasiselement(b);
        $scope.selectedBasiselement.BasiselementID = b.BasiselementID;
        dbREST.Teilelemente.save({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: b.BasiselementID}, t, function(value, responseHeader) {
            $log.debug('CREATED TEILELEMENT');

            t.TeilelementID = value.TeilelementID;
            $scope.selectedBasiselement.BasiselementTeilelemente.push(t);
            $log.debug('VALUE: ' + JSON.stringify(value));
            $log.debug('RESPONSEHEADER: ' + JSON.stringify(responseHeader));
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };


    $scope.updateTeilelement = function(t){
        $scope.states.loading = true;
        dbREST.Teilelemente.update({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: $scope.selectedBasiselement.BasiselementID, teilelementId: t.TeilelementID}, t, function(value, responseHeader) {
            $log.debug('UPDATED TEILELEMENT');
            $log.debug('VALUE: ' + JSON.stringify(value));
            $log.debug('RESPONSEHEADER: ' + JSON.stringify(responseHeader));
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };

    $scope.updateBasiselement = function(b){
        $scope.states.loading = true;
        dbREST.Basiselemente.update({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: b.BasiselementID}, b, function(value, responseHeader) {
            $log.debug('UPDATED BASISELEMENT');
            $log.debug('VALUE: ' + JSON.stringify(value));
            $log.debug('RESPONSEHEADER: ' + JSON.stringify(responseHeader));
            reloadCostumeHeadData();
            updateBasiselementNameInRelations(value.BasiselementID, value.Basiselementname);
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };

    function updateBasiselementNameInRelations(beId, beName){
        $scope.basiselementRelations.forEach(function(relation){
            if(relation.SubjektBasiselement === beId){
                relation.SubjectCaption = beName;
            }
            if(relation.ObjektBasiselement === beId){
                relation.ObjectCaption = beName;
            }
        });
    }

    $scope.deleteBasiselement = function(b){
        $scope.states.loading = true;

        dbREST.Basiselemente.delete({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: b.BasiselementID}, function(successResult) {
            $log.debug('DELETED BASISELEMENT');
            for(var i = 0; i < $scope.selectedCostume.KostuemBasiselemente.length; i++){
                if($scope.selectedCostume.KostuemBasiselemente[i].BasiselementID === b.BasiselementID){
                    $scope.selectedCostume.KostuemBasiselemente.splice(i,1);
                    break;
                }
            }
            for(var j = 0; j < $scope.basiselementRelations.length; j++){
                if($scope.basiselementRelations[j].SubjektBasiselement == b.BasiselementID || $scope.basiselementRelations[j].ObjektBasiselement == b.BasiselementID){
                    $scope.basiselementRelations.splice(j, 1);
                }
            }
            $scope.baseelementObjects.forEach(function(item, index){
                if(item.BasiselementID === b.BasiselementID){
                    $scope.baseelementObjects.splice(index, 1);
                }
            });

            $log.debug('VALUE: ' + JSON.stringify(successResult));
            reloadCostumeHeadData();
            $scope.states.loading = false;
        }, function (errResult) {
            $log.debug(JSON.stringify(errResult));
            $scope.states.loading = false;
        });
    };

    $scope.deleteTeilelement = function(t){
        $scope.states.loading = true;

        dbREST.Teilelemente.delete({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId, kostuemId: $routeParams.kostuemId, basiselementId: $scope.selectedBasiselement.BasiselementID, teilelementId: t.TeilelementID}, function(successResult) {
            $log.debug('DELETED TEILELEMENT');
            for(var i = 0; i < $scope.selectedBasiselement.BasiselementTeilelemente.length; i++){
                if($scope.selectedBasiselement.BasiselementTeilelemente[i].TeilelementID === t.TeilelementID){
                    $scope.selectedBasiselement.BasiselementTeilelemente.splice(i,1);
                    break;
                }

            }
            $log.debug('VALUE: ' + JSON.stringify(successResult));
            $scope.states.loading = false;
        }, function (errResult) {
            $log.debug(JSON.stringify(errResult));
            $scope.states.loading = false;
        });
    };

    $scope.updateCostume = function (costume) {
        $scope.states.loading = true;
        //if(costume.hasOwnProperty('Screenshot')){delete costume.Screenshot;}
        dbREST.Kostueme.update({filmId: costume.FilmID, rollenId: costume.RollenID, kostuemId: costume.KostuemID}, costume, function (value, responseHeader) {
            $log.debug('COSTUME UPDATE SUCCESSFUL');
            $scope.savedProperly = true;
            resetUnsavedData();
            //update costume copy after save
            angular.copy($scope.selectedCostume, $scope.selectedCostumeCopy);
            $scope.states.loading = false;
            $timeout(function () {
                $scope.savedProperly = false;
                setUnsavedData();
            }, 5000);
        }, function (httpResponse) {
            $log.debug('FAILURE AT UPDATING COSTUME');
            $scope.states.loading = false;
            setUnsavedData();
        });
    };

    function setSelectedScreenshot(screenshot){
        $scope.fadeIn = false;
        $scope.fadeOut = true;
        $timeout(function () {
            $scope.selectedScreenshot = screenshot;
            $scope.fadeOut = false;
            $scope.fadeIn = true;
            $scope.selectedScreenshotData = 'data:image/gif;base64,' + screenshot.ScreenshotThumb;
        }, 1000);
    }

    /**
     * Timepicker Stuff
     */
    function getInitialTime() {
        var d = new Date(0);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }

    $scope.addTimecode = function (tStart, tEnd) {
        if (!$scope.selectedCostume.KostuemTimecodes) {
            $scope.selectedCostume.KostuemTimecodes = [];
        }

        if(tStart >= tEnd){ return}

        var newId;
        if ($scope.selectedCostume.KostuemTimecodes.length === 0) {
            newId = 1;
        } else {
            newId = $scope.selectedCostume.KostuemTimecodes[$scope.selectedCostume.KostuemTimecodes.length - 1].id + 1;
        }
        $scope.selectedCostume.KostuemTimecodes.push(
            {   id: newId,
                Timecodeanfang: {hours: tStart.getHours().toString().length === 1 ? '0' + tStart.getHours().toString() : tStart.getHours().toString(), minutes: tStart.getMinutes().toString().length === 1 ? '0' + tStart.getMinutes().toString() : tStart.getMinutes().toString(), seconds: tStart.getSeconds().toString().length === 1 ? '0' + tStart.getSeconds().toString() : tStart.getSeconds().toString()
                },
                Timecodeende: {hours: tEnd.getHours().toString().length === 1 ? '0' + tEnd.getHours().toString() : tEnd.getHours().toString(), minutes: tEnd.getMinutes().toString().length === 1 ? '0' + tEnd.getMinutes().toString() : tEnd.getMinutes().toString(), seconds: tEnd.getSeconds().toString().length === 1 ? '0' + tEnd.getSeconds().toString() : tEnd.getSeconds().toString()
                }
            }
        );
        $scope.selectedCostume.KostuemTimecodes = angular.copy($scope.selectedCostume.KostuemTimecodes);
    };

    $scope.deleteTimecode = function (t) {
        for (var i = 0; i < $scope.selectedCostume.KostuemTimecodes.length; i++) {
            if ($scope.selectedCostume.KostuemTimecodes[i].id === t.id) {
                $scope.selectedCostume.KostuemTimecodes.splice(i, 1);
                $scope.selectedCostume.KostuemTimecodes = angular.copy($scope.selectedCostume.KostuemTimecodes);
            }
        }
    };

    $scope.getTimecodeString = function (timecode) {
        return timecode.hours + ':' + timecode.minutes + ':' + timecode.seconds;
    };

    $scope.currentTimecodeAnfang = getInitialTime();
    $scope.currentTimecodeEnde = getInitialTime();

    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.sstep = 1;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30],
        sstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = false;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        var d = new Date();
        d.setHours($scope.hours);
        d.setMinutes($scope.minutes);
        d.setSeconds($scope.seconds);
        $scope.mytime = d;
    };

    $scope.changed = function () {
        setUnsavedData();
        $scope.update();
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };

    /**
     * Accordion
     */
    $scope.oneAtATime = true;


}]);