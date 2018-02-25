angular.module('MUSE').config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider
        .translations('de', translationsDE)
        .translations('en', translationsEN)
        .preferredLanguage('de');
}]);


var translationsDE = {
    //General
    TITEL: 'MUSE - MUster Suchen und Erkennen - Kostüm Repository',
    MARKE: 'MUSE Kostüm Repository',
    FILMTITEL: 'Filmtitel',
    ORIGINALTITEL: 'Originaltitel',
    loeschen: 'löschen',
    BILDER: 'Bilder',
    BILDERPREV: 'Prev',
    BILDERNEXT: 'Next',
    BILDERUPLOADABBRECHEN: 'abbrechen',
    KEINEBILDERVORHANDEN: 'Keine Bilder vorhanden',
    BILDERWERDENGELADEN: 'Bilder werden geladen',
    VORNAME: 'Vorname',
    NACHNAME: 'Nachname',
    SPEICHERN: 'Speichern',
    ZURUECKSETZEN: 'Zurücksetzen',
    ANLEGEN: 'Anlegen',
    ABBRECHEN: 'Abbrechen',
    BACKEND: 'Verbunden mit Backend',
    LOADINGIMAGE: 'Lade hochaufgelöstes Bild...',
    FARBENWAEHLEN: 'Farbe auswählen...',
    KOERPERTEIL: 'Körperteil',
    UNSAVED_DATA: 'Ungespeicherte Änderungen vorhanden!',
    DELETE_QUESTION_PART_ONE: 'Möchtest du',
    DELETE_QUESTION_PART_TWO: 'wirklich löschen?',

    //Suche
    KOSTUEMSUCHEFEHLER: "Das Kostüm konnte leider nicht gefunden werden",
    BESUCHEFEHLER: "Das Basiselement konnte leider nicht gefunden werden",
    KOSTUEMSUCHEN: "Kostüm suchen",
    TEILELEMENTSUCHEN: "Teilelement suchen",
    BASISELEMENTSUCHEN: "Basiselement suchen",
    SUCHEN: "Suchen",
    LEERERELATIONENSUCHEN: "Leere Basiselementrelationen suchen",
    NEXT_COSTUME: 'Nächstes Kostüm auswählen',
    OPEN_COSTUME_NEW_TAB: 'Kostüm in neuem Tab öffnen',

    //Loginseite
    LOGINFEHLER:"Benutzername oder Passwort ist nicht korrekt!",
    LOGININFO: "Du bist eingeloggt als:",
    LOGIN: "Login",
    LOGOUT: "Logout",
    AKTUELLESPW: "Aktuelles PW",
    NEWPW: "Neues PW",
    REPEATPW: "PW wiederholen",
    CHANGEPW: "Passwort ändern",
    PASSWORTFEHLER: "Fehler bei der Eingabe!",
    AENDERUNGKORREKT: "Dein Passwort wurde geändert. Bitte melde dich mit deinem neuen Passwort erneut an",
    BENUTZER: "Benutzer",
    PASSWORT: "Passwort",

    //Breadcrumb
    BREADCRUMBROLLENUEBERSICHT: 'Rollenübersicht',
    BREADCRUMBFILME: 'Filme',
    BREADCRUMBFILM: 'Film',
    BREADCRUMBROLLE: 'Rolle',
    BREADCRUMBKOSTUEM: 'Kostüm',
    BREADCRUMBKOMPOSITIONSUEBERSICHT: 'Kompositionsübersicht',
    BREADCRUMBKOSTUEMUEBERSICHT: 'Kostümübersicht',

    //Filmoverview
    anzeigen: 'anzeigen',
    FILMUEBERSICHT: 'Filmübersicht',
    FILMEANLEGENUNDSUCHEN: 'Filme anlegen und suchen',
    NEUENFILMANLEGEN: 'Neuen Film anlegen',
    FILMLISTE: 'Filmliste',
    DETAILSZUFILM: 'Details zu Film <b>{{  filmtitle }}</b> anzeigen',
    FILMLOESCHENBUTTON: 'Film <b>{{filmtitle}}</b> löschen!',
    FILMLOESCHEN: 'Film löschen!',
    FILMLOESCHENTEXT: '<p>Soll der Film</p><p><h2>{{filmtitle}}</h2></p><p>wirklich gelöscht werden?</p>',

    //Genreoverview
    GENREUEBERSICHT: 'Genreübersicht',
    GENRELISTE: 'Genreliste',

    //Film
    NEUERFILM: 'Neuer Film',
    REGISSEUR: 'Regisseur',
    KOSTUEMBILDNER: 'Kostümbildner',
    //FILMTITEL: 'Filmtitel (dt.)',
    FILMDATEN: 'Filmdaten',
    ERSCHEINUNGSJAHR: 'Erscheinungsjahr',
    PRODUKTIONSORTE: 'Produktionsorte',
    GENRES: 'Genres',
    FARBKONZEPTE: 'Farbkonzepte',
    STIL: 'Stil',
    AENDERN: 'Ändern',
    NEUEROLLEANLEGEN: 'Neue Rolle anlegen',
    DETAILSZUROLLE: 'Details zu Rolle <b>{{rolename}}</b> anzeigen',
    ROLLEN: 'Rollen',
    FILMSTILREALISTISCH: 'realistisch',
    FILMSTILUNREALISTISCH: 'unrealistisch',
    FILMERFOLGREICHGESPEICHERT: 'Film erfogreich gespeichert!',
    KOSTUEMEVONROLLE: 'Kostüme von Rolle <b>{{ rolename }}</b> anzeigen',
    ROLLELOESCHENBUTTON: 'Rolle <b>{{ rolename }}</b> löschen!',
    DAUER: 'Dauer (in Min.)',

    //RoleDetailModal
    ROLLE: 'Rolle',
    ROLLENVORNAME: 'Rollenvorname',
    ROLLENNACHNAME: 'Rollennachname',
    DARSTELLERVORNAME: 'Darstellervorname',
    DARSTELLERNACHNAME: 'Darstellernachname',
    ROLLEANLEGEN: 'Rolle anlegen',
    DARSTELLER: 'Darsteller',
    ROLLENBERUF: 'Rollenberuf',
    GESCHLECHT: 'Geschlecht',
    GESCHLECHTMAENNLICH: 'männlich',
    GESCHLECHTWEIBLICH: 'weiblich',
    GESCHLECHTUNDEFINIERT: 'undefiniert',
    DOMINANTERALTERSEINDRUCK: 'Dominanter Alterseindruck',
    ALTERSEINDRUCK: 'Alterseindruck',
    ALTER: 'Alter',
    ALTERSEINDRUECKE: 'Alterseindrücke',
    DOMINANTECHARAKTEREIGENSCHAFTEN: 'Dominante Charaktereigenschaften',
    CHARAKTEREIGENSCHAFTEN: 'Charaktereigenschaften',
    FAMILIENSTAND: 'Familienstand',
    FAMILIENSTANDLEDIG: 'ledig',
    FAMILIENSTANDVERHEIRATET: 'verheiratet',
    FAMILIENSTANDVERWITWET: 'verwitwet',
    FAMILIENSTANDGESCHIEDEN: 'geschieden',
    ROLLENRELEVANZ: 'Rollenrelevanz',
    ROLLENRELEVANZHAUPTROLLE: 'Hauptrolle',
    ROLLENRELEVANZNEBENROLLE: 'Nebenrolle',
    ROLLENRELEVANZSTATIST: 'Statist',
    STEREOTYP: 'Stereotyp',

    //RoleDeleteModal
    ROLLELOESCHENTEXT: '<p>Soll die Rolle</p><p><h2>#{{rollenid}}: {{rollenvorname}} {{rollennachname}}</h2></p><p>wirklich gelöscht werden?</p>',

    //RoleCostumeOverview
    KOSTUEMUEBERSICHTVON: 'Kostümübersicht von',
    KOSTUEMUEBERSICHT: 'Kostümübersicht',
    KOSTUEME: 'Kostüme',
    NEUESKOSTUEMANLEGEN: 'Neues Kostüm anlegen',
    BEZEICHNUNG: 'Bezeichnung',
    DETAILSZUKOSTUEM: 'Details des Kostüms <b>{{ kurztext }}</b> anzeigen',
    KOMPOSITIONZEIGEN: 'Komposition des Kostüms <b>{{ kurztext }}</b> anzeigen',
    KOSTUEMLOESCHEN: 'Kostüm löschen!',
    KOSTUEMLOESCHENHEADING: 'Kostüm "{{ kurztext }}" löschen!',
    KOSTUEMLOESCHENTEXT: '<p>Soll das Kostüm</p><p><h2>#{{kostuemid}}: {{kostuemkurztext}}</h2></p><p>wirklich gelöscht werden?</p>',

    //CostumeData
    KURZTEXT: 'Kurztext',
    KOSTUEMKURZTEXT: 'Kostümkurztext',
    SZENENBESCHREIBUNG: 'Szenenbeschreibung',
    ZEITSTEMPEL: 'Timecodes',
    ZEITSTEMPELANFANG: 'Timecode Anfang',
    ZEITSTEMPELENDE: 'Timecode Ende',
    ZEITSTEMPELLOESCHEN: 'Timecode löschen!',
    ORTSBEGEBENHEIT: 'Ortsbegebenheit',
    ORTSBEGEBENHEITDRINNEN: 'drinnen',
    ORTSBEGEBENHEITDRAUSSEN: 'draußen',
    ORTSBEGEBENHEITDRINNENUNDDRAUSSEN: 'drinnen & draußen',
    STEREOTYPRELEVANT: 'Stereotyp relevant',
    STEREOTYPRELEVANTJA: 'ja',
    STEREOTYPRELEVANTNEIN: 'nein',
    STEREOTYPRELEVANTNEUTRAL: 'neutral',
    DOMINANTEFARBE: 'Dominante Farbe',
    FARBENVONBASISELEMENTEN: 'Farben von Basiselementen',
    DOMINANTEFUNKTION: 'Dominante Funktion',
    FUNKTIONENVONBASISELEMENTEN: 'Funktionen von Basiselementen',
    DOMINANTERZUSTAND: 'Dominanter Zustand',
    ZUSTAENDEVONBASISELEMENTEN: 'Zustände von Basiselementen',
    KOERPERMODIFIKATIONEN: 'Körpermodifikationen',
    SPIELORTE: 'Spielorte',
    SPIELORT: 'Spielort',
    SPIELORTFREITEXT: 'Spielort Detail',
    SPIELORTLOESCHEN: 'Spielort löschen!',
    SPIELZEITEN: 'Spielzeiten',
    SPIELZEIT: 'Spielzeit',
    SPIELZEITVON: 'von',
    SPIELZEITBIS: 'bis',
    SPIELZEITLOESCHEN: 'Spielzeit löschen!',
    TAGESZEITEN: 'Tageszeiten',

    //Costume
    KOMPOSITIONSUEBERSICHTVON: 'Kompositionsübersicht von',
    KOSTUEMDATEN: 'Kostümdaten',
    KOSTUEMERFOLGREICHGESPEICHERT: 'Kostüm erfolgreich gespeichert!',
    KOSTUEMDATENEINAUSBLENDEN: 'Kostümdaten ein-/ausblenden',
    BASISELEMENTE: 'Basiselemente',
    NEUESBASISELEMENTANLEGEN: 'Neues Basiselement anlegen',
    NUREINBASISELEMENTOEFFNEN: 'Nur ein Basiselement öffnen',
    DETAILSZUBASISELEMENT: 'Details zu Basiselement',
    BASISELEMENTLOESCHEN: 'Basiselement löschen!',
    KOSTUEM: 'Kostüm',
    TEILELEMENTE: 'Teilelemente',
    TEILELEMENT: 'Teilelement',
    NEUESTEILELEMENTANLEGEN: 'Neues Teilelement anlegen',
    DETAILSZUTEILELEMENT: 'Details zu Teilelement',
    TEILELEMENTLOESCHEN: 'Teilelement löschen!',
    BASISELEMENTKOMPOSITION: 'Basiselementkomposition',
    BASISELEMENTKOMPOSITIONSUBJEKT: 'Subjekt',
    BASISELEMENTKOMPOSITIONOPERATOR: 'Operator',
    BASISELEMENTKOMPOSITIONOBJEKT: 'Objekt',
    RELATIONLOESCHEN: 'Relation löschen!',
    KOERPERTEILE: 'Körperteile',

    //BasiselementDetails
    BASISELEMENTANLEGEN: 'Basiselement anlegen',
    BASISELEMENT: 'Basiselement',
    BASISELEMENTID: 'BasiselementID',
    BASISELEMENTNAME: 'Basiselementname',
    DESIGNS: 'Designs',
    FORMEN: 'Formen',
    TRAGEWEISEN: 'Trageweisen',
    ZUSTAENDE: 'Zustände',
    FUNKTIONEN: 'Funktionen',
    MATERIALIEN: 'Materialien',
    MATERIAL: 'Material',
    MATERIALEINDRUCK: 'Materialeindruck',
    MATERIALNAME: 'Materialname',
    MATERIALLOESCHEN: 'Material löschen!',
    FARBE: 'Farbe',
    FARBEN: 'Farben',
    FARBEINDRUCK: 'Farbeindruck',
    FARBNAME: 'Farbname',
    FARBELOESCHEN: 'Farbe löschen!',

    //TeilelementDetails
    TEILELEMENTANLEGEN: 'Teilelement anlegen',
    TEILELEMENTID: 'TeilelementID',
    TEILELEMENTNAME: 'Teilelementname',

    //Error Modal Elemente
    ERRORMODALTITLE: 'Ein Fehler ist aufgetreten',
    ERRORMODALBODY: 'Fehlernachricht',

    //Kompositionsgraph
    NETWORK_GRAPH: 'Kostüm-Kompositions Graph',
    RELOAD_DATA: 'Daten neu laden.',
    REDRAW_GRAPH: 'Graph neu zeichnen.',
    NODE_SIZE: 'Basiselementgröße:',
    NETWORK_GRAPH_EIN_AUSBLENDEN: 'Kostüm-Kompositions Graph ein-/ausblenden',

    //Admin panel
    ADMIN_PANEL: 'Admin Panel',
    EDITOR: 'Editor',
    CAN_EDIT: 'Kann ändern',
    TAX_ADMIN: 'Taxonomy Admin',
    EDIT_TAXONOMIES: 'Kann Taxonomien ändern',
    ADMIN: 'Admin',
    IS_ADMIN: 'Ist Admin',

    //Analysis page
    ANALYSIS: 'Auswertung',

    //Statistic panel
    STATISTIK: 'Staistik:',
    NR_OF_FILMS: 'Anzahl erfasster Filme',
    NR_OF_COSTUMES: 'Anzahl erfasster Kostüme',
    NR_OF_COSTUMES_PER_FILM: 'Durchschnittliche Anzahl erfasster Kostüme pro Film',
    NR_OF_BASE_ELEMENTS: 'Anzahl erfasster Base Elements',
    NR_OF_BASE_ELEMENTS_PER_COSTUME: 'Durchschnittliche Anzahl erfasster Basiselemente pro Kostüm',
    NR_OF_PRIMITIVES: 'Anzahl erfasster Teilelemente',
    NR_OF_PRIMITIVES_PER_COSTUME: 'Durchschnittliche Anzahl erfasster Teilelemente pro Kostüm',
    NR_OF_PRIMITIVES_PER_BASE_ELEMENT: 'Durchschnittliche Anzahl erfasster Teilelemente pro Basiselement',
    ASSIGNED_COLORS: '~Anzahl zugewiesener Farben',
    ASSIGNED_MATERIALS: '~Anzahl zugewiesener Materialien',

    //Taxonomy page
    TAXONOMIES: 'Taxonomien',

};
















var translationsEN = {
    //General
    TITEL: 'MUSE - MUster Suchen und Erkennen - Kostüm Repository',
    MARKE: 'MUSE Costume Repository',
    FILMTITEL: 'Film Title',
    ORIGINALTITEL: 'Original Titel',
    loeschen: 'delete',
    BILDER: 'Pics',
    BILDERPREV: 'Prev',
    BILDERNEXT: 'Next',
    BILDERUPLOADABBRECHEN: 'cancel',
    KEINEBILDERVORHANDEN: 'No pics available',
    BILDERWERDENGELADEN: 'Loading pictures',
    VORNAME: 'Given Name',
    NACHNAME: 'Surname',
    SPEICHERN: 'Save',
    ZURUECKSETZEN: 'Reset',
    ANLEGEN: 'Create',
    ABBRECHEN: 'Cancel',
    BACKEND: 'Connected to Backend',
    LOADINGIMAGE: 'Loading High Resolution Image...',
    FARBENWAEHLEN: 'Choose a Color',
    KOERPERTEIL: 'Body Part',
    UNSAVED_DATA: 'Unsaved data!',
    DELETE_QUESTION_PART_ONE: 'Do you want to delete',
    DELETE_QUESTION_PART_TWO: '?',

    //Searchpage
    KOSTUEMSUCHEFEHLER: "Couldn't find the Costume!",
    BESUCHEFEHLER: "Couldn't find the Baseelement",
    KOSTUEMSUCHEN: "Search Costume",
    TEILELEMENTSUCHEN: "Search Primitive",
    BASISELEMENTSUCHEN: "Search Baseelement",
    SUCHEN: "Search",
    LEERERELATIONENSUCHEN: "Search empty Baseelementrelations",
    NEXT_COSTUME: 'Select next Costume',
    OPEN_COSTUME_NEW_TAB: 'Open Costume in new Tab',

    //Loginpage
    LOGINFEHLER:"Wrong username or password!",
    LOGININFO: "You are logged in as:",
    LOGIN: "Login",
    LOGOUT: "Logout",
    AKTUELLESPW: "Current PW",
    NEWPW: "New PW",
    REPEATPW: "Repeat PW",
    CHANGEPW: "Change Password",
    PASSWORTFEHLER: "Wrong input variables!",
    AENDERUNGKORREKT: "Your password was modified. Please login again with your new password",
    BENUTZER: "User",
    PASSWORT: "Password",



    //Breadcrumb
    BREADCRUMBROLLENUEBERSICHT: 'Role Overview',
    BREADCRUMBFILME: 'Films',
    BREADCRUMBFILM: 'Film',
    BREADCRUMBROLLE: 'Role',
    BREADCRUMBKOSTUEM: 'Costume',
    BREADCRUMBKOMPOSITIONSUEBERSICHT: 'Composition Overview',
    BREADCRUMBKOSTUEMUEBERSICHT: 'Costumes of Role',


    //Filmoverview
    anzeigen: 'Show',
    FILMUEBERSICHT: 'Film Overview',
    FILMEANLEGENUNDSUCHEN: 'Create and Search Films',
    NEUENFILMANLEGEN: 'Create New Film',
    FILMLISTE: 'List of Films',
    DETAILSZUFILM: 'Show details of Film <b>{{  filmtitle }}</b>',
    FILMLOESCHEN: 'Delete Film!',
    FILMLOESCHENBUTTON: 'Delete Film <b>{{filmtitle}}</b>!',
    FILMLOESCHENTEXT: '<p>Do your really want to delete the following film?</p><p><h2>{{filmtitle}}</h2></p>',

    //Genreoverview
    GENREUEBERSICHT: 'Genreoverview',
    GENRELISTE: 'Genrelist',


    //Film
    NEUERFILM: 'New Film',
    REGISSEUR: 'Director',
    KOSTUEMBILDNER: 'Costume Designer',
    //FILMTITEL: 'Film Titel (ger)',
    FILMDATEN: 'Film Data',
    ERSCHEINUNGSJAHR: 'Year of Publication',
    PRODUKTIONSORTE: 'Production Places',
    GENRES: 'Genres',
    FARBKONZEPTE: 'Colour Concepts',
    STIL: 'Style',
    AENDERN: 'Change',
    NEUEROLLEANLEGEN: 'Create New Role',
    DETAILSZUROLLE: 'Show details of Role <b>{{rolename}}</b>',
    KOSTUEMEVONROLLE: 'Show costumes of Role <b>{{ rolename }}</b>',
    ROLLEN: 'Roles',
    FILMSTILREALISTISCH: 'realistic',
    FILMSTILUNREALISTISCH: 'unrealistic',
    FILMERFOLGREICHGESPEICHERT: 'Film successfully saved!',
    ROLLELOESCHENBUTTON: 'Delete role <b>{{ rolename }}</b>!',
    DAUER: 'Length (in min.)',

    //RoleDetailModal
    ROLLE: 'Role',
    ROLLENVORNAME: 'Given Name of Role',
    ROLLENNACHNAME: 'Surname of Role',
    DARSTELLERVORNAME: 'Given Name of Actor',
    DARSTELLERNACHNAME: 'Surname of Actor',
    ROLLEANLEGEN: 'Create Role',
    DARSTELLER: 'Actor',
    ROLLENBERUF: 'Job of Role',
    GESCHLECHT: 'Gender',
    GESCHLECHTMAENNLICH: 'man',
    GESCHLECHTWEIBLICH: 'woman',
    GESCHLECHTUNDEFINIERT: 'undefined',
    DOMINANTERALTERSEINDRUCK: 'Dominant Impression of Age',
    ALTERSEINDRUCK: 'Impression of Age',
    ALTER: 'Age',
    ALTERSEINDRUECKE: 'Impressions of Age',
    DOMINANTECHARAKTEREIGENSCHAFTEN: 'Dominant Character Trait',
    CHARAKTEREIGENSCHAFTEN: 'Character Traits',
    FAMILIENSTAND: 'Familiy Status',
    FAMILIENSTANDLEDIG: 'single',
    FAMILIENSTANDVERHEIRATET: 'married',
    FAMILIENSTANDVERWITWET: 'widowed',
    FAMILIENSTANDGESCHIEDEN: 'divorced',
    ROLLENRELEVANZ: 'Relevance of Role',
    ROLLENRELEVANZHAUPTROLLE: 'Leading Part',
    ROLLENRELEVANZNEBENROLLE: 'Featured Part',
    ROLLENRELEVANZSTATIST: 'Extra',
    STEREOTYP: 'Stereotype',

    //RoleDeleteModal
    ROLLELOESCHENTEXT: '<p>Do you really want to delete the following role?</p><p><h2>#{{rollenid}}: {{rollenvorname}} {{rollennachname}}</h2></p>',

    //RoleCostumeOverview
    KOSTUEMUEBERSICHTVON: 'Costume Overview of',
    KOSTUEMUEBERSICHT: 'Costume Overview',
    KOSTUEME: 'Costumes',
    NEUESKOSTUEMANLEGEN: 'Create New Costume',
    BEZEICHNUNG: 'Denotation',
    DETAILSZUKOSTUEM: 'Show details of Costume <b>{{ kurztext }}</b>',
    KOMPOSITIONZEIGEN: 'Show Composition of Costume <b>{{ kurztext }}</b>',
    KOSTUEMLOESCHEN: 'Delete Costume!',
    KOSTUEMLOESCHENHEADING: 'Delete Costume "{{ kurztext }}"!',
    KOSTUEMLOESCHENTEXT: '<p>Do your really want to delete the following costume?</p><p><h2>#{{kostuemid}}: {{kostuemkurztext}}</h2></p>',

    //CostumeData
    KURZTEXT: 'Short Text',
    KOSTUEMKURZTEXT: 'Short Text of Costume',
    SZENENBESCHREIBUNG: 'Description of Scene',
    ZEITSTEMPEL: 'Timecodes',
    ZEITSTEMPELANFANG: 'Timecode Start',
    ZEITSTEMPELENDE: 'Timecode End',
    ZEITSTEMPELLOESCHEN: 'Delete Timecode!',
    ORTSBEGEBENHEIT: 'Occurence of Destination',
    ORTSBEGEBENHEITDRINNEN: 'indoors',
    ORTSBEGEBENHEITDRAUSSEN: 'outdoors',
    ORTSBEGEBENHEITDRINNENUNDDRAUSSEN: 'indoors & outdoors',
    STEREOTYPRELEVANT: 'Stereotype relevant',
    STEREOTYPRELEVANTJA: 'yes',
    STEREOTYPRELEVANTNEIN: 'no',
    STEREOTYPRELEVANTNEUTRAL: 'neutral',
    DOMINANTEFARBE: 'Dominant Colour',
    FARBENVONBASISELEMENTEN: 'Colours from Base Elements',
    DOMINANTEFUNKTION: 'Dominant Function',
    FUNKTIONENVONBASISELEMENTEN: 'Functions of Base Elements',
    DOMINANTERZUSTAND: 'Dominant Status',
    ZUSTAENDEVONBASISELEMENTEN: 'Status from Base Elements',
    KOERPERMODIFIKATIONEN: 'Modifications of Body',
    SPIELORTE: 'Venues',
    SPIELORT: 'Venue',
    SPIELORTFREITEXT: 'Venues Detail',
    SPIELORTLOESCHEN: 'Delete Venue!',
    SPIELZEITEN: 'Seasons',
    SPIELZEIT: 'Season',
    SPIELZEITVON: 'From',
    SPIELZEITBIS: 'To',
    SPIELZEITLOESCHEN: 'Delete Season!',
    TAGESZEITEN: 'Time of Day',

    //Costume
    KOMPOSITIONSUEBERSICHTVON: 'Composition Overview of',
    KOSTUEMDATEN: 'Costume Data',
    KOSTUEMERFOLGREICHGESPEICHERT: 'Costume successfully created!',
    KOSTUEMDATENEINAUSBLENDEN: 'Show/hide Costume Data',
    BASISELEMENTE: 'Base Elements',
    NEUESBASISELEMENTANLEGEN: 'Create New Base Element',
    NUREINBASISELEMENTOEFFNEN: 'Open one Base Element only',
    DETAILSZUBASISELEMENT: 'Details of Base Element',
    BASISELEMENTLOESCHEN: 'Delete Base Element!',
    KOSTUEM: 'Costume',
    TEILELEMENTE: 'Primitives',
    TEILELEMENT: 'Primitive',
    NEUESTEILELEMENTANLEGEN: 'Create New Primitive',
    DETAILSZUTEILELEMENT: 'Details of Primitive',
    TEILELEMENTLOESCHEN: 'Delete Primitive!',
    BASISELEMENTKOMPOSITION: 'Composition of Base Elements',
    BASISELEMENTKOMPOSITIONSUBJEKT: 'Subject',
    BASISELEMENTKOMPOSITIONOPERATOR: 'Operator',
    BASISELEMENTKOMPOSITIONOBJEKT: 'Object',
    RELATIONLOESCHEN: 'Delete Relation!',
    KOERPERTEILE: 'Body parts',

    //BasiselementDetails
    BASISELEMENTANLEGEN: 'Create Primitive',
    BASISELEMENT: 'Primitive',
    BASISELEMENTID: 'PrimitiveID',
    BASISELEMENTNAME: 'Primitive Name',
    DESIGNS: 'Designs',
    FORMEN: 'Shapes',
    TRAGEWEISEN: 'Ways of Wearing',
    ZUSTAENDE: 'Status',
    FUNKTIONEN: 'Functions',
    MATERIALIEN: 'Materials',
    MATERIAL: 'Material',
    MATERIALEINDRUCK: 'Material Impression',
    MATERIALNAME: 'Material Name',
    MATERIALLOESCHEN: 'Delete Material!',
    FARBE: 'Colour',
    FARBEN: 'Colours',
    FARBEINDRUCK: 'Colour Impression',
    FARBNAME: 'Colour Name',
    FARBELOESCHEN: 'Delete Colour!',

    //TeilelementDetails
    TEILELEMENTANLEGEN: 'Create Primitive',
    TEILELEMENTID: 'Primitive ID',
    TEILELEMENTNAME: 'Primitive Name',


    //Error Modal Elements
    ERRORMODALTITLE: 'An Error occurred',
    ERRORMODALBODY: 'Error message',

    //Kompositionsgraph
    NETWORK_GRAPH: 'Costume Composition Graph',
    RELOAD_DATA: 'Relaod Data.',
    REDRAW_GRAPH: 'Redraw Graph.',
    NODE_SIZE: 'Baseelement Size:',
    NETWORK_GRAPH_EIN_AUSBLENDEN: 'Show/hide Costume Composition Graph',

    //Admin panel
    ADMIN_PANEL: 'Admin Panel',
    EDITOR: 'Editor',
    CAN_EDIT: 'Can edit',
    TAX_ADMIN: 'Taxonomy Admin',
    EDIT_TAXONOMIES: 'Can edit taxonomies',
    ADMIN: 'Admin',
    IS_ADMIN: 'Is Admin',

    //Analysis page
    ANALYSIS: 'Analyse',

    //Statistic panel
    STATISTIK: 'Staistic:',
    NR_OF_FILMS: 'Nr. of Films',
    NR_OF_COSTUMES: 'Nr. of Costumes',
    NR_OF_COSTUMES_PER_FILM: 'Average Nr. of Costumes per Film',
    NR_OF_BASE_ELEMENTS: 'Nr. of Base Elements',
    NR_OF_BASE_ELEMENTS_PER_COSTUME: 'Average Nr. of Base Elements per Costume',
    NR_OF_PRIMITIVES: 'Nr. of Primitives',
    NR_OF_PRIMITIVES_PER_COSTUME: 'Average Nr. of Primitives per Costume',
    NR_OF_PRIMITIVES_PER_BASE_ELEMENT: 'Average Nr. of Primitives per Base Element',
    ASSIGNED_COLORS: '~Nr. of assigned Colors',
    ASSIGNED_MATERIALS: '~Nr. of assigned Materials',

    //Taxonomy page
    TAXONOMIES: 'Taxonomies',

};
