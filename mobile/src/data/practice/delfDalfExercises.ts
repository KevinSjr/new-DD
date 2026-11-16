import type { FrenchChoice, FrenchSection } from './delfDalfPractice.ts'

type Group = { level: string; skill: 'listening' | 'reading'; number: number; title: string; document: string; rows: string; listens?: number }

// Each row is question | correct answer | distractor | distractor. All documents are original.
const groups: Group[] = [
  {level:'A1',skill:'listening',number:1,title:'Invitation téléphonique',document:`Bonjour Léa, c'est Marc. Samedi, je fête mon anniversaire chez moi, au 12 rue des Fleurs. La fête commence à 19 heures. Apporte une boisson, s'il te plaît. Mon frère Paul prépare le gâteau. À samedi !`,rows:`Qui appelle Léa ?|Marc|Paul|Marie
Quel jour a lieu la fête ?|Samedi|Vendredi|Dimanche
À quelle heure commence la fête ?|19 heures|17 heures|20 heures
Que doit apporter Léa ?|Une boisson|Un gâteau|Un livre`},
  {level:'A1',skill:'listening',number:2,title:'Annonce à la gare',document:`Attention, le train pour Lyon partira de la voie 4 à 10 h 15. Il s'arrêtera à Dijon. Les voyageurs doivent monter avant 10 h 10. Le café de la gare est fermé aujourd'hui. Pour acheter une boisson, rendez-vous au distributeur près de l'entrée.`,rows:`Quelle est la destination du train ?|Lyon|Dijon|Paris
De quelle voie part le train ?|La voie 4|La voie 2|La voie 6
À quelle heure part-il ?|10 h 15|10 h 10|11 h 15
Où peut-on acheter une boisson ?|Au distributeur|Au café|Dans le train`},
  {level:'A1',skill:'listening',number:3,title:'Consignes de cours',document:`Bonjour à tous. Le cours de français commence dans la salle 8. Aujourd'hui, nous allons lire la page 25 du livre bleu. Après la pause de midi, nous travaillerons en petits groupes. Le cours finit à 16 heures. Demain, apportez une photo de votre ville.`,rows:`Dans quelle salle a lieu le cours ?|La salle 8|La salle 5|La salle 12
Quelle page faut-il lire ?|La page 25|La page 15|La page 35
Quand les élèves travaillent-ils en groupes ?|Après la pause de midi|Avant le cours|Demain matin
Que faut-il apporter demain ?|Une photo|Un livre rouge|Un ordinateur`},
  {level:'A1',skill:'listening',number:4,title:'Quatre petites situations',document:`1. À la boulangerie, Nora achète du pain. 2. À la bibliothèque, Karim emprunte un livre. 3. Au parc, Julie promène son chien. 4. À la piscine, Hugo nage avec sa sœur.`,rows:`Où est Nora ?|À la boulangerie|Au parc|À la piscine
Que fait Karim ?|Il emprunte un livre|Il achète du pain|Il nage
Qui promène son chien ?|Julie|Nora|Hugo
Avec qui Hugo nage-t-il ?|Sa sœur|Son frère|Son ami`},
  {level:'A1',skill:'listening',number:5,title:'Message du centre sportif',document:`Le centre sportif ouvre lundi à 8 heures. La piscine est fermée mardi, mais la salle de danse reste ouverte. Les cours de tennis commencent mercredi. L'inscription se fait à l'accueil. Les enfants de moins de douze ans entrent avec un adulte.`,rows:`Le centre ouvre lundi à 8 heures.|Vrai|Faux
La piscine est ouverte mardi.|Faux|Vrai
Les cours de tennis commencent mercredi.|Vrai|Faux
On s'inscrit sur Internet.|Faux|Vrai
Les jeunes enfants entrent avec un adulte.|Vrai|Faux`},
  {level:'A1',skill:'reading',number:1,title:'Courriel personnel',document:`Salut Emma ! Je suis à Nantes avec ma famille. Nous restons jusqu'à dimanche. Jeudi, nous visitons le château. Vendredi, nous allons à la plage en bus. Il pleut aujourd'hui, alors je porte un manteau. Je t'envoie une photo demain. À bientôt, Lucas.`,rows:`Qui écrit le message ?|Lucas|Emma|La famille
Dans quelle ville se trouve-t-il ?|Nantes|Lyon|Paris
Quand visite-t-il le château ?|Jeudi|Vendredi|Dimanche
Comment va-t-il à la plage ?|En bus|En train|À vélo
Quel temps fait-il aujourd'hui ?|Il pleut|Il neige|Il fait très chaud`},
  {level:'A1',skill:'reading',number:2,title:'Affiche de bibliothèque',document:`BIBLIOTHÈQUE DU QUARTIER. Ouverte du mardi au samedi, de 9 h à 18 h. Fermée le lundi. Inscription gratuite. Chaque personne peut emprunter trois livres pendant deux semaines. Les enfants de moins de 8 ans viennent avec un adulte. Atelier de dessin le samedi à 14 h.`,rows:`Quel jour la bibliothèque est-elle fermée ?|Lundi|Mardi|Samedi
Combien coûte l'inscription ?|Elle est gratuite|5 euros|10 euros
Combien de livres peut-on emprunter ?|Trois|Deux|Cinq
Combien de temps garde-t-on les livres ?|Deux semaines|Un jour|Un mois
Quand a lieu l'atelier de dessin ?|Samedi à 14 h|Lundi à 9 h|Mardi à 18 h`},
  {level:'A1',skill:'reading',number:3,title:'Petites annonces',document:`ANNONCE A : Atelier de cuisine, mercredi à 16 h, 8 euros. ANNONCE B : Match de football, vendredi à 18 h, entrée gratuite. ANNONCE C : Concert de piano, samedi à 20 h, 12 euros. ANNONCE D : Promenade au parc, dimanche à 10 h, rendez-vous devant la mairie.`,rows:`Quelle activité a lieu mercredi ?|La cuisine|Le football|Le concert
Quelle activité est gratuite ?|Le football|La cuisine|Le concert
Quand commence le concert ?|Samedi à 20 h|Vendredi à 18 h|Dimanche à 10 h
Où commence la promenade ?|Devant la mairie|À la bibliothèque|Au stade
Combien coûte l'atelier de cuisine ?|8 euros|12 euros|0 euro`},
  {level:'A1',skill:'reading',number:4,title:'Horaires et consignes',document:`ÉCOLE DE MUSIQUE. Accueil : lundi, mercredi et vendredi de 10 h à 17 h. Cours de guitare : mardi à 18 h. Cours de piano : jeudi à 16 h. Pour le premier cours, apportez un cahier et un stylo. Il est interdit de manger dans les salles. Le paiement se fait à l'accueil.`,rows:`Quel jour l'accueil est-il ouvert ?|Mercredi|Mardi|Jeudi
Quand a lieu le cours de guitare ?|Mardi à 18 h|Jeudi à 16 h|Vendredi à 10 h
Quel instrument apprend-on jeudi ?|Le piano|La guitare|Le violon
Que doit-on apporter au premier cours ?|Un cahier et un stylo|Un repas|Un ordinateur
Où peut-on payer ?|À l'accueil|Dans la salle|Sur le bus`},
  {level:'A2',skill:'listening',number:1,title:'Annonces pratiques',document:`Annonce 1 : Le marché ferme exceptionnellement à 16 heures ce jeudi à cause des travaux sur la place. Les commerçants seront installés devant la mairie. Annonce 2 : Le musée propose une visite gratuite dimanche matin ; il faut réserver avant vendredi. Annonce 3 : Le bus 6 est remplacé par une navette entre la gare et l'hôpital jusqu'à lundi.`,rows:`Pourquoi le marché ferme-t-il plus tôt ?|À cause des travaux|À cause de la pluie|À cause d'une fête
À quelle heure ferme-t-il jeudi ?|À 16 heures|À 18 heures|À 14 heures
Où se trouvent les commerçants ?|Devant la mairie|À la gare|Dans le musée
Quand la visite du musée est-elle gratuite ?|Dimanche matin|Vendredi soir|Jeudi matin
Que faut-il faire avant vendredi ?|Réserver la visite|Acheter un billet de bus|Appeler l'hôpital
Quelle ligne est remplacée ?|Le bus 6|Le bus 3|Le train 6`},
  {level:'A2',skill:'listening',number:2,title:'Messages vocaux',document:`Message de Sofia : J'arrive à Grenoble vendredi vers 18 heures. Je dormirai chez ma tante, près de la gare. Samedi matin, je passerai à la librairie pour acheter un dictionnaire. Rejoins-moi au café du centre à 13 heures. Si tu travailles samedi, nous pouvons nous voir dimanche après le déjeuner. N'oublie pas de m'apporter le livre que je t'ai prêté.`,rows:`Quand Sofia arrive-t-elle ?|Vendredi|Samedi|Dimanche
À quelle heure arrive-t-elle environ ?|Vers 18 heures|Vers 13 heures|Vers 8 heures
Chez qui va-t-elle dormir ?|Chez sa tante|Chez son amie|À l'hôtel
Que va-t-elle acheter ?|Un dictionnaire|Un billet|Un cahier
Où propose-t-elle de se retrouver ?|Au café du centre|À la gare|À la librairie
Quel objet veut-elle récupérer ?|Un livre prêté|Une photo|Une clé`},
  {level:'A2',skill:'listening',number:3,title:'Entretien à la radio locale',document:`Animatrice : Notre invité, Thomas, organise un jardin collectif. Thomas : Nous avons commencé en avril avec six voisins. La ville nous prête un terrain derrière l'école. Les bénévoles se retrouvent chaque mercredi après-midi. Les débutants sont les bienvenus ; les outils sont disponibles sur place. En juin, nous organiserons un atelier gratuit sur les plantes aromatiques. Nous cherchons surtout des personnes pour arroser les plants pendant les vacances.`,rows:`Quand le projet a-t-il commencé ?|En avril|En juin|En janvier
Combien de voisins ont commencé ?|Six|Trois|Dix
Qui prête le terrain ?|La ville|L'école|Une entreprise
Où se trouve le terrain ?|Derrière l'école|Près de la gare|Devant la mairie
Quand les bénévoles se retrouvent-ils ?|Mercredi après-midi|Samedi matin|Jeudi soir
Quelle aide est recherchée pour les vacances ?|Arroser les plants|Vendre les outils|Donner des cours`},
  {level:'A2',skill:'listening',number:4,title:'Quatre dialogues',document:`1. — Tu peux fermer la fenêtre ? Il fait froid. — Bien sûr. 2. — Je voudrais changer ce pull, il est trop petit. — Vous avez le ticket ? 3. — Le prochain train part de quel quai ? — Du quai 7. 4. — Tu viens au cinéma ce soir ? — Désolé, je dois travailler.`,rows:`Que demande la première personne ?|Fermer la fenêtre|Ouvrir la porte|Allumer la lumière
Pourquoi le pull doit-il être changé ?|Il est trop petit|Il est trop grand|Il est sale
De quel quai part le train ?|Du quai 7|Du quai 3|Du quai 9
Pourquoi la dernière personne refuse-t-elle ?|Elle doit travailler|Elle est malade|Elle voyage`},
  {level:'A2',skill:'reading',number:1,title:'Informations de voyage',document:`TRAIN RÉGIONAL : Départ de Lille à 9 h 20, arrivée à Amiens à 10 h 35. Billet adulte : 15 euros ; tarif jeune : 9 euros. Les vélos sont acceptés gratuitement dans la voiture 3. En cas de retard supérieur à 30 minutes, demandez un formulaire à l'accueil. Le guichet ferme à 18 h. Les billets peuvent également être achetés sur le site de la compagnie.`,rows:`D'où part le train ?|De Lille|D'Amiens|De Paris
À quelle heure arrive-t-il ?|À 10 h 35|À 9 h 20|À 11 h 35
Combien coûte le tarif jeune ?|9 euros|15 euros|30 euros
Où place-t-on les vélos ?|Dans la voiture 3|Dans la voiture 1|Au guichet
Quand peut-on demander un formulaire ?|Après plus de 30 minutes de retard|Pour tout retard de 5 minutes|Avant de monter
Où peut-on acheter un billet sans aller au guichet ?|Sur le site de la compagnie|À l'hôpital|Dans le musée`},
  {level:'A2',skill:'reading',number:2,title:'Courriel de candidature',document:`Bonjour Madame, je souhaite participer à l'atelier de photographie du mois de mai. Je suis débutante, mais j'utilise déjà un appareil numérique. Je peux venir le mardi ou le jeudi après 17 heures. Le prix affiché sur votre site est de 40 euros ; ce tarif comprend-il le matériel ? Pourriez-vous également m'indiquer si je dois envoyer une photo avant le premier cours ? Merci, Inès.`,rows:`À quelle activité Inès veut-elle participer ?|La photographie|La peinture|La musique
Quel est son niveau ?|Débutante|Professionnelle|Enseignante
Quel appareil possède-t-elle déjà ?|Un appareil numérique|Un appareil ancien|Une caméra vidéo
Quel jour peut-elle venir ?|Le jeudi|Le lundi|Le samedi
Quel prix a-t-elle vu ?|40 euros|17 euros|50 euros
Sur quoi demande-t-elle une précision ?|Le matériel compris dans le prix|Le lieu de l'atelier|La durée du mois de mai`},
  {level:'A2',skill:'reading',number:3,title:'Programme associatif',document:`CENTRE CULTUREL : Lundi 18 h, club de lecture gratuit. Mardi 19 h, cours de danse, inscription obligatoire. Mercredi 14 h, atelier pour enfants de 8 à 12 ans. Jeudi 17 h, conversation en français, sans réservation. Vendredi 20 h, film suivi d'un débat. Le centre ferme samedi pour entretien et rouvre dimanche à 11 h pour une exposition.`,rows:`Quelle activité est gratuite lundi ?|Le club de lecture|Le cours de danse|Le film
Pour quelle activité faut-il s'inscrire ?|Le cours de danse|La conversation|L'exposition
À qui s'adresse l'atelier du mercredi ?|Aux enfants de 8 à 12 ans|Aux adultes|Aux enfants de moins de 5 ans
Quand a lieu la conversation en français ?|Jeudi à 17 h|Mardi à 19 h|Vendredi à 20 h
Que suit la projection du film ?|Un débat|Un concert|Un repas
Pourquoi le centre ferme-t-il samedi ?|Pour entretien|Pour vacances|Pour travaux de rue`},
  {level:'A2',skill:'reading',number:4,title:'Article de quartier',document:`Une ancienne boutique est devenue un lieu d'échange de livres. Les habitants peuvent déposer un ouvrage et en choisir un autre sans payer. Le projet a été créé par trois voisines en septembre. Aujourd'hui, quinze bénévoles ouvrent le local quatre après-midi par semaine. Les livres pour enfants sont les plus demandés. L'association souhaite bientôt organiser des lectures publiques, mais elle cherche encore une salle plus grande.`,rows:`Quel était le local avant le projet ?|Une boutique|Une école|Un café
Que peut-on y faire ?|Échanger des livres gratuitement|Acheter des journaux|Louer des vélos
Quand le projet a-t-il été créé ?|En septembre|En janvier|En juin
Combien de bénévoles participent maintenant ?|Quinze|Trois|Quatre
Pourquoi l'association cherche-t-elle une autre salle ?|Pour organiser des lectures publiques|Pour vendre des livres|Pour fermer le local`},
  {level:'B1',skill:'listening',number:1,title:'Conversation entre amis',document:`Camille : Tu as trouvé un stage pour cet été ? Sami : Oui, dans une association qui organise des sorties pour les jeunes. Je commence le 3 juillet et j'y resterai six semaines. Je voulais travailler à l'étranger, mais le voyage coûtait trop cher. Ici, je vais préparer les activités du matin et accompagner les groupes l'après-midi. Je ne serai pas payé, mais mes repas seront offerts. La responsable m'a demandé de suivre une formation de deux jours avant de commencer.`,rows:`Quel poste Sami a-t-il trouvé ?|Un stage dans une association|Un emploi dans un hôtel|Un cours à l'université
À qui s'adressent les activités ?|Aux jeunes|Aux touristes âgés|Aux enseignants
Quand commence-t-il ?|Le 3 juillet|Le 3 juin|Le 13 juillet
Combien de temps restera-t-il ?|Six semaines|Deux jours|Trois mois
Pourquoi a-t-il abandonné le projet à l'étranger ?|Le voyage était trop cher|Il a raté un examen|Il ne parle pas anglais
Que reçoit-il au lieu d'un salaire ?|Des repas|Un logement|Des billets de train`},
  {level:'B1',skill:'listening',number:2,title:'Reportage sur un atelier partagé',document:`Journaliste : Dans cette petite ville, un atelier permet aux habitants de réparer leurs appareils au lieu de les jeter. Le projet a commencé dans un garage prêté par la mairie. Chaque samedi, des bénévoles aident les visiteurs à comprendre la panne, mais ils ne réparent pas à leur place. L'entrée est libre ; les pièces de rechange restent à la charge du propriétaire. Depuis janvier, le groupe reçoit deux fois plus de visiteurs. Il manque surtout des personnes capables de réparer les vélos. Les organisateurs espèrent ouvrir un deuxième atelier près de la gare, si la ville trouve un local adapté.`,rows:`Quel est l'objectif de l'atelier ?|Réparer plutôt que jeter|Vendre des appareils neufs|Former des commerçants
Qui a prêté le premier lieu ?|La mairie|Une entreprise|Une école
Quand les bénévoles sont-ils présents ?|Le samedi|Le lundi|Chaque soir
Que font les visiteurs eux-mêmes ?|Ils participent à la réparation|Ils paient une entrée|Ils remplacent les bénévoles
Qui paie les pièces nécessaires ?|Le propriétaire de l'objet|La mairie|Les bénévoles
Comment la fréquentation a-t-elle changé depuis janvier ?|Elle a doublé|Elle a diminué|Elle est restée identique
Quelle compétence manque surtout ?|La réparation des vélos|La couture|La programmation`},
  {level:'B1',skill:'listening',number:3,title:'Entretien sur les transports',document:`Animatrice : La ville lance un abonnement commun pour le bus et les vélos partagés. Directrice : Nous voulons faciliter les courts trajets sans voiture. Le tarif étudiant sera réduit, mais il faudra présenter une carte en cours de validité. Pendant trois mois, les usagers pourront signaler les problèmes sur une application ou à l'accueil de la gare. Une association demande davantage de vélos près de l'hôpital. Nous allons observer la demande avant d'ajouter des stations. Le but n'est pas de supprimer les bus : les deux services doivent se compléter. Nous publierons un bilan après l'essai.`,rows:`Quels services l'abonnement réunit-il ?|Le bus et les vélos|Le train et les taxis|Le métro et les voitures
Quel objectif est annoncé ?|Réduire les courts trajets en voiture|Fermer la gare|Supprimer les bus
Qui bénéficie d'un tarif réduit ?|Les étudiants|Tous les touristes|Les automobilistes
Quel document faut-il présenter ?|Une carte étudiante valide|Un permis de conduire|Une facture
Combien de temps dure l'essai ?|Trois mois|Un mois|Un an
Où peut-on signaler un problème sans application ?|À l'accueil de la gare|À l'hôpital|Dans le bus
Que demande l'association ?|Plus de vélos près de l'hôpital|Moins de bus|Un nouveau train`},
  {level:'B1',skill:'reading',number:1,title:'Comparer quatre annonces',document:`A — Résidence du Parc : chambre à 420 €, près de l'université, internet compris, cuisine commune. B — Maison des Arts : chambre à 390 €, à vingt minutes en bus, animaux acceptés, internet non compris. C — Studio du Centre : 560 €, à cinq minutes de la gare, cuisine privée, animaux interdits. D — Foyer des Étudiants : 350 €, à dix minutes à vélo du campus, repas du soir compris, cuisine interdite. Chaque logement demande un dépôt de garantie d'un mois.`,rows:`A coûte moins de 400 €.|Faux|Vrai
A comprend internet.|Vrai|Faux
A dispose d'une cuisine commune.|Vrai|Faux
A est près de l'université.|Vrai|Faux
B accepte les animaux.|Vrai|Faux
B comprend internet dans le prix.|Faux|Vrai
B est accessible en bus.|Vrai|Faux
B coûte plus de 400 €.|Faux|Vrai
C a une cuisine privée.|Vrai|Faux
C permet les animaux.|Faux|Vrai
C est près de la gare.|Vrai|Faux
C est le logement le moins cher.|Faux|Vrai
D comprend le repas du soir.|Vrai|Faux
D permet de cuisiner.|Faux|Vrai
D est accessible à vélo depuis le campus.|Vrai|Faux
D demande un dépôt de garantie.|Vrai|Faux`},
  {level:'B1',skill:'reading',number:2,title:'Article sur une médiathèque',document:`La médiathèque du quartier a prolongé ses horaires pendant la période des examens. Elle ouvre désormais jusqu'à 21 heures du mardi au vendredi. La décision répond aux demandes d'étudiants qui ne disposent pas d'un lieu calme à la maison. Les livres peuvent toujours être empruntés jusqu'à 18 heures ; après cette heure, seules les salles de travail restent accessibles. Une enquête sera menée après deux mois. Le personnel souhaite connaître le nombre de visiteurs, mais aussi les difficultés de retour le soir. Si l'essai fonctionne, les nouveaux horaires pourraient être maintenus en hiver.`,rows:`Pourquoi les horaires ont-ils changé ?|Pour répondre aux étudiants|Pour vendre davantage de livres|Pour fermer les salles
Jusqu'à quelle heure les salles sont-elles ouvertes ?|21 heures|18 heures|23 heures
Quels jours les nouveaux horaires s'appliquent-ils ?|Du mardi au vendredi|Tous les jours|Le week-end seulement
Peut-on emprunter un livre à 20 heures ?|Non|Oui|Seulement le samedi
Quand l'enquête aura-t-elle lieu ?|Après deux mois|Après deux semaines|Après un an
Quel risque le personnel veut-il examiner ?|Le retour des visiteurs le soir|Le prix des livres|La taille des salles
À quelle condition les horaires pourraient-ils durer ?|Si l'essai fonctionne|Si l'entrée devient payante|Si l'hiver est doux`},
  {level:'B1',skill:'reading',number:3,title:'Tribune sur le bénévolat',document:`De plus en plus de jeunes choisissent de participer à des projets locaux pendant leurs études. Le bénévolat permet de découvrir un domaine professionnel et de rencontrer des personnes différentes. Cependant, il ne doit pas remplacer un emploi qui devrait être payé. Certaines associations confient aux volontaires des responsabilités trop lourdes sans accompagnement. Pour éviter cela, une formation initiale et un référent sont utiles. Les étudiants doivent aussi pouvoir adapter leurs horaires pendant les examens. Une expérience bénévole a de la valeur si elle aide réellement le public et respecte ceux qui la réalisent.`,rows:`Quel avantage professionnel est cité ?|Découvrir un domaine|Obtenir automatiquement un diplôme|Éviter les examens
Que permet aussi le bénévolat ?|Rencontrer des personnes différentes|Voyager gratuitement|Recevoir un salaire
Quel remplacement l'auteur critique-t-il ?|Celui d'un emploi rémunéré|Celui des cours de sport|Celui des vacances
Quel problème peut toucher les volontaires ?|Trop de responsabilités sans aide|Trop de formations|Aucun contact avec le public
Que recommande l'auteur au début ?|Une formation initiale|Une sélection par âge|Une obligation de voyager
Qui peut accompagner un volontaire ?|Un référent|Un client|Un examinateur
Quand les horaires devraient-ils être adaptés ?|Pendant les examens|Pendant l'été seulement|Jamais`},
  {level:'B2',skill:'listening',number:1,title:'Entretien sur le partage d’objets',document:`Animatrice : Une bibliothèque d'objets vient d'ouvrir. Son responsable explique que de nombreux appareils sont achetés pour un usage très rare. L'inscription est gratuite et le prêt dure une semaine. Au début, les habitants craignaient de ne jamais trouver les outils disponibles ; un calendrier de réservation a donc été créé. Des bénévoles vérifient le matériel au retour. Les appareils de cuisine sont aujourd'hui les plus demandés. L'équipe envisage un second lieu, mais souhaite d'abord mesurer les coûts de réparation. Une contribution n'est demandée que lorsqu'un objet revient abîmé.`,rows:`Quel constat a motivé le projet ?|Des objets servent rarement|Les magasins ferment tôt|Les outils sont interdits
Combien coûte l'inscription ?|Rien|Un abonnement mensuel|Une caution obligatoire
Combien de temps dure un prêt ?|Une semaine|Un jour|Un mois
Quelle crainte initiale avait le public ?|L'indisponibilité des objets|La fermeture du quartier|Le manque de livres
Quelle solution a été mise en place ?|Un calendrier de réservation|Une vente privée|Une liste d'attente payante
Quels objets sont les plus demandés ?|Les appareils de cuisine|Les vélos|Les livres
Pourquoi le second lieu n'ouvre-t-il pas encore ?|Les coûts de réparation doivent être mesurés|Le premier lieu est fermé|La ville a interdit le prêt`},
  {level:'B2',skill:'listening',number:2,title:'Débat sur les horaires universitaires',document:`Une université teste l'ouverture de ses salles d'étude jusqu'à minuit durant six semaines. La direction invoque les besoins des étudiants salariés. Certains apprécient un espace calme sans frais supplémentaires ; d'autres soulignent que les transports publics se raréfient après 22 heures. Le personnel demande des plannings établis à l'avance et des effectifs suffisants. La direction recueillera les avis dans un questionnaire anonyme et comptera les entrées. Elle affirme qu'une forte fréquentation ne suffira pas : la sécurité des retours et les conditions de travail seront aussi examinées.`,rows:`Pourquoi l'essai a-t-il été lancé ?|Pour aider les étudiants salariés|Pour supprimer les cours|Pour fermer la bibliothèque
Quelle est la durée annoncée ?|Six semaines|Deux jours|Six mois
Quel avantage certains étudiants voient-ils ?|Un lieu calme gratuit|Un transport gratuit|Des cours individuels
Quelle inquiétude concerne le trajet ?|Les transports rares tard le soir|Le prix du déjeuner|La longueur des cours
Que demande le personnel ?|Des plannings anticipés|La fermeture immédiate|Des examens plus courts
Comment les avis seront-ils recueillis ?|Par questionnaire anonyme|Par vote public obligatoire|Par téléphone uniquement
Quelle donnée ne suffira pas à elle seule ?|La fréquentation|La sécurité|Les horaires`},
  {level:'B2',skill:'listening',number:3,title:'Chronique environnementale',document:`Dans une chronique, une urbaniste critique les annonces de végétalisation qui se limitent à planter quelques arbres. Selon elle, l'ombre et la baisse de température dépendent de l'essence choisie, de l'eau disponible et de l'entretien sur plusieurs années. Elle cite un quartier où les arbres ont été plantés sans consultation, puis retirés à cause de réseaux souterrains. Un autre projet a réussi grâce à une étude préalable et à la participation des habitants. L'urbaniste demande de publier des indicateurs de survie des plantations, pas seulement le nombre d'arbres mis en terre.`,rows:`Quelle pratique la spécialiste critique-t-elle ?|Se limiter au nombre d'arbres plantés|Étudier les sols|Consulter les habitants
Quel facteur influence l'ombre future ?|L'essence choisie|La couleur des bancs|Le prix des billets
Pourquoi des arbres ont-ils été retirés ?|À cause de réseaux souterrains|À cause d'un festival|À cause du froid
Qu'a favorisé le second projet ?|Une étude et la participation des habitants|Une décision secrète|L'absence d'entretien
Sur quelle durée faut-il prévoir l'entretien ?|Plusieurs années|Une journée|Une semaine
Quel indicateur recommande-t-elle ?|La survie des arbres|Le nombre d'affiches|Le nombre de voitures`},
  {level:'B2',skill:'reading',number:1,title:'Article argumentatif : jardins partagés',document:`Dans plusieurs communes, des jardins partagés ont remplacé de petits terrains abandonnés. Les habitants y cultivent des légumes, mais le projet vise surtout à créer des rencontres. Une association prête les outils et organise des ateliers ouverts aux débutants. Les parcelles ne sont attribuées à personne de façon permanente : chacun réserve un créneau et entretient les espaces communs. Les décisions sur les cultures et l'eau se prennent en réunion mensuelle. Les récoltes restent modestes ; la coordinatrice rappelle que le jardin n'a jamais promis de nourrir tout le quartier. L'association souhaite installer un récupérateur d'eau de pluie, sous réserve de l'accord du propriétaire.`,rows:`Quel était l'état des terrains avant le projet ?|Ils étaient abandonnés|Ils étaient cultivés|Ils étaient bâtis
Quel objectif dépasse la production de légumes ?|Créer des liens entre voisins|Vendre les récoltes|Former des ingénieurs
À qui s'adressent les ateliers ?|Aux débutants aussi|Aux experts seuls|Aux enfants seuls
Pourquoi les parcelles ne sont-elles pas permanentes ?|Pour éviter une appropriation individuelle|Pour préparer une vente|Pour réduire les réunions
Qui entretient les parties communes ?|Les participants|Le propriétaire seul|La mairie seule
Comment les décisions importantes sont-elles prises ?|En réunion mensuelle|Par tirage au sort|Par une entreprise
De quoi dépend l'installation du récupérateur ?|De l'accord du propriétaire|Du nombre de récoltes|De la météo du jour`},
  {level:'B2',skill:'reading',number:2,title:'Analyse : salles d’étude',document:`La prolongation des horaires d'une bibliothèque universitaire répond à une demande ancienne. Les étudiants qui travaillent le jour y voient une possibilité de préparer les examens sans frais. Mais les transports deviennent rares après 22 heures, ce qui rend le retour difficile pour certains. Le personnel d'accueil souhaite des horaires planifiés à l'avance et des renforts. La direction a donc limité l'essai à six semaines. Une enquête anonyme mesurera la satisfaction, tandis que des données de fréquentation indiqueront les moments réellement utilisés. La décision finale tiendra aussi compte de la sécurité et des conditions de travail : une salle ouverte ne sert à rien si une partie du public ne peut y accéder.`,rows:`Quel public a particulièrement demandé ce changement ?|Les étudiants qui travaillent|Les touristes|Les enseignants retraités
Quel avantage financier est mentionné ?|Un lieu d'étude sans frais|Une bourse automatique|Un billet de bus remboursé
Quel problème apparaît tard le soir ?|La rareté des transports|La fermeture des cafés|Le prix des livres
Que réclame le personnel ?|Une planification et des renforts|Une entrée payante|La suppression des salles
Pourquoi la mesure est-elle limitée dans le temps ?|Pour l'évaluer avant de la pérenniser|Pour fermer l'université|Pour remplacer les examens
Quel outil recueillera l'opinion des usagers ?|Une enquête anonyme|Une pétition nominative|Un concours
Quel critère complète la fréquentation ?|La sécurité et le travail|La météo seule|Le nombre de livres vendus`},
  {level:'B2',skill:'reading',number:3,title:'Tribune : expérimentation publique',document:`Les pouvoirs publics annoncent souvent un programme pilote comme s'il s'agissait déjà d'une solution. Pourtant, la valeur d'un essai dépend d'une question posée clairement au départ. Si l'objectif est de réduire les déplacements, il faut suivre les trajets réellement évités, et pas seulement le nombre d'inscriptions. Il faut aussi rendre visibles les personnes qui n'utilisent pas le service. Un formulaire exclusivement numérique peut exclure certains habitants ; un horaire unique peut en écarter d'autres. Publier les coûts et les effets indésirables ne condamne pas le projet : cette transparence permet de le modifier. Copier mécaniquement un modèle d'une grande ville dans une petite commune serait une erreur de méthode. L'expérimentation doit aider à décider, pas servir à justifier une décision déjà prise.`,rows:`Quelle confusion l'auteur critique-t-il ?|Présenter un pilote comme une solution acquise|Publier les coûts|Observer les usagers
Que faut-il définir avant l'essai ?|Une question et un objectif clairs|Un slogan|Un prix fixe
Quel indicateur convient à un objectif de mobilité ?|Les trajets évités|Les seules inscriptions|Le nombre de bureaux
Pourquoi étudier les non-usagers ?|Pour comprendre les obstacles d'accès|Pour les sanctionner|Pour augmenter artificiellement la fréquentation
Quel obstacle numérique est cité ?|Un formulaire uniquement en ligne|Un site traduit|Une inscription sur place
Comment l'auteur voit-il la transparence sur les défauts ?|Comme un moyen d'améliorer le projet|Comme une raison de tout arrêter|Comme une formalité inutile`},
]

type FormatOverride = {
  documents: string[]
  itemDocuments?: number[]
  rows?: string
  format?: FrenchChoice['format']
  matchOptions?: string[]
  matchAnswers?: number[]
  uniqueMatch?: boolean
  showAll?: boolean
  listenLimit?: number
}

// Multi-document and association exercises follow the support structure in FEI's 2024 matrix.
const formats: Record<string, FormatOverride> = {
  'A1-listening-4': {
    documents:[`1. — Je cherche un livre de français. — Regardez au deuxième étage. 2. — Je voudrais deux baguettes, s'il vous plaît. — Bien sûr. 3. — Mon chien aime courir ici. — Le mien aussi ! 4. — La piscine ouvre à quelle heure ? — À neuf heures.`],
    format:'matching',showAll:true,uniqueMatch:true,
    rows:`Associez le dialogue 1 à une situation.|Bibliothèque|Boulangerie|Piscine
Associez le dialogue 2 à une situation.|Boulangerie|Bibliothèque|Parc
Associez le dialogue 3 à une situation.|Parc|Piscine|Gare
Associez le dialogue 4 à une situation.|Piscine|Parc|Boulangerie`,
    matchOptions:['📚 Bibliothèque','🥖 Boulangerie','🌳 Parc','🏊 Piscine','🚉 Gare','🍽️ Restaurant'],matchAnswers:[0,1,2,3],
  },
  'A1-listening-5': {
    documents:[`Bonjour Léa. Pour notre promenade, j'ai mis une bouteille d'eau, un appareil photo et un livre dans mon sac. Tu peux apporter un chapeau. Il fera beau demain. N'oublie pas ton billet de train. À demain !`],
    rows:`Entendez-vous « bouteille d'eau » ?|Oui|Non
Entendez-vous « appareil photo » ?|Oui|Non
Entendez-vous « parapluie » ?|Oui|Non
Entendez-vous « livre » ?|Oui|Non
Entendez-vous « ordinateur » ?|Non|Oui`,format:'yes-no',
  },
  'A1-reading-3': {
    documents:[
      `Atelier de cuisine : mercredi à 16 h. Inscription à l'accueil. Prix : 8 euros.`,
      `Match de football : vendredi à 18 h au stade municipal. Entrée gratuite pour tous.`,
      `Concert de piano : samedi à 20 h dans la grande salle. Billet : 12 euros.`,
      `Promenade au parc : dimanche à 10 h. Rendez-vous devant la mairie.`,
      `Cours de dessin : lundi à 15 h à la maison des jeunes. Apportez un crayon.`,
    ],itemDocuments:[0,1,2,3,4],
    rows:`Quand a lieu la cuisine ?|Mercredi à 16 h|Samedi à 20 h|Dimanche à 10 h
Combien coûte le match ?|Il est gratuit|8 euros|12 euros
Quel instrument entend-on samedi ?|Le piano|La guitare|Le violon
Où commence la promenade ?|Devant la mairie|Au stade|À la gare
Que faut-il apporter lundi ?|Un crayon|Un ballon|Un billet`,
  },
  'A1-reading-4': {
    documents:[`L'école de musique du quartier accueille de nouveaux élèves cette année. L'accueil est ouvert lundi, mercredi et vendredi de dix à dix-sept heures. Le cours de guitare a lieu mardi à dix-huit heures et celui de piano jeudi à seize heures. Pour leur premier cours, les élèves apportent un cahier et un stylo. Ils ne mangent pas dans les salles. Les familles peuvent payer directement à l'accueil.`],
  },
  'A2-listening-1': {
    documents:[
      `Attention, le marché ferme à seize heures ce jeudi à cause des travaux sur la place. Retrouvez les commerçants devant la mairie.`,
      `Le musée propose une visite gratuite dimanche matin. Réservez votre place avant vendredi sur le site du musée.`,
      `La ligne six est remplacée par une navette entre la gare et l'hôpital jusqu'à lundi. Consultez les horaires affichés.`,
      `La piscine ouvre exceptionnellement à midi aujourd'hui. Les cours du matin sont reportés à samedi.`,
      `Pour l'atelier de photographie, rendez-vous dans la salle bleue au premier étage. Apportez votre appareil.`,
      `Le train pour Tours partira du quai neuf. Les voyageurs sont invités à monter dès maintenant.`,
    ],itemDocuments:[0,1,2,3,4,5],
    rows:`Pourquoi le marché ferme-t-il tôt ?|À cause des travaux|À cause du vent|À cause d'une fête
Quand la visite gratuite a-t-elle lieu ?|Dimanche matin|Vendredi soir|Jeudi matin
Quel transport remplace le bus six ?|Une navette|Un taxi|Un tramway
À quelle heure la piscine ouvre-t-elle ?|À midi|À huit heures|À seize heures
Où se trouve l'atelier de photographie ?|Dans la salle bleue|Dans la salle rouge|Dans le hall
De quel quai part le train pour Tours ?|Du quai neuf|Du quai six|Du quai trois`,
  },
  'A2-listening-2': {
    documents:[
      `Bonjour. La médiathèque organise une rencontre avec une auteure vendredi à 18 heures. L'entrée est libre, mais pensez à réserver.`,
      `Ce samedi, le centre sportif propose un cours de danse pour débutants à 10 heures. Les chaussures souples sont obligatoires.`,
      `La mairie ouvre une exposition sur les jardins du quartier dimanche après-midi. Les visiteurs peuvent apporter une photo de leur jardin.`,
    ],itemDocuments:[0,0,1,1,2,2],
    rows:`Quel événement a lieu à la médiathèque ?|Une rencontre avec une auteure|Un concert|Un atelier de cuisine
Que faut-il faire pour y participer ?|Réserver|Payer dix euros|Apporter un livre
À qui s'adresse le cours de danse ?|Aux débutants|Aux professionnels|Aux enfants seulement
Que faut-il porter au cours ?|Des chaussures souples|Un manteau|Un chapeau
Quel sujet présente l'exposition ?|Les jardins du quartier|Les trains anciens|Les livres
Que peuvent apporter les visiteurs ?|Une photo de jardin|Un gâteau|Un billet de train`,
  },
  'A2-listening-3': {
    documents:[`Bonjour Camille. Je t'appelle pour notre sortie de samedi. Le groupe se retrouve devant la gare à neuf heures, puis nous prendrons le bus pour le jardin collectif derrière l'école. L'entrée est gratuite, mais apporte ton déjeuner et une bouteille d'eau. Le responsable nous prêtera les outils. Si tu ne peux pas venir, préviens-moi avant vendredi soir. Nous rentrerons vers seize heures.`],
    rows:`Quel jour la sortie a-t-elle lieu ?|Samedi|Vendredi|Dimanche
Où le groupe se retrouve-t-il ?|Devant la gare|Devant l'école|À la mairie
Comment se rend-il au jardin ?|En bus|En train|À pied
Combien coûte l'entrée ?|Elle est gratuite|Six euros|Dix euros
Que faut-il apporter ?|Un déjeuner et de l'eau|Des outils|Une carte de bibliothèque
Quand faut-il prévenir en cas d'absence ?|Avant vendredi soir|Samedi soir|Lundi matin`,
  },
  'A2-listening-4': {
    documents:[
      `— Tu peux fermer la fenêtre ? J'ai froid. — Oui, tout de suite.`,
      `— Ce pull est trop petit. Je peux le changer ? — Oui, avec le ticket.`,
      `— Le prochain train part de quel quai ? — Du quai sept.`,
      `— Tu viens au cinéma ce soir ? — Désolé, je dois travailler.`,
    ],itemDocuments:[0,1,2,3],format:'matching',uniqueMatch:true,
    rows:`Quel acte de parole correspond au dialogue 1 ?|Demander de fermer une fenêtre|Demander un billet|Refuser une invitation
Quel acte de parole correspond au dialogue 2 ?|Demander un échange|Demander un horaire|Inviter un ami
Quel acte de parole correspond au dialogue 3 ?|Demander une information|Faire un achat|Refuser un service
Quel acte de parole correspond au dialogue 4 ?|Refuser une invitation|Donner un conseil|Accepter une offre`,
    matchOptions:['Demander de fermer une fenêtre','Demander un échange','Demander une information','Refuser une invitation','Demander un remboursement','Proposer un repas'],matchAnswers:[0,1,2,3],
  },
  'A2-reading-1': {
    documents:[
      `Club de lecture : jeudi soir, entrée gratuite. Venez avec un roman que vous aimez. La rencontre dure une heure et demie.`,
      `Atelier de photographie : samedi matin, appareils prêtés aux débutants. Inscription obligatoire avant mercredi.`,
      `Cours de cuisine végétarienne : mardi à 18 heures. Les ingrédients sont fournis ; réservez par téléphone.`,
      `Promenade guidée en forêt : dimanche à 9 heures. Prévoir de bonnes chaussures et une bouteille d'eau.`,
      `Concert de jazz : vendredi à 20 heures. Tarif réduit pour les étudiants sur présentation d'une carte valide.`,
      `Cours de français : lundi à 17 heures, niveau débutant. Le premier cours est gratuit et sans inscription.`,
    ],itemDocuments:[0,1,2,3,4,5],format:'matching',uniqueMatch:true,
    rows:`À qui convient l'offre 1 ?|À Inès, qui veut parler de livres|À Omar, qui cherche un concert|À Léa, qui veut cuisiner
À qui convient l'offre 2 ?|À Paul, qui apprend la photographie|À Sara, qui aime la randonnée|À Tom, qui cherche du jazz
À qui convient l'offre 3 ?|À Léa, qui veut cuisiner sans viande|À Inès, qui aime lire|À Paul, qui veut apprendre le français
À qui convient l'offre 4 ?|À Sara, qui veut marcher dans la nature|À Omar, qui veut lire|À Tom, qui veut danser
À qui convient l'offre 5 ?|À Tom, étudiant amateur de jazz|À Léa, qui veut cuisiner|À Paul, qui veut photographier
À qui convient l'offre 6 ?|À Maya, qui débute en français|À Sara, qui veut marcher|À Inès, qui veut lire`,
    matchOptions:['Inès : parler de livres','Paul : apprendre la photographie','Léa : cuisiner sans viande','Sara : marcher dans la nature','Tom : écouter du jazz','Maya : débuter en français','Omar : jouer au football','Nina : apprendre à nager'],matchAnswers:[0,1,2,3,4,5],
  },
  'A2-reading-3': {
    documents:[
      `Règlement de la bibliothèque : inscrivez-vous à l'accueil avec une pièce d'identité. Vous pouvez emprunter quatre livres pendant trois semaines. Les boissons sont interdites dans les salles de lecture.`,
      `Mode d'emploi : branchez l'appareil avant d'appuyer sur le bouton bleu. Attendez que le voyant vert s'allume. Débranchez-le après usage et rangez-le dans sa boîte.`,
      `Recette : coupez les tomates et les concombres. Mélangez-les avec deux cuillères d'huile d'olive. Ajoutez le sel juste avant de servir. Gardez le plat au frais.`,
    ],itemDocuments:[0,0,1,1,2,2],
    rows:`Que faut-il présenter pour s'inscrire ?|Une pièce d'identité|Une photo|Un billet
Combien de livres peut-on emprunter ?|Quatre|Deux|Six
Sur quel bouton faut-il appuyer ?|Le bouton bleu|Le bouton rouge|Le bouton noir
Quand faut-il débrancher l'appareil ?|Après usage|Avant de l'allumer|Pendant l'attente
Quels légumes faut-il couper ?|Tomates et concombres|Carottes et oignons|Pommes et poires
Quand ajoute-t-on le sel ?|Juste avant de servir|Avant de couper|Le lendemain`,
  },
  'A2-reading-4': {
    documents:[`Une ancienne boutique est devenue un lieu d'échange de livres. Les habitants peuvent déposer un ouvrage et en choisir un autre sans payer. Le projet a été créé par trois voisines en septembre. Aujourd'hui, quinze bénévoles ouvrent le local quatre après-midi par semaine. Les livres pour enfants sont les plus demandés. L'association souhaite bientôt organiser des lectures publiques, mais elle cherche encore une salle plus grande.`],
    rows:`L'échange de livres est gratuit.|Vrai|Faux
Quel était le local avant le projet ?|Une boutique|Une école|Un café
Quand le projet a-t-il été créé ?|En septembre|En janvier|En juin
Combien de bénévoles participent maintenant ?|Quinze|Trois|Quatre
Pourquoi l'association cherche-t-elle une autre salle ?|Pour organiser des lectures publiques|Pour vendre des livres|Pour fermer le local`,
  },
  'B1-reading-1': {
    documents:[
      `Résidence du Parc : chambre à 420 euros, près de l'université. Internet est compris et la cuisine est commune. Les animaux ne sont pas acceptés. Un dépôt de garantie d'un mois est demandé.`,
      `Maison des Arts : chambre à 390 euros, à vingt minutes en bus du campus. Les animaux sont acceptés, mais internet doit être payé séparément. Un dépôt de garantie est demandé.`,
      `Studio du Centre : 560 euros, à cinq minutes de la gare. Cuisine privée et internet compris. Les animaux sont interdits. Un dépôt de garantie d'un mois est demandé.`,
      `Foyer des Étudiants : 350 euros, à dix minutes à vélo du campus. Le repas du soir est compris. Il est interdit de cuisiner. Un dépôt de garantie est demandé.`,
    ],itemDocuments:[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3],format:'yes-no',
  },
  'B1-reading-2': {
    documents:[`La médiathèque du quartier a prolongé ses horaires pendant la période des examens. Elle ouvre désormais jusqu'à 21 heures du mardi au vendredi. La décision répond aux demandes d'étudiants qui ne disposent pas d'un lieu calme à la maison. Les livres peuvent toujours être empruntés jusqu'à 18 heures ; après cette heure, seules les salles de travail restent accessibles. Une enquête sera menée après deux mois. Le personnel souhaite connaître le nombre de visiteurs, mais aussi les difficultés de retour le soir. Si l'essai fonctionne, les nouveaux horaires pourraient être maintenus en hiver.`],
    rows:`Pourquoi les horaires ont-ils changé ?|Pour répondre aux étudiants|Pour vendre des livres|Pour fermer les salles
Jusqu'à quelle heure les salles sont-elles ouvertes ?|21 heures|18 heures|23 heures
Quels jours les nouveaux horaires s'appliquent-ils ?|Du mardi au vendredi|Tous les jours|Le week-end
Peut-on emprunter un livre à 20 heures ?|Non|Oui|Seulement le samedi
L'enquête aura lieu après deux mois.|Vrai|Faux
Le personnel ignore les difficultés de retour.|Faux|Vrai
Les nouveaux horaires pourraient rester en hiver.|Vrai|Faux`,
  },
  'B1-reading-3': {
    documents:[`De plus en plus de jeunes choisissent de participer à des projets locaux pendant leurs études. Le bénévolat permet de découvrir un domaine professionnel et de rencontrer des personnes différentes. Cependant, il ne doit pas remplacer un emploi qui devrait être payé. Certaines associations confient aux volontaires des responsabilités trop lourdes sans accompagnement. Pour éviter cela, une formation initiale et un référent sont utiles. Les étudiants doivent aussi pouvoir adapter leurs horaires pendant les examens. Une expérience bénévole a de la valeur si elle aide réellement le public et respecte ceux qui la réalisent.`],
    rows:`Quel avantage professionnel est cité ?|Découvrir un domaine|Obtenir un diplôme|Éviter les examens
Que permet aussi le bénévolat ?|Rencontrer des personnes différentes|Voyager gratuitement|Recevoir un salaire
Quel remplacement l'auteur critique-t-il ?|Celui d'un emploi rémunéré|Celui des cours de sport|Celui des vacances
Quel problème peut toucher les volontaires ?|Trop de responsabilités sans aide|Trop de formations|Aucun contact
Une formation initiale est conseillée.|Vrai|Faux
Un référent est inutile.|Faux|Vrai
Les horaires devraient s'adapter aux examens.|Vrai|Faux`,
  },
  'B2-listening-3': {
    documents:[
      `Une urbaniste explique que planter quelques arbres ne suffit pas. L'ombre future dépend de l'essence choisie et de l'eau disponible.`,
      `Dans un quartier, des arbres ont été retirés car les réseaux souterrains n'avaient pas été étudiés. Les habitants n'avaient pas été consultés.`,
      `Un autre projet a réussi grâce à une étude préalable et à la participation des habitants. La ville publie maintenant le taux de survie des plantations.`,
    ],itemDocuments:[0,0,1,1,2,2],listenLimit:1,
    rows:`Quelle pratique la spécialiste critique-t-elle ?|Se limiter à planter quelques arbres|Étudier les sols|Consulter les habitants
De quoi dépend l'ombre future ?|De l'essence et de l'eau|De la couleur des bancs|Du prix des billets
Pourquoi des arbres ont-ils été retirés ?|À cause de réseaux souterrains|À cause d'un festival|À cause du froid
Qui n'avait pas été consulté ?|Les habitants|Les touristes|Les libraires
Qu'a favorisé le dernier projet ?|Une étude et la participation du quartier|Une décision secrète|L'absence d'entretien
Quel indicateur la ville publie-t-elle ?|La survie des plantations|Le nombre d'affiches|Le nombre de voitures`,
  },
  'B2-reading-3': {
    documents:[
      `Alice, urbaniste : Un projet pilote n'est utile que si l'on définit d'abord ce qu'il doit apprendre. Pour réduire les déplacements, je mesurerais les trajets réellement évités. Je publierais aussi les coûts, même s'ils déçoivent.`,
      `Benoît, responsable associatif : La fréquentation ne dit pas qui reste dehors. Une inscription uniquement numérique peut exclure des habitants. Il faut écouter les personnes qui ne viennent jamais et adapter les horaires.`,
      `Clara, élue locale : Nous devons expérimenter, mais copier le modèle d'une métropole dans une petite commune n'a pas de sens. Un résultat décevant peut nous aider à choisir une autre solution.`,
    ],itemDocuments:[0,1,2,0,1,2],showAll:true,format:'matching',
    rows:`Qui insiste sur les trajets réellement évités ?|Alice|Benoît|Clara
Qui veut écouter les non-utilisateurs ?|Benoît|Alice|Clara
Qui critique la copie d'un modèle métropolitain ?|Clara|Alice|Benoît
Qui demande de publier les coûts ?|Alice|Benoît|Clara
Qui souligne l'exclusion numérique ?|Benoît|Alice|Clara
Qui voit un résultat décevant comme utile ?|Clara|Alice|Benoît`,
    matchOptions:['Alice','Benoît','Clara'],matchAnswers:[0,1,2,0,1,2],
  },
}

const illustrated:Record<string,Record<string,string>>={
  'a1-reading-1-4':{'En bus':'🚌','En train':'🚆','À vélo':'🚲'},
  'a1-reading-1-5':{'Il pleut':'🌧️','Il neige':'❄️','Il fait très chaud':'☀️'},
  'a1-reading-4-3':{'Le piano':'🎹','La guitare':'🎸','Le violon':'🎻'},
  'a1-listening-1-4':{'Une boisson':'🥤','Un gâteau':'🎂','Un livre':'📖'},
}

function parseRows(group:Group):FrenchChoice[] {
  const key=`${group.level}-${group.skill}-${group.number}`
  const config=formats[key]
  return (config?.rows??group.rows).trim().split('\n').map((line,index)=>{
    const [prompt,correct,...wrong]=line.split('|').map(part=>part.trim())
    const options=config?.matchOptions?[...config.matchOptions]:[correct,...wrong]
    const answer=config?.matchAnswers?.[index]??index%options.length
    if(!config?.matchOptions){options.splice(0,1);options.splice(answer,0,correct)}
    const id=`${group.level.toLowerCase()}-${group.skill}-${group.number}-${index+1}`
    const optionIcons=illustrated[id]?options.map(option=>illustrated[id][option]??'◻'):undefined
    const documentIndex=config?.itemDocuments?.[index]??0
    const documents=config?.documents??[group.document]
    const document=config?.showAll?documents.map((part,partIndex)=>`Document ${partIndex+1} — ${part}`).join('\n\n'):documents[documentIndex]
    const supportId=`${key}-${documentIndex+1}`
    return {id,kind:'choice',title:`Exercice ${group.number} · ${group.title}`,prompt,context:document,audio:group.skill==='listening'?document:undefined,options,answer,explanation:`O documento indica: ${options[answer]}.`,exercise:group.number,supportId,listenLimit:group.skill==='listening'?(config?.listenLimit??group.listens??2):undefined,format:optionIcons?'visual-choice':config?.format??(options.length===2?'yes-no':'multiple-choice'),documentLabel:config?.showAll?`${documents.length} documentos para comparar`:`Document ${documentIndex+1} de ${documents.length}`,optionIcons,uniqueMatch:config?.uniqueMatch}
  })
}

export function fullDelfTasks(level:string,skill:FrenchSection['id']):FrenchChoice[]|undefined {
  const matching=groups.filter(group=>group.level===level&&group.skill===skill)
  return matching.length?matching.flatMap(parseRows):undefined
}
