/**
 * Created by michaelfalkenthal on 12.11.14.
 */
'use strict';


angular.module('MUSE').factory('EntityFactory', function (){
    var ModelFactory = function(){
        var FilmModel = function(){
            this.FilmID = 'new';
            this.Filmtitel = '';
            this.Originaltitel = '';
            this.Regiseurvorname = '';
            this.Regiseurnachname = '';
            this.Kostuembildnervorname = '';
            this.Kostuembildnernachname = '';
            this.Erscheinungsjahr = '';
            this.Dauer = '0';
            this.Stil = 'realistisch';
            this.Genres = [];
            this.Produktionsorte = [];
            this.Farbkonzepte = [];
        };

        var RoleModel = function(){
            this.RollenID = 'new';
            this.FilmID = '';
            this.Rollenvorname = '';
            this.Rollennachname = '';
            this.Rollenberuf = '';
            this.Geschlecht = '';
            this.DominanterAlterseindruck = '';
            this.DominantesAlter = '';
            this.DominanteCharaktereigenschaften = [];
            this.Schauspielervorname = '';
            this.Schauspielernachname = '';
            this.Familienstaende = [];
            this.Rollenrelevanz = '';
            this.Stereotypen = [];
        };

        var CostumeModel = function(){
            this.KostuemID = 'new';
            this.RollenID = '';
            this.FilmID = '';
            this.Szenenbeschreibung = '';
            this.Ortsbegebenheit = '';
            this.KostuemTimecodes = [];
            this.DominanteFarbe = '';
            this.StereotypRelevant = '';
            this.DominanteFunktion = '';
            this.DominanterZustand = '';
            this.KostuemAlterseindruecke = [];
            this.KostuemBasiselemente = [];
            this.KostuemCharaktereigenschaften = [];
            this.KostuemFunktionen = [];
            this.KostuemKoerpermodifikationen = [];
            this.KostuemSpielorte = [];
            this.KostuemSpielzeiten = [];
            this.KostuemTageszeiten = [];
            this.KostuemZustaende = [];
        };

        var BaseelementModel = function(){
            this.BasiselementID = 'new';
            this.Basiselementname = '';
            this.BasiselementDesigns = [];
            this.BasiselementFarben = [];
            this.BasiselementFormen = [];
            this.BasiselementMaterialien = [];
            this.BasiselementTrageweisen = [];
            this.BasiselementTeilelemente = [];
            this.BasiselementZustaende = [];
            this.BasiselementFunktionen = [];
            this.BasiselementRelationen = [];
        };

        var PrimitiveModel = function(){
            this.TeilelementID = 'new';
            this.Teilelementname = '';
            this.TeilelementDesigns = [];
            this.TeilelementFarben = [];
            this.TeilelementFormen = [];
            this.TeilelementMaterialien = [];
            this.TeilelementTrageweisen = [];
            this.TeilelementZustaende = [];
        };

        this.getNewFilmInstance = function(){
            return new FilmModel();
        };

        this.getNewRoleInstance = function(){
            return new RoleModel();
        };

        this.getNewCostumeInstance = function(){
            return new CostumeModel();
        };

        this.getNewBaseelementInstance = function(){
            return new BaseelementModel();
        };

        this.getNewPrimitiveInstance = function(){
            return new PrimitiveModel();
        };
    };

    return new ModelFactory();
});