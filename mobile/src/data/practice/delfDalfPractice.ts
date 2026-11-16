export type FrenchSkill = 'listening' | 'reading' | 'writing' | 'speaking'
export type FrenchChoice = {
  id: string
  kind: 'choice'
  title: string
  prompt: string
  context: string
  audio?: string
  options: string[]
  answer: number
  explanation: string
  exercise?: number
  supportId?: string
  listenLimit?: number
  format?: 'multiple-choice' | 'matching' | 'yes-no' | 'visual-choice'
  documentLabel?: string
  optionIcons?: string[]
  uniqueMatch?: boolean
}
export type FrenchOpen = {
  id: string
  kind: 'writing' | 'speaking'
  title: string
  prompt: string
  context: string
  minWords?: number
  audio?: string
  followUps?: string[]
  review: string[]
}
export type FrenchTask = FrenchChoice | FrenchOpen
export type FrenchSection = {
  id: FrenchSkill
  title: string
  minutes: number
  preparationMinutes?: number
  tasks: FrenchTask[]
}
export type FrenchExam = {
  id: 'delf-a1-1' | 'delf-a2-1' | 'delf-b1-1' | 'delf-b2-1' | 'dalf-c1-1' | 'dalf-c2-1'
  title: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  sourceUrl: string
  sections: FrenchSection[]
}

import { fullDelfTasks } from './delfDalfExercises.ts'

const b2Audio1 = `Animatrice : Notre ville vient d'ouvrir une bibliothèque d'objets. Au lieu d'acheter une perceuse que l'on utilisera deux fois par an, les habitants peuvent l'emprunter pendant une semaine. Monsieur Laurent, pourquoi ce projet ?
Laurent : Nous voulions réduire les déchets, mais aussi aider les personnes qui n'ont pas les moyens d'acheter certains outils. L'inscription est gratuite. Une petite contribution n'est demandée que si l'objet revient abîmé.
Animatrice : Est-ce que le public a immédiatement adopté l'idée ?
Laurent : Pas vraiment. Au début, les habitants craignaient de ne pas trouver les objets disponibles. Nous avons donc créé un calendrier de réservation et recruté des bénévoles pour vérifier le matériel. Aujourd'hui, les appareils de cuisine sont les plus demandés.
Animatrice : Vous allez ouvrir d'autres lieux ?
Laurent : Nous l'envisageons, mais nous devons d'abord mesurer les coûts de réparation et former davantage de bénévoles. Notre priorité est de rendre le service fiable, pas de grandir trop vite.`
const b2Audio2 = `Bonjour à toutes et à tous. En raison de travaux sur le pont central, la ligne de bus numéro douze ne desservira pas les arrêts Mairie et Théâtre du lundi 8 au vendredi 19 juin. Pendant cette période, un arrêt provisoire sera installé devant la poste, rue des Écoles. Les autres lignes ne changent pas. Les voyageurs qui possèdent un abonnement n'ont aucune démarche à faire. Les personnes qui ont besoin d'une assistance pour monter dans le bus peuvent appeler notre service client avant leur déplacement. Nous publierons toute modification sur notre site et aux arrêts concernés. Merci de votre compréhension.`
const b2Text1 = `Dans plusieurs communes, des jardins partagés ont remplacé de petits terrains laissés à l'abandon. Les habitants y cultivent des légumes, mais l'objectif ne se limite pas à la récolte. Ces lieux permettent aussi à des voisins qui se connaissaient à peine de se rencontrer. Une association locale organise des ateliers ouverts aux débutants et prête les outils nécessaires.
Le projet demande pourtant une organisation précise. Les parcelles ne sont pas attribuées définitivement à une personne : chacun s'inscrit à des créneaux et participe à l'entretien des espaces communs. Cette règle évite que quelques membres profitent seuls du jardin. Les décisions importantes, comme le choix des plantations ou l'utilisation de l'eau, sont prises lors de réunions mensuelles.
Certaines personnes regrettent que les récoltes restent modestes. La coordinatrice rappelle que le jardin ne prétend pas nourrir tout le quartier. Il sert surtout à apprendre des méthodes de culture adaptées à la ville et à renforcer les liens entre habitants. L'association souhaite désormais installer un système de récupération d'eau de pluie, à condition d'obtenir l'accord du propriétaire du terrain.`
const b2Text2 = `Une université a décidé de garder ses salles d'étude ouvertes plus tard pendant les examens. Cette mesure répond à une demande ancienne des étudiants qui travaillent la journée. Selon la direction, l'accès prolongé sera testé pendant six semaines avant qu'une décision permanente soit prise.
Le projet divise néanmoins les personnes concernées. Plusieurs étudiants apprécient de pouvoir étudier dans un endroit calme sans frais supplémentaires. D'autres soulignent que les transports publics deviennent rares après vingt-deux heures et que rentrer seul peut être difficile. Le personnel chargé de l'accueil demande, de son côté, que les nouveaux horaires soient établis à l'avance et accompagnés d'effectifs suffisants.
L'université a donc prévu un questionnaire anonyme à la fin de la période d'essai. Elle mesurera la fréquentation réelle des salles, mais prendra aussi en compte les conditions de travail et de déplacement. La direction insiste sur un point : une bibliothèque ouverte longtemps n'est utile que si chacun peut y accéder et en repartir dans de bonnes conditions.`
const c1AudioLong = `Journaliste : On présente souvent le télétravail comme une solution immédiate à tous les problèmes de mobilité. Est-ce vraiment le cas ?
Chercheuse : Il peut réduire certains déplacements quotidiens, mais l'effet global dépend des comportements. Quand une personne travaille chez elle, elle peut choisir d'habiter plus loin de son entreprise. Elle peut aussi faire davantage de petits trajets dans la journée. Il faut donc observer l'ensemble des déplacements, pas seulement le trajet domicile-bureau.
Journaliste : Les entreprises ont-elles les moyens de mesurer ces effets ?
Chercheuse : Certaines recueillent des données anonymisées sur les habitudes de transport, mais elles doivent respecter la vie privée des salariés. La méthode la plus utile consiste à combiner enquêtes volontaires et données publiques sur les transports. Même ainsi, les conclusions demandent de la prudence : deux quartiers peuvent présenter des situations très différentes.
Journaliste : Quels autres éléments faut-il considérer ?
Chercheuse : La consommation d'énergie du logement, l'organisation des bureaux et l'accès à un espace de travail adapté. Fermer un étage plusieurs jours par semaine peut diminuer les dépenses d'un bâtiment. En revanche, si chacun chauffe son domicile toute la journée, une partie du gain disparaît. Le télétravail n'est pas une politique environnementale à lui seul.
Journaliste : Pourtant, beaucoup de salariés le défendent.
Chercheuse : À juste titre, car il peut améliorer la qualité de vie et offrir plus de souplesse. Je ne propose pas de le supprimer. Je dis simplement qu'une politique sérieuse doit tenir compte de ses avantages sociaux et de ses limites écologiques. Dans les villes bien desservies, investir dans les transports collectifs reste essentiel. Dans les zones rurales, le travail à distance peut éviter de longs trajets.
Journaliste : Quel serait alors votre conseil aux pouvoirs publics ?
Chercheuse : Éviter les slogans. Il faut tester des dispositifs, publier les résultats et les modifier selon les territoires. On peut encourager deux jours de travail à distance dans une organisation et choisir une autre solution ailleurs. L'enjeu n'est pas de défendre une formule unique, mais de réduire les déplacements contraints sans créer de nouvelles inégalités.`
const c1AudioShort = `Annonce : La médiathèque municipale organise samedi une rencontre sur les archives numériques. L'entrée est libre, mais une inscription est nécessaire en raison du nombre limité de places. Les participants peuvent apporter un document personnel à numériser. Un atelier d'initiation suivra la conférence, sans supplément. Les inscriptions ferment jeudi à midi.`
const c1Text = `La multiplication des espaces de travail partagés est souvent décrite comme une simple conséquence des nouveaux outils numériques. Cette explication est séduisante, mais incomplète. Si l'on peut désormais échanger des documents depuis presque n'importe quel lieu, cela ne signifie pas que tous les lieux se valent. Une connexion fiable, des conditions de concentration et la possibilité de rencontrer d'autres personnes restent déterminantes.
Les premières initiatives locales ont répondu à des besoins différents. Dans certaines villes, elles ont offert une alternative aux longs trajets vers les centres d'affaires. Dans d'autres, elles ont accueilli des travailleurs indépendants qui cherchaient à rompre l'isolement. Les pouvoirs publics y ont parfois vu un moyen de redynamiser des bâtiments vacants. Ces objectifs peuvent se compléter, mais ils ne sont pas identiques : un lieu conçu pour attirer des entreprises ne répond pas nécessairement aux attentes d'une personne qui souhaite seulement travailler au calme.
L'enthousiasme initial a aussi masqué plusieurs difficultés. Les tarifs mensuels restent élevés pour certains utilisateurs. Les horaires conviennent rarement à tous. Surtout, les bénéfices promis à un quartier ne se mesurent pas uniquement au nombre de bureaux occupés. Un espace peut être fréquenté par des personnes venues d'ailleurs sans créer d'activité durable pour les commerces voisins. Inversement, un petit lieu associatif peu visible peut jouer un rôle important dans l'entraide locale.
Il serait donc trompeur d'opposer systématiquement réussite économique et utilité sociale. Les responsables d'un projet doivent préciser ce qu'ils souhaitent améliorer, puis choisir des indicateurs adaptés. Si l'objectif est de réduire les déplacements, on peut demander aux usagers quels trajets ont été évités. Si l'objectif est de créer des liens professionnels, on peut observer les collaborations qui se prolongent après une rencontre. Dans tous les cas, il faut accepter que les données ne racontent qu'une partie de l'histoire.
Une autre question concerne l'accès. Une réservation exclusivement numérique peut exclure des personnes peu habituées aux plateformes en ligne. Des locaux situés loin des transports publics risquent de favoriser ceux qui possèdent déjà une voiture. Des horaires rigides peuvent décourager les personnes ayant des responsabilités familiales. Améliorer l'accès ne consiste donc pas seulement à baisser le prix : il faut aussi examiner la manière dont le service fonctionne au quotidien.
Certains acteurs proposent de copier un modèle qui a connu le succès dans une grande métropole. Pourtant, les ressources disponibles, la taille des communautés et les pratiques de déplacement varient considérablement. La reproduction mécanique d'un modèle peut conduire à financer un bâtiment alors qu'un réseau de salles existantes aurait suffi. Une expérimentation modeste, accompagnée d'une évaluation publique, présente parfois moins de risques et permet davantage d'apprentissage.
En définitive, l'espace partagé n'est ni une solution miracle ni un simple effet de mode. Sa valeur dépend du problème qu'il aide réellement à résoudre. Pour le savoir, il faut écouter ceux qui l'utilisent, mais aussi ceux qui n'y entrent jamais. C'est à cette condition qu'un projet peut évoluer au lieu de se contenter d'afficher une fréquentation flatteuse.`
const c1Dossier = `DOCUMENT 1 — Une ville moyenne envisage d'ouvrir ses bâtiments publics inutilisés le soir à des associations et à des étudiants. La municipalité estime que cette solution valoriserait des locaux déjà chauffés et réduirait la nécessité de construire de nouvelles salles. Elle prévoit un système de réservation commun. Des responsables associatifs apprécient cette perspective, mais demandent des règles claires pour le matériel et les assurances.

DOCUMENT 2 — Un collectif de riverains reconnaît le besoin d'espaces accessibles. Il souligne toutefois que les déplacements nocturnes, le bruit et l'entretien doivent être anticipés. Selon lui, les habitants doivent participer au choix des sites et à l'évaluation de l'expérimentation. Le collectif propose de commencer avec deux lieux et de publier un bilan après trois mois.`
const c2Audio = `Journaliste : Votre ville envisage d'ouvrir certains bâtiments publics le soir. Pourquoi cette idée apparaît-elle maintenant ?
Responsable municipale : Plusieurs associations ont expliqué qu'elles ne trouvaient pas de salles accessibles. Des étudiants recherchent aussi des lieux calmes. Nous préférons examiner les bâtiments existants avant de décider de construire de nouveaux équipements.
Journaliste : Les économies annoncées sont-elles garanties ?
Responsable municipale : Non. Un bâtiment déjà chauffé peut être utilisé plus efficacement, mais il faut payer l'accueil, l'entretien et parfois renforcer la sécurité. Nous publierons ces coûts au lieu de présenter une économie théorique.
Journaliste : Certains habitants craignent le bruit.
Responsable municipale : Cette inquiétude est légitime. C'est pourquoi nous commencerons avec deux sites et des horaires limités. Les riverains participeront au bilan. Si un lieu provoque trop de nuisances, nous modifierons le dispositif.
Chercheuse : J'ajouterais que le nombre de réservations ne dit pas tout. Il faut demander qui utilise les salles, qui n'arrive pas à y accéder et pour quelles raisons. Un formulaire exclusivement numérique, par exemple, peut exclure des personnes. Le résultat d'une expérimentation dépend aussi de ce que l'on choisit de mesurer.
Journaliste : Vous êtes donc favorable au projet ?
Chercheuse : Je suis favorable à un essai transparent, pas à une généralisation automatique. Si les coûts, les déplacements et les usages sont publiés, la ville pourra débattre de la suite sur des bases plus solides.`

const choice = (id:string,title:string,prompt:string,context:string,options:[string,string,string,string],answer:number,explanation:string,audio?:string):FrenchChoice =>
  ({id,kind:'choice',title,prompt,context,options,answer,explanation,audio})
const writing = (id:string,title:string,prompt:string,context:string,minWords:number,review:string[]):FrenchOpen =>
  ({id,kind:'writing',title,prompt,context,minWords,review})
const speaking = (id:string,title:string,prompt:string,context:string,followUps:string[],review:string[],audio?:string):FrenchOpen =>
  ({id,kind:'speaking',title,prompt,context,followUps,review,audio})

const baseFrenchExams:FrenchExam[] = [
  {
    id:'delf-a1-1',title:'DELF A1 — Exame 1',level:'A1',
    sourceUrl:'https://www.france-education-international.fr/diplome/delf-tout-public/niveau-a1?langue=en',
    sections:[
      {id:'listening',title:'Compréhension de l’oral',minutes:20,tasks:[
        choice('a1-o1','Message téléphonique','À quelle heure commence le cours ?','Bonjour ! Le cours de français commence à neuf heures demain. La salle est au premier étage.',['À huit heures','À neuf heures','À dix heures','À onze heures'],1,'Le message dit « à neuf heures ».','Bonjour ! Le cours de français commence à neuf heures demain. La salle est au premier étage.'),
        choice('a1-o2','Annonce à la gare','Quel train part bientôt ?','Attention : le train pour Lyon part dans dix minutes, voie trois.',['Le train pour Paris','Le train pour Lyon','Le train pour Marseille','Le train pour Lille'],1,'L’annonce parle du train pour Lyon.','Attention : le train pour Lyon part dans dix minutes, voie trois.'),
        choice('a1-o3','Invitation','Quel jour est le rendez-vous ?','Salut ! Viens chez moi samedi à midi. Nous allons préparer le déjeuner ensemble.',['Lundi','Mercredi','Vendredi','Samedi'],3,'L’invitation indique samedi.','Salut ! Viens chez moi samedi à midi. Nous allons préparer le déjeuner ensemble.'),
        choice('a1-o4','Dans un magasin','Combien coûte le cahier ?','Bonjour madame. Le cahier bleu coûte quatre euros et le stylo coûte deux euros.',['Deux euros','Trois euros','Quatre euros','Six euros'],2,'Le cahier coûte quatre euros.','Bonjour madame. Le cahier bleu coûte quatre euros et le stylo coûte deux euros.'),
      ]},
      {id:'reading',title:'Compréhension des écrits',minutes:30,tasks:[
        choice('a1-e1','Courriel','Qui écrit le message ?','Bonjour Léa, je m’appelle Hugo. Je suis étudiant à Nantes. À bientôt !',['Léa','Hugo','Nantes','Un professeur'],1,'Le signataire se présente : « je m’appelle Hugo ». '),
        choice('a1-e2','Horaires','Quand la bibliothèque ferme-t-elle le mardi ?','Bibliothèque du centre : lundi 10 h–17 h ; mardi 10 h–18 h ; mercredi 9 h–16 h.',['À 16 h','À 17 h','À 18 h','À 19 h'],2,'La ligne du mardi indique 18 h.'),
        choice('a1-e3','Affiche','Où a lieu la fête ?','Fête du quartier, dimanche à 14 h, place des Fleurs. Entrée gratuite.',['À la gare','À la bibliothèque','Place des Fleurs','À l’école'],2,'L’affiche indique la place des Fleurs.'),
        choice('a1-e4','Liste de courses','Que faut-il acheter ?','Pour le dîner : du pain, deux tomates et du fromage. Il y a déjà du lait à la maison.',['Du lait','Du fromage','Des pommes','Du café'],1,'Le fromage figure sur la liste. Le lait est déjà à la maison.'),
      ]},
      {id:'writing',title:'Production écrite',minutes:30,tasks:[
        writing('a1-w1','Formulaire','Complétez une fiche de présentation fictive : prénom, ville, nationalité, langue et activité préférée. Écrivez une information par ligne.','Fiche d’inscription à un atelier de français. Utilisez des données inventées si vous préférez.',5,['Les cinq informations demandées sont-elles présentes ?','Les mots sont-ils compréhensibles ?']),
        writing('a1-w2','Message simple','Écrivez à un ami pour l’inviter à déjeuner samedi. Indiquez le lieu, l’heure et ce que vous allez faire ensemble. Visez au moins 40 mots.','Vous organisez un déjeuner chez vous.',40,['Le destinataire comprend-il où et quand venir ?','Le message est-il simple et poli ?','Avez-vous atteint environ 40 mots ?']),
      ]},
      {id:'speaking',title:'Production orale',minutes:7,preparationMinutes:10,tasks:[
        speaking('a1-s1','Entretien dirigé','Présentez-vous en français : nom, ville, études ou travail, et une activité que vous aimez.','Vous rencontrez un examinateur fictif.',['Comment vous appelez-vous ?','Où habitez-vous ?','Qu’est-ce que vous aimez faire ?'],['Utilisez des phrases courtes et compréhensibles.','Répondez aux questions simples.']),
        speaking('a1-s2','Échange d’informations','Posez trois questions simples pour connaître une nouvelle personne.','Vous rencontrez un étudiant dans un atelier.',['Demandez son nom.','Demandez sa ville.','Demandez son activité préférée.'],['Formulez de vraies questions.','Écoutez vos phrases enregistrées.']),
        speaking('a1-s3','Dialogue simulé','Jouez le rôle d’un client dans une boulangerie. Demandez du pain, renseignez-vous sur le prix et remerciez.','La personne au comptoir joue le rôle du vendeur; ses répliques sont seulement suggérées.',['Bonjour, que souhaitez-vous ?','Cela coûte deux euros.','Voulez-vous autre chose ?'],['Saluez et remerciez.','Faites une demande simple.']),
      ]},
    ],
  },
  {
    id:'delf-a2-1',title:'DELF A2 — Exame 1',level:'A2',
    sourceUrl:'https://www.france-education-international.fr/en/document/manuel-candidat-delf-a2',
    sections:[
      {id:'listening',title:'Compréhension de l’oral',minutes:25,tasks:[
        choice('a2-o1','Message de service','Pourquoi le cours change-t-il de salle ?','Bonjour. Le cours de demain aura lieu en salle quinze, car la salle habituelle est en travaux. L’horaire ne change pas.',['Le professeur est absent','La salle habituelle est en travaux','Le cours commence plus tôt','Il n’y a plus de places'],1,'La salle habituelle est en travaux.','Bonjour. Le cours de demain aura lieu en salle quinze, car la salle habituelle est en travaux. L’horaire ne change pas.'),
        choice('a2-o2','Conversation','Que propose Camille ?','Camille : Il va pleuvoir samedi. On peut visiter le musée plutôt que faire une promenade. Paul : Bonne idée, mais réservons les billets ce soir.',['Une promenade sous la pluie','Une visite au musée','Un dîner au restaurant','Une séance de cinéma'],1,'Camille propose le musée à cause de la pluie.','Camille : Il va pleuvoir samedi. On peut visiter le musée plutôt que faire une promenade. Paul : Bonne idée, mais réservons les billets ce soir.'),
        choice('a2-o3','Annonce','Quel service sera fermé demain ?','La piscine municipale sera fermée mardi matin pour entretien. Elle rouvrira à quatorze heures. Les cours de natation de l’après-midi sont maintenus.',['La piscine toute la semaine','La piscine mardi matin','La piscine mardi après-midi','Le gymnase'],1,'La fermeture concerne mardi matin.','La piscine municipale sera fermée mardi matin pour entretien. Elle rouvrira à quatorze heures. Les cours de natation de l’après-midi sont maintenus.'),
      ]},
      {id:'reading',title:'Compréhension des écrits',minutes:30,tasks:[
        choice('a2-e1','Courriel pratique','Pourquoi Nina écrit-elle à Marc ?','Salut Marc, je ne peux pas venir à la réunion jeudi. J’ai un rendez-vous médical. Peux-tu m’envoyer le compte rendu vendredi ? Merci, Nina.',['Pour annuler la réunion','Pour demander un compte rendu','Pour changer de médecin','Pour inviter Marc vendredi'],1,'Elle demande le compte rendu de la réunion.'),
        choice('a2-e2','Annonce d’activité','Que doit faire une personne intéressée ?','Atelier de cuisine samedi, de 10 h à 12 h. Places limitées. Inscrivez-vous à l’accueil avant vendredi. Le matériel est fourni.',['Apporter ses ustensiles','S’inscrire avant vendredi','Venir vendredi à dix heures','Payer sur internet'],1,'L’inscription est demandée avant vendredi.'),
        choice('a2-e3','Informations de transport','Quelle solution est proposée dimanche ?','Dimanche, le tram A ne circule pas entre Centre et Université. Un bus de remplacement passe toutes les vingt minutes devant la mairie.',['Marcher jusqu’à la gare','Prendre un bus de remplacement','Utiliser le tram B','Attendre lundi'],1,'Un bus de remplacement circule devant la mairie.'),
      ]},
      {id:'writing',title:'Production écrite',minutes:45,tasks:[
        writing('a2-w1','Récit personnel','Racontez une sortie récente : où êtes-vous allé, avec qui, qu’avez-vous fait et qu’avez-vous aimé ? Visez au moins 60 mots.','Message pour un ami qui n’a pas pu vous accompagner.',60,['Le récit situe-t-il le lieu et le moment ?','Les activités sont-elles racontées dans un ordre clair ?']),
        writing('a2-w2','Réponse à une invitation','Répondez à l’invitation d’un ami à un concert. Acceptez ou refusez, expliquez pourquoi et proposez un détail pratique. Visez au moins 60 mots.','Message reçu : « Salut ! Tu veux venir au concert samedi soir ? Dis-moi vite ! »',60,['Votre décision est-elle explicite ?','Avez-vous expliqué et proposé une information utile ?']),
      ]},
      {id:'speaking',title:'Production orale',minutes:8,preparationMinutes:10,tasks:[
        speaking('a2-s1','Entretien dirigé','Parlez de votre ville et de vos habitudes de la semaine.','Entretien simulé.',['Qu’aimez-vous dans votre quartier ?','Que faites-vous le week-end ?'],['Décrivez avec des phrases simples reliées.','Répondez aux relances.']),
        speaking('a2-s2','Monologue suivi','Racontez un voyage ou une sortie que vous avez appréciée.','Vous parlez à un camarade de classe.',['Où êtes-vous allé ?','Qu’avez-vous fait ?','Pourquoi ce souvenir est-il important ?'],['Utilisez quelques marqueurs de temps.','Exprimez une préférence.']),
        speaking('a2-s3','Interaction simulée','Demandez des informations pour vous inscrire à un cours de sport : horaires, prix et équipement nécessaire.','L’employé d’accueil n’est pas réel; répondez à voix haute aux relances.',['Quel jour pouvez-vous venir ?','Avez-vous déjà pratiqué ce sport ?'],['Posez des questions précises.','Réagissez aux réponses possibles.']),
      ]},
    ],
  },
  {
    id:'delf-b1-1',title:'DELF B1 — Exame 1',level:'B1',
    sourceUrl:'https://www.france-education-international.fr/en/node/105',
    sections:[
      {id:'listening',title:'Compréhension de l’oral',minutes:25,tasks:[
        choice('b1-o1','Conversation','Pourquoi Amélie va-t-elle changer son trajet ?','Amélie : Je prenais toujours le bus, mais il est souvent en retard. À partir de lundi, je vais essayer le vélo. Le trajet est plus court, même si je dois partir plus tôt quand il pleut.',['Le bus est souvent en retard','Le vélo est gratuit','Son école a déménagé','Elle n’aime plus marcher'],0,'Elle explique que les retards du bus motivent son choix.','Amélie : Je prenais toujours le bus, mais il est souvent en retard. À partir de lundi, je vais essayer le vélo. Le trajet est plus court, même si je dois partir plus tôt quand il pleut.'),
        choice('b1-o2','Annonce culturelle','À qui s’adresse l’atelier ?','Le musée propose un atelier photo ouvert aux adultes débutants. Il commence samedi à dix heures. Les participants doivent apporter leur téléphone; les autres équipements seront prêtés.',['Aux professionnels','Aux enfants uniquement','Aux adultes débutants','Aux membres du musée uniquement'],2,'L’annonce précise « adultes débutants ».','Le musée propose un atelier photo ouvert aux adultes débutants. Il commence samedi à dix heures. Les participants doivent apporter leur téléphone; les autres équipements seront prêtés.'),
        choice('b1-o3','Interview','Quel bénéfice l’invitée mentionne-t-elle ?','Journaliste : Pourquoi avez-vous lancé ce club de lecture ? Invitée : Beaucoup de voisins vivaient seuls. Les livres nous donnent un sujet commun et les rencontres ont créé de nouvelles amitiés. Nous ne cherchons pas à lire le plus grand nombre de romans.',['Vendre davantage de livres','Créer des liens entre voisins','Préparer un concours','Remplacer la bibliothèque'],1,'Le club aide les voisins à se rencontrer.','Journaliste : Pourquoi avez-vous lancé ce club de lecture ? Invitée : Beaucoup de voisins vivaient seuls. Les livres nous donnent un sujet commun et les rencontres ont créé de nouvelles amitiés. Nous ne cherchons pas à lire le plus grand nombre de romans.'),
      ]},
      {id:'reading',title:'Compréhension des écrits',minutes:45,tasks:[
        choice('b1-e1-1','Choisir une activité','Quelle activité convient à une personne libre le soir et débutante ?','Centre culturel : atelier de dessin pour débutants, mardi 19 h ; atelier de musique avancé, mercredi 14 h ; randonnée familiale, dimanche 9 h.',['Dessin','Musique avancée','Randonnée','Aucune'],0,'Le dessin est le seul atelier pour débutants proposé le soir.'),
        choice('b1-e1-2','Choisir une activité','Quand se déroule la randonnée ?','Centre culturel : atelier de dessin pour débutants, mardi 19 h ; atelier de musique avancé, mercredi 14 h ; randonnée familiale, dimanche 9 h.',['Mardi soir','Mercredi après-midi','Samedi matin','Dimanche matin'],3,'La randonnée est prévue dimanche à 9 h.'),
        choice('b1-e2-1','Article d’intérêt général','Quel est l’objectif de la nouvelle navette ?','Une commune teste une navette gratuite entre la gare et l’hôpital. Le service vise surtout les personnes sans voiture. Les départs ont lieu toutes les trente minutes en journée. Après trois mois, la mairie demandera l’avis des voyageurs avant de décider si la ligne reste ouverte.',['Augmenter le prix des transports','Faciliter l’accès à l’hôpital','Fermer la gare','Remplacer tous les bus'],1,'La navette relie la gare à l’hôpital pour les personnes sans voiture.'),
        choice('b1-e2-2','Article d’intérêt général','Comment la mairie décidera-t-elle de la suite ?','Une commune teste une navette gratuite entre la gare et l’hôpital. Le service vise surtout les personnes sans voiture. Les départs ont lieu toutes les trente minutes en journée. Après trois mois, la mairie demandera l’avis des voyageurs avant de décider si la ligne reste ouverte.',['Après avoir interrogé les voyageurs','Après un vote national','Sans période d’essai','Selon le prix du carburant seulement'],0,'La mairie demandera l’avis des voyageurs après trois mois.'),
      ]},
      {id:'writing',title:'Production écrite',minutes:45,tasks:[
        writing('b1-w1','Texte d’opinion','Votre quartier souhaite créer une navette gratuite. Écrivez au journal local pour dire si vous soutenez ce projet. Donnez au moins deux raisons, un exemple et une conclusion. Écrivez au moins 160 mots.','Débat fictif sur les transports de proximité.',160,['Votre opinion est-elle claire ?','Deux raisons et un exemple sont-ils développés ?','Le texte est-il organisé et assez long ?']),
      ]},
      {id:'speaking',title:'Production orale',minutes:15,preparationMinutes:10,tasks:[
        speaking('b1-s1','Entretien dirigé','Parlez de vos études, d’une expérience récente et d’un projet futur.','Entretien simulé avec un examinateur fictif.',['Pourquoi avez-vous choisi cette activité ?','Qu’aimeriez-vous faire l’an prochain ?'],['Racontez un fait passé et un projet futur.','Justifiez vos réponses.']),
        speaking('b1-s2','Interaction simulée','Vous voulez organiser une visite de musée avec un ami qui préfère rester à la maison. Essayez de trouver une solution commune.','Votre partenaire est simulé par les relances écrites.',['Je suis fatigué samedi.','Le billet est trop cher pour moi.','Pourquoi ce musée en particulier ?'],['Réagissez aux objections.','Proposez un compromis.']),
        speaking('b1-s3','Point de vue','Expliquez si les villes devraient proposer davantage d’activités culturelles gratuites.','Document déclencheur original : une commune teste l’accès libre à ses ateliers pendant un mois.',['À qui cela profiterait-il ?','Comment financer le projet ?'],['Présentez votre opinion et au moins deux arguments.','Concluez avec une proposition.']),
      ]},
    ],
  },
  {
    id:'delf-b2-1',title:'DELF B2 — Exame 1',level:'B2',
    sourceUrl:'https://www.france-education-international.fr/en/diplome/delf-tout-public/niveau-b2',
    sections:[
      {id:'listening',title:'Compréhension de l’oral',minutes:30,tasks:[
        choice('b2-o1-1','Entretien à la radio','Quel est le principal objectif de la bibliothèque d’objets ?',b2Audio1,['Vendre des outils à prix réduit','Réduire les déchets et faciliter l’accès aux objets','Remplacer les magasins du quartier','Organiser des cours de cuisine'],1,'Le projet vise à limiter les achats peu utiles et à aider les habitants.',b2Audio1),
        choice('b2-o1-2','Entretien à la radio','Quelle difficulté les habitants ont-ils exprimée au début ?',b2Audio1,['Le coût de l’inscription','La distance du local','La disponibilité des objets','Le manque de cours'],2,'Ils craignaient de ne pas trouver les objets disponibles.',b2Audio1),
        choice('b2-o1-3','Entretien à la radio','Quelle solution a été mise en place ?',b2Audio1,['Un calendrier de réservation','Une taxe annuelle','Un second bâtiment','Un service de livraison'],0,'Un calendrier de réservation et des bénévoles ont été mis en place.',b2Audio1),
        choice('b2-o1-4','Entretien à la radio','Pourquoi Laurent ne veut-il pas ouvrir immédiatement d’autres lieux ?',b2Audio1,['Le public n’est pas intéressé','Il veut d’abord assurer la fiabilité du service','Les outils sont interdits ailleurs','L’inscription doit devenir payante'],1,'Il préfère mesurer les réparations et former les bénévoles.',b2Audio1),
        choice('b2-o2-1','Annonce publique','Quels arrêts seront temporairement supprimés ?',b2Audio2,['Mairie et Théâtre','Poste et Écoles','Mairie et Gare','Théâtre et Gare'],0,'L’annonce cite Mairie et Théâtre.',b2Audio2),
        choice('b2-o2-2','Annonce publique','Où se trouvera l’arrêt provisoire ?',b2Audio2,['Devant la mairie','Devant le théâtre','Devant la poste','À la gare'],2,'L’arrêt provisoire est devant la poste, rue des Écoles.',b2Audio2),
        choice('b2-o2-3','Annonce publique','Que doivent faire les personnes abonnées ?',b2Audio2,['Acheter un autre billet','Faire renouveler leur carte','Aucune démarche','Appeler avant chaque voyage'],2,'L’annonce précise qu’aucune démarche n’est nécessaire.',b2Audio2),
        choice('b2-o2-4','Annonce publique','Qui est invité à contacter le service client avant le trajet ?',b2Audio2,['Tous les étudiants','Les personnes ayant besoin d’assistance pour monter','Les titulaires d’un abonnement','Les voyageurs des autres lignes'],1,'Le conseil concerne les personnes ayant besoin d’assistance.',b2Audio2),
      ]},
      {id:'reading',title:'Compréhension des écrits',minutes:60,tasks:[
        choice('b2-e1-1','Article : un jardin partagé','Quelle est l’idée principale de l’article ?',b2Text1,['Un jardin peut produire toute la nourriture d’un quartier','Un jardin partagé sert aussi à créer des liens','Les outils doivent appartenir à chaque membre','Les plantations sont choisies par la mairie'],1,'La récolte n’est qu’un des objectifs du projet.'),
        choice('b2-e1-2','Article : un jardin partagé','Comment sont prises les décisions importantes ?',b2Text1,['Par la coordinatrice seule','Par le propriétaire du terrain','Lors de réunions mensuelles','Par tirage au sort'],2,'Les décisions sont prises lors de réunions mensuelles.'),
        choice('b2-e1-3','Article : un jardin partagé','Pourquoi les parcelles ne sont-elles pas attribuées définitivement ?',b2Text1,['Pour éviter qu’un petit groupe monopolise le jardin','Pour vendre plus de légumes','Pour limiter les ateliers','Pour changer de terrain chaque mois'],0,'La règle répartit la participation et l’entretien.'),
        choice('b2-e1-4','Article : un jardin partagé','Quel projet dépend encore d’une autorisation ?',b2Text1,['L’achat des outils','La récupération d’eau de pluie','L’ouverture des ateliers','La récolte des légumes'],1,'Le système de récupération d’eau exige l’accord du propriétaire.'),
        choice('b2-e2-1','Article : horaires universitaires','Pourquoi l’université prolonge-t-elle ses horaires ?',b2Text2,['Pour remplacer les cours du soir','Pour répondre notamment aux étudiants qui travaillent','Pour diminuer le nombre de salles','Pour accueillir uniquement les enseignants'],1,'La mesure répond à une demande des étudiants qui travaillent le jour.'),
        choice('b2-e2-2','Article : horaires universitaires','Combien de temps dure la période d’essai ?',b2Text2,['Deux semaines','Un mois','Six semaines','Une année'],2,'La direction annonce six semaines.'),
        choice('b2-e2-3','Article : horaires universitaires','Quelle inquiétude concerne le retour à domicile ?',b2Text2,['Le prix des livres','La rareté des transports tard le soir','Le manque de places assises','La fermeture des cafés'],1,'Les transports deviennent rares après vingt-deux heures.'),
        choice('b2-e2-4','Article : horaires universitaires','Sur quoi reposera la décision finale ?',b2Text2,['La fréquentation seulement','Le vote du personnel seulement','La fréquentation et les conditions d’accès et de travail','Le résultat des examens'],2,'La direction prendra en compte plusieurs aspects, pas seulement les entrées.'),
      ]},
      {id:'writing',title:'Production écrite',minutes:60,tasks:[
        writing('b2-w1','Lettre argumentée','Vous écrivez au conseil de votre ville pour proposer l’ouverture d’une bibliothèque d’objets. Expliquez l’intérêt du projet, anticipez une difficulté pratique et suggérez une solution. Rédigez au moins 250 mots.','Situation fictive : la mairie consulte les habitants avant de financer de nouveaux services de quartier.',250,['Votre position et le destinataire sont-ils clairs ?','Avez-vous développé des arguments et un exemple précis ?','Avez-vous traité une objection et proposé une solution ?','Le texte comporte-t-il au moins 250 mots et une conclusion ?']),
      ]},
      {id:'speaking',title:'Production orale',minutes:20,preparationMinutes:30,tasks:[
        speaking('b2-s1','Monologue suivi','Vous défendez votre point de vue sur l’ouverture tardive des bibliothèques universitaires. Présentez les avantages, les limites et votre proposition.','Document déclencheur original : une université teste l’ouverture de ses salles d’étude jusqu’à minuit pendant les examens. Des étudiants y voient une aide; d’autres s’inquiètent des transports et de la sécurité.',['Pourquoi cette mesure vous semble-t-elle utile ou inutile ?','Comment répondriez-vous à un étudiant inquiet pour son trajet ?'],['Exposez une position organisée.','Justifiez-la avec des exemples.','Répondez aux objections sans lire un texte rédigé.']),
        speaking('b2-s2','Échange simulé','Répondez à voix haute aux questions du jury affichées ci-dessous. Aucun examinateur réel ne participe.','Vous venez de présenter votre proposition au conseil de l’université.',['Si le budget est limité, quelle priorité choisiriez-vous ?','Comment vérifieriez-vous que la mesure fonctionne ?','Que feriez-vous si le personnel s’y opposait ?'],['Répondez directement à chaque question.','Développez et nuancez votre opinion.','Maintenez un échange clair et poli.']),
      ]},
    ],
  },
  {
    id:'dalf-c1-1',title:'DALF C1 — Exame 1',level:'C1',
    sourceUrl:'https://www.france-education-international.fr/document/manuel-candidat-dalf-c2',
    sections:[
      {id:'listening',title:'Compréhension de l’oral',minutes:40,tasks:[
        choice('c1-o1-1','Entretien approfondi','Quelle idée la chercheuse conteste-t-elle ?',c1AudioLong,['Le télétravail améliore parfois la vie des salariés','Le télétravail réduit nécessairement tous les déplacements','Les villes doivent investir dans les transports','Les situations territoriales sont différentes'],1,'Elle explique que d’autres trajets peuvent apparaître et que les effets varient.',c1AudioLong),
        choice('c1-o1-2','Entretien approfondi','Pourquoi les données d’entreprise doivent-elles être utilisées avec prudence ?',c1AudioLong,['Elles ne concernent que les bâtiments','La vie privée doit être respectée et les territoires diffèrent','Elles remplacent les enquêtes','Elles prouvent toujours la même chose'],1,'La chercheuse cite la protection des salariés et les différences locales.',c1AudioLong),
        choice('c1-o1-3','Entretien approfondi','Quel facteur peut réduire le gain énergétique ?',c1AudioLong,['Le chauffage des domiciles','La fermeture d’un étage','Les transports collectifs','Les enquêtes volontaires'],0,'Chauffer plusieurs logements peut compenser une partie des économies au bureau.',c1AudioLong),
        choice('c1-o1-4','Entretien approfondi','Quelle approche recommande-t-elle ?',c1AudioLong,['Imposer partout la même règle','Supprimer le travail à distance','Expérimenter et adapter selon les territoires','Ne mesurer que les trajets domicile-bureau'],2,'Elle recommande de tester, publier les résultats et adapter.',c1AudioLong),
        choice('c1-o2-1','Annonce radiophonique','Quelle condition permet de participer à la rencontre ?',c1AudioShort,['Acheter un billet','S’inscrire à l’avance','Posséder un scanner','Être membre de la médiathèque'],1,'L’entrée est libre, mais l’inscription est nécessaire.',c1AudioShort),
        choice('c1-o2-2','Annonce radiophonique','Que peuvent apporter les participants ?',c1AudioShort,['Un document personnel à numériser','Un ordinateur obligatoire','Un livre à vendre','Une attestation de domicile'],0,'L’annonce invite à apporter un document personnel.',c1AudioShort),
        choice('c1-o2-3','Annonce radiophonique','Quand ferment les inscriptions ?',c1AudioShort,['Samedi matin','Vendredi soir','Jeudi à midi','Mercredi à midi'],2,'Les inscriptions ferment jeudi à midi.',c1AudioShort),
      ]},
      {id:'reading',title:'Compréhension des écrits',minutes:50,tasks:[
        choice('c1-e1-1','Texte d’idées','Quelle thèse l’auteur défend-il ?',c1Text,['Tous les espaces partagés produisent les mêmes effets','Leur utilité dépend du problème local qu’ils résolvent','Il faut remplacer tous les bureaux classiques','La fréquentation suffit à mesurer leur réussite'],1,'Le texte insiste sur le contexte et l’objectif réel du projet.'),
        choice('c1-e1-2','Texte d’idées','Pourquoi la seule occupation des bureaux est-elle insuffisante ?',c1Text,['Elle ne mesure pas les effets durables ni l’utilité sociale','Elle est impossible à calculer','Elle révèle toujours une activité économique élevée','Elle exclut les entreprises étrangères'],0,'L’auteur distingue fréquentation, retombées locales et utilité sociale.'),
        choice('c1-e1-3','Texte d’idées','Quel exemple illustre un obstacle autre que le prix ?',c1Text,['Une réservation uniquement numérique','Un tarif mensuel réduit','Une salle associative','Une enquête publique'],0,'Le texte cite l’exclusion possible par une réservation exclusivement numérique.'),
        choice('c1-e1-4','Texte d’idées','Que suggère l’auteur au sujet des modèles métropolitains ?',c1Text,['Les appliquer sans modification','Les écarter systématiquement','Éviter leur reproduction mécanique','Les réserver aux associations'],2,'Les besoins et les ressources locales varient.'),
        choice('c1-e1-5','Texte d’idées','Pourquoi faut-il écouter les non-utilisateurs ?',c1Text,['Pour rendre la fréquentation plus flatteuse','Pour comprendre les obstacles d’accès et améliorer le service','Pour supprimer les espaces existants','Pour réduire les évaluations'],1,'Le point de vue des personnes absentes peut révéler des barrières invisibles.'),
        choice('c1-e1-6','Texte d’idées','Quel ton caractérise le mieux la conclusion ?',c1Text,['Un rejet absolu','Une approbation sans réserve','Une évaluation nuancée','Une ironie constante'],2,'L’auteur refuse à la fois la solution miracle et le simple effet de mode.'),
      ]},
      {id:'writing',title:'Production écrite',minutes:150,tasks:[
        writing('c1-w1','Synthèse de documents','Rédigez une synthèse organisée des deux documents, sans opinion personnelle. Présentez leurs convergences et leurs divergences avec vos propres mots. Visez environ 220 mots.',c1Dossier,200,['Les deux documents sont-ils représentés fidèlement ?','Les idées sont-elles regroupées par thèmes plutôt que résumées document par document ?','Avez-vous évité votre opinion et les phrases copiées ?','La longueur visée est-elle proche de 220 mots ?']),
        writing('c1-w2','Essai argumenté','La réutilisation des bâtiments publics devrait-elle être une priorité pour les villes ? Rédigez un essai argumenté d’environ 250 mots, avec une position nuancée et des exemples.','Dossier de départ :\n'+c1Dossier,240,['Une thèse claire apparaît-elle dès l’introduction ?','Les arguments sont-ils hiérarchisés et illustrés ?','Avez-vous discuté les limites ou objections ?','Le texte se termine-t-il par une conclusion cohérente ?']),
      ]},
      {id:'speaking',title:'Production orale',minutes:30,preparationMinutes:60,tasks:[
        speaking('c1-s1','Exposé','Préparez et présentez un exposé sur l’usage partagé des bâtiments publics. Appuyez-vous sur les documents et distinguez intérêts, limites et conditions de réussite.','Dossier original :\n'+c1Dossier,['Quels acteurs devraient décider des horaires ?','Comment mesureriez-vous les effets après trois mois ?'],['Construisez une problématique et un plan explicites.','Synthétisez les documents au lieu de les lire.','Défendez une analyse nuancée avec des transitions claires.']),
        speaking('c1-s2','Discussion simulée','Après votre exposé, répondez oralement aux questions du jury affichées. Il n’y a pas de jury réel dans cette pratique.','Votre exposé est terminé. Prenez le temps de développer chaque réponse.',['Une expérimentation limitée peut-elle vraiment prouver l’utilité du dispositif ?','Comment éviter que seuls certains groupes profitent des locaux ?','Quelle objection à votre position trouvez-vous la plus sérieuse ?'],['Répondez à la question avant de développer.','Réagissez aux objections sans répéter votre exposé.','Nuancez votre position et reformulez si nécessaire.']),
      ]},
    ],
  },
  {
    id:'dalf-c2-1',title:'DALF C2 — Exame 1',level:'C2',
    sourceUrl:'https://www.france-education-international.fr/document/manuel-candidat-dalf-c2',
    sections:[
      {id:'writing',title:'Compréhension et production écrites',minutes:210,tasks:[
        writing('c2-w1','Texto estruturado a partir de um dossiê','Choisissez une position sur l’ouverture des bâtiments publics en soirée. Rédigez un texte structuré d’au moins 700 mots en utilisant les documents et vos propres arguments. Distinguez les enjeux sociaux, financiers et environnementaux.','DOSSIER ORIGINAL — Document 1 : Une ville propose de rendre disponibles, après les cours, plusieurs salles scolaires déjà chauffées. Les associations locales pourraient y organiser des réunions et des ateliers. La mairie estime que cette mesure valoriserait les équipements existants. Elle reconnaît cependant que l’entretien, la sécurité et la coordination exigeraient des ressources supplémentaires.\n\nDocument 2 : Des habitants favorables à la mesure soulignent le manque d’espaces gratuits pour étudier et se rencontrer. Un autre groupe craint une augmentation du bruit et demande une consultation par quartier. Les deux groupes souhaitent un bilan public après une période d’essai.\n\nDocument 3 : Une chercheuse rappelle que la fréquentation ne suffit pas à juger le succès d’un service. Elle recommande de mesurer également les personnes qui n’y ont pas accès, les coûts de fonctionnement et les effets sur les déplacements.',700,['Votre texte exploite-t-il les trois documents sans les copier ?','Votre propre position est-elle développée et nuancée ?','Les objections sont-elles discutées avec précision ?','L’organisation et la langue permettent-elles de suivre un raisonnement complexe ?','Avez-vous écrit au moins 700 mots ?']),
      ]},
      {id:'speaking',title:'Compréhension et production orales',minutes:30,preparationMinutes:60,tasks:[
        speaking('c2-s1','Compte rendu du document sonore','Écoutez le document et présentez oralement les informations et les points de vue dans un ordre clair.','Entretien sonore original. La transcription est disponible comme aide d’accessibilité; l’épreuve officielle utilise un enregistrement plus long.',['Quelle distinction la chercheuse fait-elle entre usage et utilité ?','Quels risques faut-il examiner avant de généraliser le service ?'],['Restituez les idées principales sans ajouter votre opinion.','Distinguez clairement les voix et les nuances de l’entretien.'],c2Audio),
        speaking('c2-s2','Point de vue argumenté','Défendez votre propre position sur la mise en commun des locaux publics. Discutez les limites de votre proposition.','À partir de l’entretien entendu, vous participez à une table ronde fictive.',['Une petite expérimentation peut-elle suffire à guider une décision publique ?','Comment protéger les personnes exclues du service ?'],['Présentez une problématique et une thèse.','Mobilisez des exemples précis.','Nuancez les limites et les effets indirects.']),
        speaking('c2-s3','Débat simulé','Répondez oralement aux objections du jury affichées ci-dessous. Aucun jury réel ne participe.','Votre exposé est terminé. Prenez chaque question comme une relance.',['Votre projet ne risque-t-il pas de coûter plus cher que prévu ?','Pourquoi financer ce service plutôt qu’un autre ?','Quel résultat vous ferait changer d’avis ?'],['Répondez aux objections au lieu de répéter votre exposé.','Défendez une position tout en reconnaissant ses limites.']),
      ]},
    ],
  },
]

const c1ShortDocuments:Record<string,string>={
  'c1-o2-1':`La médiathèque accueille samedi une rencontre sur les archives numériques. L'entrée est libre, mais le nombre de places est limité : une inscription préalable est obligatoire.`,
  'c1-o2-2':`Un atelier de numérisation aura lieu après la conférence. Les participants sont invités à apporter un document personnel qu'ils souhaitent conserver sous forme numérique. Aucun ordinateur n'est demandé.`,
  'c1-o2-3':`Rappel aux personnes intéressées par la rencontre de samedi : les inscriptions ferment jeudi à midi. Après cette heure, la médiathèque ne pourra plus accepter de nouvelles réservations.`,
}

export const frenchExams:FrenchExam[] = baseFrenchExams.map(exam=>({
  ...exam,
  sections:exam.sections.map(section=>{
    const tasks=fullDelfTasks(exam.level,section.id)??section.tasks.map(task=>{
      if(exam.level==='C1'&&section.id==='listening'&&task.kind==='choice'){
        const short=c1ShortDocuments[task.id]
        return {...task,context:short??task.context,audio:short??task.audio,supportId:short?task.id:'C1-listening-long',listenLimit:short?1:2}
      }
      if(exam.level==='C2'&&section.id==='writing'&&task.kind==='writing')return {...task,prompt:'Choisissez un seul sujet. Sujet 1 : rédigez un éditorial défendant ou critiquant l’ouverture des bâtiments publics en soirée. Sujet 2 : rédigez un discours à un conseil municipal proposant des conditions concrètes pour expérimenter cette ouverture. Dans les deux cas, appuyez-vous sur le dossier, développez vos propres arguments et rédigez au moins 700 mots.'}
      return task
    })
    return {...section,tasks}
  }),
}))

export function findFrenchExam(id:string):FrenchExam|undefined {
  return frenchExams.find(exam=>exam.id===id)
}
