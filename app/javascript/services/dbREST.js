/**
 * Created by michaelfalkenthal on 30.12.13.
 * ngResource for calling DB REST API
 */

'use strict';


angular.module('MUSE').factory('dbREST', ['$resource', '$rootScope', '$filter', '$log', function ($resource, $rootScope, $filter, $log) {
    var obj = {

        //Login Stuff
        Login: $resource($rootScope.backend.restBackendAddress + '/login/'),
        Loggedin: $resource($rootScope.backend.restBackendAddress + '/loggedin'),
        ChangePassword: $resource($rootScope.backend.restBackendAddress + '/changePassword'),
        //Domain Table Ressources
        Alterseindruecke: $resource($rootScope.backend.restBackendAddress + '/alterseindruecke/:alterseindruckId'),
        BasiselementDomaene: $resource($rootScope.backend.restBackendAddress + '/basiselementdomaene/:basiselementId'),
        BasiselementRelation: $resource($rootScope.backend.restBackendAddress + '/basiselementrelationen/:subjekt/:praedikat/:objekt'),
        GetEmptyBasiselementRelation: $resource($rootScope.backend.restBackendAddress + '/basiselementrelationen/:basiselementId'),
        Charaktereigenschaften: $resource($rootScope.backend.restBackendAddress + '/charaktereigenschaften/:charaktereigenschaftId'),
        DarstellerNachnamen: $resource($rootScope.backend.restBackendAddress + '/darstellernachnamen/:darstellernachnameId'),
        DarstellerVornamen: $resource($rootScope.backend.restBackendAddress + '/darstellervornamen/:darstellervornameId'),
        Designs: $resource($rootScope.backend.restBackendAddress + '/designs/:designId'),
        Farbe: $resource($rootScope.backend.restBackendAddress + '/farben/:farbenId'),
        Farbkonzepte: $resource($rootScope.backend.restBackendAddress + '/farbkonzepte/:farbkonzeptId'),
        Formen: $resource($rootScope.backend.restBackendAddress + '/formen/:formId'),
        Funktionen: $resource($rootScope.backend.restBackendAddress + '/funktionen/:funktionsId'),
        Genres: $resource($rootScope.backend.restBackendAddress + '/genres/:genreId'),
        Koerpermodifikationen: $resource($rootScope.backend.restBackendAddress + '/koerpermodifikationen/:koerpermodifikationsId'),
        KostuembildnerNachnamen: $resource($rootScope.backend.restBackendAddress + '/kostuembildnernachnamen/:kostuembildnernachnameId'),
        KostuembildnerVornamen: $resource($rootScope.backend.restBackendAddress + '/kostuembildnervornamen/:kostuembildnervornameId'),
        Kostuemkurztexte: $resource($rootScope.backend.restBackendAddress + '/kostuemkurztexte/:kostuemkurztextId'),
        Materialien: $resource($rootScope.backend.restBackendAddress + '/materialien/:materialId'),
        Operatoren: $resource($rootScope.backend.restBackendAddress + '/operatoren/:operatorId'),
        Produktionsorte: $resource($rootScope.backend.restBackendAddress + '/produktionsorte/:produktionsortId'),
        RegisseurNachnamen: $resource($rootScope.backend.restBackendAddress + '/regisseurnachnamen/:regisseurnachnameId'),
        RegisseurVornamen: $resource($rootScope.backend.restBackendAddress + '/regisseurvornamen/:regisseurvornameId'),
        Rollenberufe: $resource($rootScope.backend.restBackendAddress + '/rollenberufe/:rollenberufId'),
        Spielorte: $resource($rootScope.backend.restBackendAddress + '/spielorte/:spielortId'),
        SpielortDetails: $resource($rootScope.backend.restBackendAddress + '/spielortfreitexte/:spielortfreitextId'),
        Spielzeiten: $resource($rootScope.backend.restBackendAddress + '/spielzeiten/:spielzeitId'),
        Stereotypen: $resource($rootScope.backend.restBackendAddress + '/stereotypen/:stereotypfId'),
        Tageszeiten: $resource($rootScope.backend.restBackendAddress + '/tageszeiten/:tageszeitId'),
        TeilelementDomaene: $resource($rootScope.backend.restBackendAddress + '/teilelementdomaene/:teilelementId'),
        Trageweisen: $resource($rootScope.backend.restBackendAddress + '/trageweisen/:trageweiseId'),
        Typus: $resource($rootScope.backend.restBackendAddress + '/typusdomaene/:typusId'),
        Zustaende: $resource($rootScope.backend.restBackendAddress + '/zustaende/:zustandsId'),

        // full costume list
        Costumes: $resource($rootScope.backend.restBackendAddress + '/kostueme'),

        // statistic
        Statistic: $resource($rootScope.backend.restBackendAddress + '/statistic'),

        // taxonomy admin functions
        EditableTaxonomies: $resource($rootScope.backend.restBackendAddress + '/taxonomies', {}, {get: {method: 'GET', isArray: true}}),
        AddTaxonomyItem: $resource($rootScope.backend.restBackendAddress + '/taxonomies/:taxonomy'),
        DeleteTaxonomyItem: $resource($rootScope.backend.restBackendAddress + '/taxonomies/:taxonomy/:name'),

        // users (admin functions)
        Users: $resource($rootScope.backend.restBackendAddress + '/users'),
        User: $resource($rootScope.backend.restBackendAddress + '/users/:username'),
        UserRoles: $resource($rootScope.backend.restBackendAddress + '/users/:username/roles/:role'),

        //Complex Ressources
        Basiselemente: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId/basiselemente/:basiselementId', {}, { update: {method: 'PUT'} }),
        QueryBasiselement: $resource($rootScope.backend.restBackendAddress + '/basiselemente/:basiselementId'),
        BasiselementImage: $resource($rootScope.backend.restBackendAddress + '/basiselement/:basiselementId/image/'),
        BasiselementThumb: $resource($rootScope.backend.restBackendAddress + '/basiselement/:basiselementId/thumb/'),
        BasiselementLink: $resource($rootScope.backend.restBackendAddress + '/basiselement/:basiselementId/link/'),
        BasiselementImageFileName: $resource($rootScope.backend.restBackendAddress + '/basiselement/:basiselementId/filename/'),
        Filme: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId', {}, { update: {method: 'PUT'} }),
        FilmScreenshots: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/screenshots/:screenshotId'),
        FilmScreenshotThumbs: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/screenshotthumbs/:screenshotId'),
        Kostueme: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId', {}, { update: {method: 'PUT'} }),
        KostuemScreenshots: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId/screenshots/:screenshotId'),
        KostuemScreenshotThumbs: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId/screenshotthumbs/:screenshotId'),
        RollenScreenshots: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/screenshots/:screenshotId'),
        RollenScreenshotThumbs: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/screenshotthumbs/:screenshotId'),
        Rollen: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId', {}, { update: {method: 'PUT'} }),
        Teilelemente: $resource($rootScope.backend.restBackendAddress + '/filme/:filmId/rollen/:rollenId/kostueme/:kostuemId/basiselemente/:basiselementId/teilelemente/:teilelementId', {}, { update: {method: 'PUT'} }),
        QueryTeilelement: $resource($rootScope.backend.restBackendAddress + '/teilelemente/:teilelementId'),

        selectables: {
            alterseindruecke: $resource($rootScope.backend.restBackendAddress + '/alterseindruecke/:alterseindruckId').query(),
            basiselemente: $resource($rootScope.backend.restBackendAddress + '/basiselementdomaene/:basiselementId').query(),
            charaktereigenschaften: $resource($rootScope.backend.restBackendAddress + '/charaktereigenschaften/:charaktereigenschaftId').query(),
            darstellerNachnamen: $resource($rootScope.backend.restBackendAddress + '/darstellernachnamen/:darstellernachnameId').query(),
            darstellerVornamen: $resource($rootScope.backend.restBackendAddress + '/darstellervornamen/:darstellervornameId').query(),
            designs: $resource($rootScope.backend.restBackendAddress + '/designs/:designId').query(),
            farben: $resource($rootScope.backend.restBackendAddress + '/farben/:farbenId').query(),
            //farbeindruecke: ['normal','neon','pastellig','kräftig','stumpf','glänzend', 'transparent'],
            farbeindruecke: $resource($rootScope.backend.restBackendAddress + '/farbeindruecke/:farbeindruckId').query(),
            farbkonzepte: $resource($rootScope.backend.restBackendAddress + '/farbkonzepte/:farbkonzeptId').query(),
            formen: $resource($rootScope.backend.restBackendAddress + '/formen/:formId').query(),
            funktionen: $resource($rootScope.backend.restBackendAddress + '/funktionen/:funktionsId').query(),
            genres: $resource($rootScope.backend.restBackendAddress + '/genres/:genreId').query(),
            koerpermodifikationen: $resource($rootScope.backend.restBackendAddress + '/koerpermodifikationen/:koerpermodifikationsId').query(),
            koerperteile: $resource($rootScope.backend.restBackendAddress + '/koerperteile/:koerperteilId').query(),
            kostuembildnerNachnamen: $resource($rootScope.backend.restBackendAddress + '/kostuembildnernachnamen/:kostuembildnernachnameId').query(),
            kostuembildnerVornamen: $resource($rootScope.backend.restBackendAddress + '/kostuembildnervornamen/:kostuembildnervornameId').query(),
            kostuemkurztexte: $resource($rootScope.backend.restBackendAddress + '/kostuemkurztexte/:kostuemkurztextId').query(),
            materialien: $resource($rootScope.backend.restBackendAddress + '/materialien/:materialId').query(),
            materialeindruecke: $resource($rootScope.backend.restBackendAddress + '/materialeindruecke/:materialeindruckId').query(),
            operatoren: $resource($rootScope.backend.restBackendAddress + '/operatoren/:operatorId').query(),
            produktionsorte: $resource($rootScope.backend.restBackendAddress + '/produktionsorte/:produktionsortId').query(),
            regisseurNachnamen: $resource($rootScope.backend.restBackendAddress + '/regisseurnachnamen/:regisseurnachnameId').query(),
            regisseurVornamen: $resource($rootScope.backend.restBackendAddress + '/regisseurvornamen/:regisseurvornameId').query(),
            rollenberufe: $resource($rootScope.backend.restBackendAddress + '/rollenberufe/:rollenberufId').query(),
            spielorte: $resource($rootScope.backend.restBackendAddress + '/spielorte/:spielortId').query(),
            spielortdetails: $resource($rootScope.backend.restBackendAddress + '/spielortfreitexte/:spielortfreitextId').query(),
            spielzeiten: $resource($rootScope.backend.restBackendAddress + '/spielzeiten/:spielzeitId').query(),
            stereotypen: $resource($rootScope.backend.restBackendAddress + '/stereotypen/:stereotypId').query(),
            tageszeiten: $resource($rootScope.backend.restBackendAddress + '/tageszeiten/:tageszeitId').query(),
            teilelemente: $resource($rootScope.backend.restBackendAddress + '/teilelementdomaene/:teilelementId').query(),
            trageweisen: $resource($rootScope.backend.restBackendAddress + '/trageweisen/:trageweiseId').query(),
            typus: $resource($rootScope.backend.restBackendAddress + '/typusdomaene/:typusId').query(),
            zustaende: $resource($rootScope.backend.restBackendAddress + '/zustaende/:zustandsId').query(),
            kostuembasiselemente: $resource($rootScope.backend.restBackendAddress + '/kostuembasiselemente/:basiselementId').query(),
            flattenLists: {
                alterseindruecke: [],
                basiselemente: [],
                charaktereigenschaften: [],
                designs: [],
                farben: [],
                farbkonzepte: [],
                familienstaende: ['ledig', 'verheiratet', 'verwitwet', 'geschieden'],
                formen: [],
                funktionen: [],
                genres: [],
                koerpermodifikationen: [],
                koerperteile: [],
                materialien: [],
                operatoren: [],
                preparedKoerperteile: [],
                rollenberufe: [],
                produktionsorte: [],
                rollenrelevanz: ['Hauptrolle', 'Nebenrolle', 'Statist'],
                spielorte: [],
                spielortdetails: [],
                spielzeiten: [],
                stereotypen: [],
                tageszeiten: [],
                teilelemente: [],
                trageweisen: [],
                typus: [],
                zustaende: []
            }
        }
    };
    function prepareFlattenLists(){
        obj.selectables.alterseindruecke.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.alterseindruecke, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.basiselemente.$promise.then(function(result){
            var flattenBaseelements = $filter('flattenTree')(result);
            obj.selectables.koerperteile.$promise.then(function(){
                var cleanedBaseelements = $filter('removeKoerperteileFlat')(flattenBaseelements, obj.selectables.koerperteile);
                Array.prototype.push.apply(obj.selectables.flattenLists.basiselemente, cleanedBaseelements);
                result.forEach(function(node){
                    collapseByDefault(node);
                });
            });
        });
        obj.selectables.charaktereigenschaften.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.charaktereigenschaften, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.designs.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.designs, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.farben.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.farben, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.farbkonzepte.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.farbkonzepte, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.formen.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.formen, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.funktionen.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.funktionen, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.genres.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.genres, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.koerpermodifikationen.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.koerpermodifikationen, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.koerperteile.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.koerperteile, result);
        });
        obj.selectables.materialien.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.materialien, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.operatoren.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.operatoren, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.produktionsorte.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.produktionsorte, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.spielorte.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.spielorte, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.spielzeiten.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.spielzeiten, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.tageszeiten.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.tageszeiten, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.teilelemente.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.teilelemente,  $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.trageweisen.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.trageweisen, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.typus.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.typus, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.zustaende.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.zustaende, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.rollenberufe.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.rollenberufe, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.stereotypen.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.stereotypen, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
        obj.selectables.spielortdetails.$promise.then(function(result){
            Array.prototype.push.apply(obj.selectables.flattenLists.spielortdetails, $filter('flattenTree')(result));
            result.forEach(function(node){
                collapseByDefault(node);
            });
        });
    }

    function collapseByDefault(node){
        node.collapsed = true;
        node.visible = true;
        node.children.forEach(function(childNode){
            collapseByDefault(childNode);
        });
    }

    prepareFlattenLists();
    return obj;
}]);
