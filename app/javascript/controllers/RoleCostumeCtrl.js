/**
 * Created by michaelfalkenthal on 30.12.13.
 */

'use strict';

/**
 * RoleCostumeCtrl
 */
angular.module('MUSE').controller('RoleCostumeCtrl', ['$scope', '$timeout', '$interval', 'dbREST', '$routeParams', '$route', '$upload', '$log', 'ValidationService', 'ValidationFunctions', 'EntityFactory', function ($scope, $timeout, $interval, dbREST, $routeParams, $route, $upload, $log, ValidationService, ValidationFunctions, EntityFactory) {


    $scope.costume = EntityFactory.getNewCostumeInstance();

    $scope.selectables = dbREST.selectables;

    $scope.selectedCostume = EntityFactory.getNewCostumeInstance();
    $scope.selectedCostumeCopy = {};
    $scope.film = dbREST.Filme.get({filmId: $routeParams.filmId});
    $scope.role = dbREST.Rollen.get({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId});
    $scope.costumes = dbREST.Kostueme.query({filmId: $routeParams.filmId, rollenId: $routeParams.rollenId});
    $scope.selectedScreenshot = {};
    $scope.selectedScreenshotData = '';
    $scope.screenshotIndex = 0;
    $scope.loadingScreenshots = true;
    $scope.uploading = false;
    $scope.fadeIn = true;
    $scope.fadeOut = false;
    $scope.routeParams = $routeParams;
    $scope.unsavedData = false;

    var watcher = $interval(compareCostumes, 1000);

    $scope.costumeValidator = ValidationService.getNewInstance();
    function prepareCostumeValidation(validator) {
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemTimecodes', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.Ortsbegebenheit', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedCostume.StereotypRelevant', ValidationFunctions.StringNotEmpty);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemCharaktereigenschaften', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemTageszeiten', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemSpielorte', ValidationFunctions.ArrayLengthGTZero);
        validator.addValidationConstraint($scope, 'selectedCostume.KostuemAlterseindruecke', ValidationFunctions.ArrayLengthGTZero);
    }
    prepareCostumeValidation($scope.costumeValidator);

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

    $scope.showCreateCostumeModal = function () {
        $scope.initSelectedCostume();
    };

    $scope.showCostumeDetailsModal = function (c) {
        dbREST.Kostueme.get({filmId: c.FilmID, rollenId: c.RollenID, kostuemId: c.KostuemID}, function (costume) {
            $scope.setSelectedCostume(costume);
        }, function (errResponse) {
            $log.debug(JSON.stringify(errResponse));
        });
    };
    $scope.showCostumeDeleteModal = function (c) {
        $scope.setSelectedCostume(c);
    };
    $scope.setSelectedCostume = function (c) {
        if ($scope.selectedCostume === c) {
            return;
        }
        $scope.selectedCostume = c;
        //copy costume data for later comparison
        angular.copy(c, $scope.selectedCostumeCopy);
    };
    $scope.initSelectedCostume = function () {
        resetUnsavedData();
        $scope.selectedCostume = EntityFactory.getNewCostumeInstance();
        //copy costume data for later comparison
        angular.copy($scope.selectedCostume, $scope.selectedCostumeCopy);
        $scope.selectedCostume.RollenID = $scope.role.RollenID;
        $scope.selectedCostume.FilmID = $scope.film.FilmID;
        $scope.selectedCostume.KostuemAlterseindruecke = $scope.role.DominanterAlterseindruck === '' ? [] : [].concat({Alterseindruck: $scope.role.DominanterAlterseindruck, NumAlter: $scope.role.DominantesAlter !== null ? $scope.role.DominantesAlter : ''});

        if($scope.costumes.length > 0){
            var prevCostume = $scope.costumes[$scope.costumes.length - 1];
            dbREST.Kostueme.get({filmId: prevCostume.FilmID, rollenId: prevCostume.RollenID, kostuemId: prevCostume.KostuemID}, function(value, responseHeaders){
                $scope.selectedCostume.KostuemCharaktereigenschaften = [].concat(value.KostuemCharaktereigenschaften);
                $scope.selectedCostume.KostuemKoerpermodifikationen = [].concat(value.KostuemKoerpermodifikationen);
                $scope.selectedCostume.KostuemSpielzeiten = [].concat(value.KostuemSpielzeiten);
                $scope.selectedCostume.KostuemSpielorte = [].concat(value.KostuemSpielorte);
            }, function(httpResponse){
                //Do nothing...
            });
        }
    };
    $scope.createCostume = function (costume) {
        resetUnsavedData();
        $scope.states.loading = true;
        delete costume.KostuemFarben;
        delete costume.KostuemFunktionen;
        delete costume.KostuemZustaende;
        dbREST.Kostueme.save({filmId: $scope.film.FilmID, rollenId: $scope.role.RollenID}, costume, function (value) {
            $log.debug('COSTUME SUCCESSFULLY CREATED');
            $log.debug(JSON.stringify(value));
            $scope.costumes.push(value);
            $scope.initSelectedCostume();
            $scope.states.loading = false;
        }, function (httpResponse) {
            $log.debug('FAILURE AT CREATING COSTUME');
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };
    $scope.updateCostume = function (costume) {
        resetUnsavedData();
        $scope.states.loading = true;
        dbREST.Kostueme.update({filmId: costume.FilmID, rollenId: costume.RollenID, kostuemId: costume.KostuemID}, costume, function (value, responseHeader) {
            $log.debug('COSTUME UPDATE SUCCESSFUL');
            $log.debug(JSON.stringify(value));
            $scope.states.loading = false;
            //update costume copy after save
            angular.copy($scope.selectedCostume, $scope.selectedCostumeCopy);
            //Why do we need this?
            //Okay, we don't set costume to returning 'value' but do we need this? --> no!
            //Reload nach 500ms damit Modal sauber ausfaden kann
            //$timeout(function(){
            //    $route.reload();
            //}, 500);
        }, function (httpResponse) {
            $log.debug('FAILURE AT UPDATING COSTUME');
            $log.debug(JSON.stringify(httpResponse));
            $scope.states.loading = false;
        });
    };
    $scope.deleteCostume = function (costume) {
        resetUnsavedData();
        $scope.states.loading = true;
        dbREST.Kostueme.delete({filmId: costume.FilmID, rollenId: costume.RollenID, kostuemId: costume.KostuemID}, function (successResult) {
            $log.debug('COSTUME DELETED SUCCESSFULLY');
            $log.debug(JSON.stringify(successResult));
            for (var i = 0; i < $scope.costumes.length; i++) {
                if ($scope.costumes[i].KostuemID === costume.KostuemID) {
                    $scope.costumes.splice(i, 1);
                }
            }
            $scope.states.loading = false;
            //update costume copy after delete
            angular.copy($scope.selectedCostume, $scope.selectedCostumeCopy);
        }, function (errResult) {
            $log.debug('FAILURE AT DELETING COSTUME');
            $log.debug(JSON.stringify(errResult));
            $scope.states.loading = false;
        });
    };

    /**
     * Handling Timecodes
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


}]);