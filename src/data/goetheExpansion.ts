import type {GoetheExam, GoetheLevel, Question} from './goethePractice.ts'

type Event = [who:string, activity:string, when:string, where:string]
// Situações fictícias, criadas para esta prática. Cada uma fornece três fatos verificáveis.
const events:Record<GoetheLevel,Event[]>={
 A1:[
  ['Lena','einen Kuchen kaufen','am Montag','in der Bäckerei'],['Tom','ein Buch lesen','am Dienstag','im Park'],
  ['Sara','Fußball spielen','am Mittwoch','auf dem Sportplatz'],['Ben','eine Freundin treffen','am Freitag','am Bahnhof'],
 ],
 A2:[
  ['Frau Klein','einen Termin vereinbaren','am 12. Juni','in der Arztpraxis'],['Herr Bauer','ein Paket abholen','am Donnerstag','in der Postfiliale'],
  ['Mila','einen Sprachkurs besuchen','am Montagabend','im Kulturzentrum'],['Jonas','sein Fahrrad reparieren lassen','am Samstag','in der Werkstatt'],
  ['Nora','eine Wohnung besichtigen','am 3. August','in der Lindenstraße'],['Amir','eine Bewerbung abgeben','am Freitagvormittag','im Büro'],
 ],
 B1:[
  ['Die Stadtverwaltung','eine Bürgerversammlung organisieren','am 8. März','im Rathaus'],['Eine Schülergruppe','einen Flohmarkt veranstalten','am zweiten Samstag','auf dem Schulhof'],
  ['Der Naturschutzverein','einen Vortrag anbieten','am Donnerstagabend','im Stadtmuseum'],['Eine Nachbarschaftsinitiative','Bäume pflanzen','im April','an der Uferpromenade'],
  ['Die Volkshochschule','einen Fotokurs beginnen','am 5. September','im Medienraum'],['Das Jugendzentrum','eine Theaterprobe durchführen','jeden Mittwoch','im großen Saal'],
  ['Die Stadtbibliothek','eine Lesung veranstalten','am Freitag','im Erdgeschoss'],['Ein Sportverein','neue Mitglieder begrüßen','am Sonntagmorgen','im Vereinsheim'],
  ['Das Umweltbüro','eine Umfrage starten','im Juni','in der Innenstadt'],
 ],
 B2:[
  ['Der Stadtrat','ein Mobilitätskonzept diskutieren','im November','im Sitzungssaal'],['Ein Forschungsteam','eine Studie vorstellen','am Montag','an der Universität'],
  ['Der Kulturverein','eine Ausstellung eröffnen','am 14. Mai','im Kunsthaus'],['Die Verbraucherzentrale','einen Vortrag halten','am Dienstagabend','in der Stadtbibliothek'],
  ['Eine Gewerkschaft','eine Befragung durchführen','im Frühjahr','in mehreren Betrieben'],['Das Bildungsministerium','eine Reform erläutern','am Donnerstag','im Pressezentrum'],
  ['Ein Verkehrsverbund','eine neue Linie testen','ab September','im Norden der Stadt'],['Die Hochschule','ein Austauschprogramm präsentieren','am 2. Juli','im Hauptgebäude'],
  ['Die Forschungsstiftung','einen Förderpreis verleihen','am Jahresende','im Konferenzzentrum'],
 ],
 C1:[
  ['Die Ethikkommission','eine Empfehlung veröffentlichen','im Januar','auf ihrer Internetseite'],['Ein interdisziplinäres Team','eine Methode vergleichen','während des Seminars','im Forschungslabor'],
  ['Die Stadtplanung','einen Entwurf zur Diskussion stellen','im kommenden Herbst','im Bürgerforum'],['Eine unabhängige Stiftung','einen Bericht vorlegen','nach der Evaluation','im Landtag'],
  ['Die Redaktion','eine Debatte moderieren','am Mittwochabend','im Rundfunkstudio'],['Ein wissenschaftlicher Beirat','die Datenlage bewerten','vor der Abstimmung','im Ausschuss'],
  ['Die Universität','ein Archiv digitalisieren','ab dem Sommer','in der Bibliothek'],['Eine Arbeitsgruppe','einen Kompromiss ausarbeiten','bis Ende April','im Ministerium'],
  ['Das Forschungsinstitut','eine Langzeitstudie beginnen','im nächsten Jahr','in drei Regionen'],
 ],
 C2:[
  ['Die Herausgeberin','eine These kritisch einordnen','im Vorwort','in der neuen Ausgabe'],['Ein Sachverständigenrat','die Folgen einer Reform abwägen','vor der Entscheidung','im Parlament'],
  ['Die Kuratorin','ein kaum beachtetes Werk neu interpretieren','während der Ausstellung','im Museum'],['Ein Historikerteam','eine bisherige Deutung hinterfragen','nach dem Archivfund','an der Universität'],
  ['Die Jury','eine ungewöhnliche Begründung veröffentlichen','nach der Preisvergabe','auf ihrer Webseite'],['Ein Expertengremium','methodische Grenzen offenlegen','im Abschlussbericht','im Forschungszentrum'],
  ['Die Redaktion','widersprüchliche Positionen gegenüberstellen','in der Wochenendausgabe','in der Kulturbeilage'],['Ein Kulturinstitut','eine öffentliche Kontroverse aufgreifen','am Ende der Veranstaltungsreihe','im Auditorium'],
  ['Eine Forschergruppe','einen langfristigen Trend relativieren','nach weiteren Messungen','im Fachjournal'],
 ],
}

const target:Record<GoetheLevel,number>={A1:15,A2:20,B1:30,B2:30,C1:30,C2:30}

function options(correct:string,other1:string,other2:string,position:number){
 const values=[other1,other2]
 values.splice(position,0,correct)
 return {options:values,answer:position}
}

function supplement(level:GoetheLevel,skill:'listening'|'reading'):{context:string;questions:Question[]}{
 const rows=events[level]
 const context=rows.map(([who,activity,when,where],index)=>skill==='listening'
  ? `Mitteilung ${index+1}: ${who} wird ${activity}. Das geschieht ${when} ${where}.`
  : `Mitteilung ${index+1}: Für ${who} ist folgende Aktivität angekündigt: ${activity}. Termin: ${when}. Ort: ${where}.`).join(' ')
 const questions:Question[]=[]
 rows.forEach(([who,activity,when,where],index)=>{
  const next=rows[(index+1)%rows.length], after=rows[(index+2)%rows.length]
  const facts:[string,string,string,string][]=[
   [`Wer wird ${activity}?`,who,next[0],after[0]],
   [`Wann findet „${activity}“ statt?`,when,next[2],after[2]],
   [`Wo findet „${activity}“ statt?`,where,next[3],after[3]],
  ]
  facts.forEach(([prompt,correct,other1,other2],factIndex)=>{
   const answer=options(correct,other1,other2,(index+factIndex)%3)
   questions.push({prompt,options:answer.options,answer:answer.answer})
  })
 })
 return {context,questions:questions.slice(0,target[level]-3)}
}

export function expandGoetheExam(exam:GoetheExam):GoetheExam{
 const listening=supplement(exam.level,'listening'),reading=supplement(exam.level,'reading')
 return {...exam,audio:`${exam.audio} ${listening.context}`,reading:`${exam.reading}\n\n${reading.context}`,
  listeningQuestions:[...exam.listeningQuestions,...listening.questions],
  readingQuestions:[...exam.readingQuestions,...reading.questions]}
}
