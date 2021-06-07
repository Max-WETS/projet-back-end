const LIMITE = 25;
const MOTS = ["AFRIQUE", "AGENT", "AIR", "ALIEN", "ALPES", "AMAZONE", "AMBULANCE",
"AMERIQUE", "ANGE", "ANTARCTIQUE", "POMME", "BRAS", "ATLANTIDE", "AUSTRALIE", "AZTEQUE",
"DOS", "BALLE", "BANDE", "BANQUE", "BAR", "ABOYER", "CHAUVE-SOURIS", "BATTERIE", "PLAGE", "OURS",
"BATTRE", "LIT", "PEKIN", "CLOCHE", "CEINTURE", "BERLIN", "BERMUDES", "MÛRE", "LOI", "BLOQUER",
"TABLEAU", "ECLAIR", "BOMBE", "LIEN", "EXPLOSION", "BOTTE", "BOUTEILLE", "ARC", "BOITE", "PONT",
"PINCEAU", "BILLET", "BUFFLE", "INSECTE", "CLAIRON", "BOUTON", "VEAU", "CANADA", "CAP", "CAPITAL",
"VOITURE", "CARDE", "CARROTTE", "CASINO", "MOULE", "CHAT", "CELLULE", "CENTAURE", "CENTRE", "CHAISE",
"CHANGEMENT", "CHARGER", "CHEQUE", "ARMOIRE", "POULE", "CHINE", "CHOCOLAT", "EGLISE", "CERCLE",
"FALAISE", "MANTEAU", "CLUB", "CODE", "FROID", "BANDE-DESSINEE", "COMPOSE", "CONCERT", "CONDUCTEUR",
"CONTRAT", "CHEF", "CUIVRE", "COTON", "COUR", "COUVERTURE", "GRUE", "CRASH", "CRIQUET",
"CROIX", "COURONNE", "CYCLE", "TCHEQUE", "DANSE", "DATE", "JOUR", "MORT", "TERRASSE", "DEGRE",
"DIAMAND", "DE", "DINOSAURE", "MALADIE", "DOCTEUR", "CHIEN", "PROJET", "DRAGON", "ROBE",
"EXERCICE", "GOUTTE", "CANARD", "NAIN", "AIGLE", "EGYPTE", "AMBASSADE", "MOTEUR", "ANGLETERRE",
"EUROPE", "OEIL", "VISAGE", "BLOND", "AUTOMNE", "VENTILATEUR", "BARRIERE", "CHAMP", "GUERRIER", "SILHOUETTE",
"FICHIER", "FILM", "FEU", "POISSON", "FLUTE", "MOUCHE", "PIED", "FORCE", "FORÊT", "FOURCHETTE",
"FRANCE", "JEU", "GA2", "GENIE", "ALLEMAGNE", "FANTÔME", "GEANT", "MIROIR", "GANT", "OR",
"GRACE", "HERBE", "GRECE", "VERT", "SOL", "JAMBON", "MAIN", "FAUCON", "TÊTE", "COEUR",
"HELICOPTERE", "HIMALAYA", "TROU", "HOLLYWOOD", "MIEL", "CAPOT", "CROCHET", "KLAXON", "CHEVAL",
"FER-A-CHEVAL", "HOPITAL", "HÔTEL", "GLACE", "CREME GLACEE", "INDE", "FER", "IVOIRE", "CRIC",
"CONFITURE", "JET", "JUPITER", "KANGOUROU", "KETCHUP", "CLE", "ENFANT", "ROI", "KIWI", "COUTEAU",
"CHEVALIER", "LABORATOIRE", "TOUR", "LASER", "AVOCAT", "PISTE", "CITRON", "LUTIN", "VIE", "LUMIERE",
"LIMOUSINE", "LIGNE", "CONNEXION", "LION", "LITIERE", "LOCH NESS", "SERRURE", "JOURNAL", "LONDRES",
"CHANCE", "COURRIER", "MAMMOUTH", "ERABLE", "MARBRE", "MARS", "MASSE", "MATCH", "MERCURE",
"MEXIQUE", "MICROSCOPE", "MILLIONAIRE", "MINE", "MENTE", "MISSILE", "MODELE", "TAUPE", "LUNE",
"MOSCOU", "MONT", "SOURIS", "BOUCHE", "TASSE", "ONGLE", "SERINGUE", "RESEAU", "NEW YORK", "NUIT",
"NINJA", "NOTE", "ROMAN", "INFIRMIERE", "NOIX", "PIEUVRE", "HUILE", "OLIVE", "OLYMPE", "OPERA",
"ORANGE", "ORGANE", "PALME", "POELE", "PANTALONS", "PAPIER", "PARACHUTE", "PARC", "PARTIE", "PASSE",
"COLLE", "PINGOUIN", "PHENIX", "PIANO", "TARTE", "PILOTE", "TIGE", "TUYAU", "PIRATE", "PISTOLET",
"PUITS", "PAS", "AVION", "PLASTIQUE", "ASSIETTE", "ORNITHORYNQUE", "JOUER", "SCENARIO", "POINT",
"POISON", "POLE", "POLICE", "PISCINE", "PORT", "POSTE", "KILO", "PRESSION", "PRINCESSE",
"CITROUILLE", "ELEVE", "PYRAMIDE", "REIN", "LAPIN", "RAQUETTE", "RAYON", "REVOLUTION", "ANNEAU",
"ROUGE-GORGE", "ROBOT", "ROCHER", "ROME", "RACINE", "ROSE", "ROULETTE", "ROND", "RANG", "REGLE",
"SATELLITE", "SATURN", "ECHELLE", "ECOLE", "SCIENTIFIQUE", "SCORPION", "ECRAN",
"PLONGEUR", "JOINT", "SERVEUR", "OMBRE", "SHAKESPEARE", "REQUIN", "BATEAU", "CHAUSSURE", "MAGASIN",
"TIR", "COULER", "GRATTE-CIEL", "GLISSER", "LIMACE", "TRAFIQUANT", "NEIGE", "BONHOMME DE NEIGE", "CHAUSSETTE",
"SOLDAT", "ÂME", "SON", "ESPACE", "SORT", "ARAIGNEE", "PIQUE", "VERTEBRE", "TACHE",
"PRINTEMPS", "ESPION", "CARRE", "STADE", "STAFF", "ETOILE", "ETAT", "BATON", "STOCK", "PAILLE",
"COURANT", "ATTAQUE", "CHAÎNE", "SOUS-MARIN", "COSTUME", "SUPERHEROS", "SWING", "INTERROMPRE", "TABLE",
"TABLETTE", "TAG", "QUEUE", "ROBINET", "PROFESSEUR", "TELESCOPE", "TEMPLE", "THEATRE", "VOLEUR",
"POUCE", "TIC", "CRAVATE", "TEMPS", "TOKYO", "DENT", "TORCHE", "VOIE", "TRAIN",
"TRIANGLE", "VOYAGE", "TRONC", "TUBE", "DINDE", "FOSSOYEUR", "LICORNE", "VIDE", "VAN",
"VETERINAIRE", "REVEIL", "MUR", "GUERRE", "LAVE-VAISSELLES", "WASHINGTON", "MONTRE", "EAU", "VAGUE", "TOILE",
"BIEN", "BALEINE", "FOUET", "VENT", "SORCIERE", "VER", "JARDIN"];
    
    function determinerJoueur1() {
      if (Math.random() < 0.5) {
        return "blue";
      } else {
        return "red";
      }
    }

    function nbrAleatoire(CartesTotalLength) {
        return Math.floor(Math.random() * CartesTotalLength);
      }

      function nveauNbreAleatoire(arr, cartesTotalesLength) {
        let nbrAle = nbrAleatoire(cartesTotalesLength);
      
        if ( arr.indexOf( nbrAle ) == -1 ) {
            arr.push(nbrAle);
        } 
        else {
          nveauNbreAleatoire(arr, cartesTotalesLength);
        };
      }

    function serieIndexAleatoires(nbrCartesAJouer, cartesTotalesLength) {
        let arrIdx = [];
      
        while (arrIdx.length < nbrCartesAJouer) {
          nveauNbreAleatoire(arrIdx, cartesTotalesLength);
        }
      
        return arrIdx;
      }
    

exports.MOTS = MOTS;
exports.LIMITE = LIMITE;

exports.cartesNvellePartie = function cartesNvellePartie(nbrCartesAJouer, cartesTotalesLength) {
    let arrIdx = serieIndexAleatoires(nbrCartesAJouer, cartesTotalesLength);
  
    let arrCartesNvellePartie = [];
  
    for (let idx of arrIdx) {
      arrCartesNvellePartie.push(MOTS[idx]);
    }
  
    return arrCartesNvellePartie;
  
  };

exports.distribMots = function distribMots(nbrCartesAJouer) {
    var arrIdxMots = serieIndexAleatoires(nbrCartesAJouer, nbrCartesAJouer);
  
    return [arrIdxMots.slice(0, 8), arrIdxMots.slice(8, 16), arrIdxMots[16]];
  };