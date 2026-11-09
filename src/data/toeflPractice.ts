export type Skill = 'reading' | 'listening' | 'writing' | 'speaking'
export type ChoiceItem = { id: string; kind: 'choice'; task: string; context?: string; prompt: string; options: string[]; answer: number; explanation: string; audio?: string }
export type SentenceItem = { id: string; kind: 'sentence'; task: string; prompt: string; words: string[]; answer: string }
export type ResponseItem = { id: string; kind: 'response'; task: string; prompt: string; guidance: string; audio?: string }
export type PracticeItem = ChoiceItem | SentenceItem | ResponseItem

const q = (prompt: string, options: string[], answer: number, explanation: string) => {
  const offset = Array.from(prompt).reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length
  return { prompt, options: options.map((_, index) => options[(index + offset) % options.length]),
    answer: (answer - offset + options.length) % options.length, explanation }
}

type QuestionDraft = ReturnType<typeof q>
type ReadingSet = { task: string; passage: string; questions: QuestionDraft[] }

const readingSets: ReadingSet[] = [
  { task: 'Complete the Words', passage: 'The student garden opened last spring. Volunteers plant vegetables, record rainfall, and share the harvest with a neighborhood kitchen. The project also gives biology students a place to observe how soil conditions influence growth.', questions: [
    q('The garden opened last _____.', ['spring','winter','autumn','summer'],0,'The passage says it opened last spring.'),
    q('Volunteers record _____.', ['rainfall','attendance','traffic','tuition'],0,'Rainfall is the measurement named in the passage.'),
    q('The harvest is shared with a neighborhood _____.', ['library','kitchen','museum','laboratory'],1,'The recipient is a neighborhood kitchen.'),
    q('Biology students observe the influence of soil conditions on _____.', ['prices','growth','weather','transport'],1,'The final sentence connects soil conditions with growth.'),
    q('The closest meaning of “harvest” here is _____.', ['collected crops','written reports','volunteer hours','new equipment'],0,'Harvest refers to the crops produced by the garden.'),
    q('The project provides students with a place to _____.', ['conduct observations','buy textbooks','register for classes','rent tools'],0,'It gives biology students a place to observe.'),
    q('The vegetables are grown by _____.', ['volunteers','museum staff','bus drivers','visitors'],0,'Volunteers plant the vegetables.'),
    q('Which activity is NOT mentioned?', ['planting vegetables','recording rainfall','sharing the harvest','selling tickets'],3,'The passage does not mention tickets.'),
    q('The word “influence” is closest to _____.', ['affect','hide','measure','replace'],0,'Influence means affect in this context.'),
    q('What is the main purpose of the garden for biology students?', ['A place to observe growth','A place to attend lectures','A place to buy food','A place to store bicycles'],0,'Students can observe how conditions affect growth.'),
  ]},
  { task: 'Read in Daily Life', passage: 'LIBRARY NOTICE — From Monday, the east study room will close for two weeks while new lighting is installed. The west study room and computer lab will remain open. Group reservations originally booked in the east room will be moved automatically to the west room. Students who need a quiet individual desk may use the second floor reading area. Please ask the front desk if you need an accessible workstation.', questions: [
    q('Why is the east study room closing?', ['Lighting installation','A campus holiday','A book sale','Computer repairs'],0,'New lighting is being installed.'),
    q('How long will it be closed?', ['One day','Two weeks','One month','The entire semester'],1,'The notice says two weeks.'),
    q('Where will existing group reservations move?', ['The computer lab','The second floor','The west study room','The front desk'],2,'They are moved automatically to the west room.'),
    q('Does a student need to rebook an existing group reservation?', ['Yes, online','Yes, by phone','No, it moves automatically','Only on weekends'],2,'The move is automatic.'),
    q('Which place remains open?', ['The east study room','The west study room','The lighting office','The east entrance only'],1,'The west study room remains open.'),
    q('Where can a student find a quiet individual desk?', ['The second floor reading area','The east room','The cafeteria','The west parking lot'],0,'The second floor reading area is recommended.'),
    q('Who should students ask about an accessible workstation?', ['A professor','The front desk','The maintenance team','The bookstore'],1,'The notice directs them to the front desk.'),
    q('When does the closure begin?', ['Monday','Tuesday','Friday','Sunday'],0,'It begins Monday.'),
    q('Which facility is also staying open?', ['The computer lab','The east room','The auditorium','The archive'],0,'The computer lab remains open.'),
    q('What is this notice mainly doing?', ['Explaining a temporary change in library spaces','Advertising a new degree','Announcing exam results','Recruiting volunteers'],0,'It explains a temporary closure and alternatives.'),
  ]},
  { task: 'Read in Daily Life', passage: 'FIELD TRIP EMAIL — Hello students, our coastal ecology visit has been moved to Thursday because the research vessel is unavailable on Wednesday. Meet outside the science building at 7:45 a.m.; the bus leaves at 8:00. Bring a reusable water bottle, waterproof shoes, and your student ID. Lunch is provided, but please tell us by Tuesday if you need a vegetarian meal. The return bus is expected at 4:30 p.m.', questions: [
    q('Why was the trip moved?', ['The vessel is unavailable Wednesday','The bus broke down','Lunch was canceled','The building is closed'],0,'The research vessel is unavailable Wednesday.'),
    q('On what day will the trip take place?', ['Tuesday','Wednesday','Thursday','Friday'],2,'The new date is Thursday.'),
    q('Where should students meet?', ['Outside the science building','At the harbor gate','Inside the library','At the dining hall'],0,'The email says outside the science building.'),
    q('What time does the bus leave?', ['7:45 a.m.','8:00 a.m.','4:30 p.m.','9:00 a.m.'],1,'The bus leaves at 8:00 a.m.'),
    q('What type of shoes should students bring?', ['Formal shoes','Waterproof shoes','Running spikes','Sandals'],1,'Waterproof shoes are requested.'),
    q('Which item is NOT listed as something to bring?', ['Water bottle','Student ID','Waterproof shoes','Packed lunch'],3,'Lunch is provided.'),
    q('By when should a vegetarian meal be requested?', ['Monday','Tuesday','Thursday','Friday'],1,'Students should tell the organizer by Tuesday.'),
    q('When is the return bus expected?', ['8:00 a.m.','Noon','4:30 p.m.','7:45 p.m.'],2,'The return is expected at 4:30 p.m.'),
    q('Is lunch provided?', ['Yes','No','Only for staff','Only if requested by Monday'],0,'The email explicitly says lunch is provided.'),
    q('What is the main purpose of the email?', ['To update trip logistics','To describe a new course','To request research papers','To cancel the trip'],0,'The email updates the day, travel, and preparation details.'),
  ]},
  { task: 'Read an Academic Passage', passage: 'Urban trees can reduce the temperature of nearby streets through shade and evaporation from leaves. However, their effect varies with species, canopy size, and available water. A team compared two neighborhoods with similar buildings but different tree cover. On summer afternoons, the shaded neighborhood had lower surface temperatures. The researchers caution that trees are only one part of an effective heat strategy: reflective roofs and access to indoor cooling also matter.', questions: [
    q('How can trees cool streets?', ['Shade and evaporation','Underground electricity','Traffic reduction alone','Changes in latitude'],0,'The passage identifies shade and evaporation.'),
    q('Which factor affects the strength of tree cooling?', ['Canopy size','Street name','Building age only','Bus schedule'],0,'Canopy size is explicitly listed.'),
    q('Why did the team choose neighborhoods with similar buildings?', ['To make tree cover a clearer comparison','To study architecture styles','To avoid summer measurements','To compare bus routes'],0,'Similar buildings help isolate the difference in tree cover.'),
    q('When were lower surface temperatures observed?', ['On summer afternoons','At winter midnight','During autumn mornings','Only during rain'],0,'The observation was on summer afternoons.'),
    q('What was lower in the shaded neighborhood?', ['Surface temperature','Population','Rainfall','Building height'],0,'Surface temperatures were lower.'),
    q('What is the researchers’ main caution?', ['Trees alone are not a complete heat strategy','Trees never need water','All species cool equally','Reflective roofs cause heat'],0,'The passage says trees are only one part of a strategy.'),
    q('Which additional measure is mentioned?', ['Reflective roofs','More parking spaces','Longer roads','Wider sidewalks only'],0,'Reflective roofs are listed.'),
    q('The word “varies” is closest to _____.', ['changes','disappears','increases always','is measured'],0,'Varies means changes depending on conditions.'),
    q('Which condition may limit the cooling effect?', ['Lack of available water','Short street names','Similar buildings','Indoor cooling'],0,'Available water affects tree cooling.'),
    q('What can be inferred about city planning?', ['Several measures may work together','One species solves every heat problem','Shade is irrelevant','Indoor cooling should be removed'],0,'The researchers recommend a combination of measures.'),
  ]},
  { task: 'Read an Academic Passage', passage: 'Some migratory birds use Earth’s magnetic field as one source of directional information. Experiments in controlled settings show that changing the magnetic field can alter the direction birds attempt to fly. Yet this does not mean magnetism is their only guide. The position of the sun, visible landmarks, and even odors may contribute. Scientists therefore study navigation as a system of overlapping cues rather than a single built-in compass.', questions: [
    q('What is the passage mainly about?', ['Multiple cues in bird navigation','The history of bird feeders','How birds build nests','Changes in ocean currents'],0,'The passage describes multiple navigation cues.'),
    q('What happened when researchers changed the magnetic field?', ['The attempted flight direction changed','Birds stopped eating','Landmarks disappeared','The sun moved'],0,'The experiments showed a change in attempted direction.'),
    q('Does the passage claim magnetism is the only guide?', ['No','Yes','Only at night','Only near oceans'],0,'It explicitly says magnetism is not the only guide.'),
    q('Which additional cue is mentioned?', ['The sun','Water temperature','Moon phases only','Cloud height'],0,'The position of the sun is mentioned.'),
    q('What are “landmarks” in this context?', ['Visible features in the environment','Research papers','Magnetic instruments','Food samples'],0,'Landmarks are visible environmental features.'),
    q('Why use controlled settings?', ['To examine the effect of changing one cue','To make birds migrate farther','To remove all observations','To teach birds a route'],0,'Controlled experiments can isolate a cue’s effect.'),
    q('The word “cues” most nearly means _____.', ['signals','obstacles','habitats','seasons'],0,'Cues are signals used for orientation.'),
    q('Which sense besides vision may play a role?', ['Smell','Taste only','Touch only','Hearing only'],0,'Odors may contribute.'),
    q('How do scientists describe the navigation system?', ['Overlapping sources of information','One infallible compass','A random path','Only learned street maps'],0,'The final sentence says overlapping cues.'),
    q('What would best test the role of odor?', ['Change odor cues while keeping other conditions similar','Measure wing length only','Count nests in winter','Observe feeding time'],0,'Changing one cue while controlling others tests its role.'),
  ]},
]

export const readingItems: ChoiceItem[] = readingSets.flatMap((set, setIndex) => set.questions.map((item, index) => ({
  id:`r-${setIndex + 1}-${index + 1}`, kind:'choice', task:set.task, context:set.passage, ...item,
})))

type ListeningSet = { task: string; script: string; questions: QuestionDraft[] }
const listeningSets: ListeningSet[] = [
  {task:'Listen to a Conversation',script:'Student: Hi, I reserved a microscope for tomorrow, but my lab has moved to Friday. Can I change the reservation? Staff: Yes. Friday morning is full, but there is an opening at two in the afternoon. Student: That works. Do I need to bring anything? Staff: Your student card, and please arrive ten minutes early for the safety check.',questions:[
    q('Why does the student visit the desk?',['To change a reservation','To pay a fee','To borrow a book','To report a broken microscope'],0,'The student wants to change a microscope reservation.'),q('When is the lab now scheduled?',['Thursday','Friday','Saturday','Monday'],1,'The lab moved to Friday.'),q('What time is available?',['Friday morning','Friday at 2 p.m.','Tomorrow at 10 a.m.','Friday at noon'],1,'The available opening is at two in the afternoon.'),q('What must the student bring?',['A student card','A passport','A lab report','A payment receipt'],0,'The staff member requests a student card.'),q('Why should the student arrive early?',['For a safety check','For lunch','For registration','For a lecture'],0,'The safety check takes place before the reservation.'),
  ]},
  {task:'Listen to an Announcement',script:'Attention students. The campus shuttle will use a temporary stop outside the north gate this week while the central road is repaired. Buses will still run every twenty minutes. The first shuttle departs at seven thirty in the morning. Please check the transport page on Friday for the normal route.',questions:[
    q('What is changing this week?',['The shuttle stop','The library hours','Tuition fees','The exam schedule'],0,'The stop moves temporarily.'),q('Where is the temporary stop?',['Outside the north gate','Behind the library','At the south parking lot','Inside the station'],0,'It is outside the north gate.'),q('Why is the route changing?',['Road repairs','A festival','Heavy snow','A new semester'],0,'The central road is being repaired.'),q('How often do buses run?',['Every ten minutes','Every twenty minutes','Every hour','Twice daily'],1,'Buses continue every twenty minutes.'),q('When should students check for the normal route?',['Friday','Monday','Tonight','Next month'],0,'The announcement says to check on Friday.'),
  ]},
  {task:'Listen to an Academic Talk',script:'Today we will discuss coral bleaching. Corals contain tiny organisms that provide much of their energy. When water remains unusually warm, corals may expel these organisms and turn pale. A bleached coral is not necessarily dead, but it is under stress. If normal temperatures return soon enough, the organisms may return. Repeated heat events make recovery more difficult.',questions:[
    q('What is the talk about?',['Coral bleaching','Deep sea mining','River pollution','Fish migration'],0,'The subject is coral bleaching.'),q('What supplies much of a coral’s energy?',['Tiny organisms','Sand','Salt alone','Moonlight'],0,'The organisms provide much of the energy.'),q('What can trigger bleaching?',['Unusually warm water','Short daylight','Low tides alone','Cold air'],0,'Sustained warm water is the trigger described.'),q('Is bleached coral necessarily dead?',['No','Yes','Only in winter','Only near islands'],0,'The speaker says it is not necessarily dead.'),q('What makes recovery harder?',['Repeated heat events','A return to normal temperatures','The return of organisms','Shorter lectures'],0,'Repeated heat events make recovery harder.'),
  ]},
  {task:'Listen to a Conversation',script:'Student: I am considering the statistics course, but the timetable says it requires calculus. I completed calculus at another university. Advisor: Bring the transcript to the department office. They can review whether it satisfies the prerequisite. Student: Can I register now? Advisor: Please wait for their decision. The course still has seats available.',questions:[
    q('What course interests the student?',['Statistics','Chemistry','History','Literature'],0,'The student is considering statistics.'),q('What is the prerequisite?',['Calculus','Biology','Economics','Writing'],0,'The timetable lists calculus.'),q('Where was the prerequisite studied?',['At another university','At this university','Online this week','In secondary school'],0,'The student completed it elsewhere.'),q('What should the student bring?',['A transcript','A passport','A recommendation letter','A receipt'],0,'The advisor asks for a transcript.'),q('Should the student register immediately?',['No, wait for the decision','Yes, without review','Only after the course begins','Only if a friend registers'],0,'The advisor says to wait for the department decision.'),
  ]},
  {task:'Listen to an Announcement',script:'The student art exhibition opens on Tuesday in the main hall. The opening talk begins at five, and the exhibition remains open until the end of the month. Admission is free. Visitors who want to attend the workshop on Saturday must sign up online because places are limited.',questions:[
    q('What event is announced?',['A student art exhibition','A science fair','A concert','A sports match'],0,'It is a student art exhibition.'),q('When does it open?',['Tuesday','Thursday','Saturday','Sunday'],0,'It opens Tuesday.'),q('When is the opening talk?',['At five','At noon','At eight','At ten'],0,'The talk begins at five.'),q('How much is admission?',['Free','Five dollars','Ten dollars','It varies by day'],0,'Admission is free.'),q('What requires online sign-up?',['The Saturday workshop','The opening talk','General admission','The closing day'],0,'Workshop places are limited, so sign-up is required.'),
  ]},
  {task:'Listen to an Academic Talk',script:'Many historians once assumed that early trade routes moved goods mainly between large cities. Recent archaeological finds suggest smaller towns also played an important role. Pottery made in one region has been found in distant villages. This does not tell us exactly who carried it, but it shows that exchange networks reached beyond major urban centers.',questions:[
    q('What older assumption does the lecturer mention?',['Trade mainly linked large cities','Small towns produced no pottery','Villages had no residents','Cities never traded'],0,'The older assumption focused on large cities.'),q('What is the new evidence?',['Pottery found in distant villages','A new road map','Written tax records','Modern sales data'],0,'The archaeological finds include pottery in distant villages.'),q('What role may small towns have played?',['An important part in trade','No role at all','Only military defense','Only farming'],0,'The new finds suggest an important role.'),q('What is still unknown?',['Exactly who carried the goods','Where the pottery was made','Whether villages existed','Whether cities traded'],0,'The lecturer says the carrier is unknown.'),q('What is the main conclusion?',['Exchange extended beyond major cities','All trade was local','Pottery was never transported','Villages replaced cities'],0,'Networks reached beyond major urban centers.'),
  ]},
  {task:'Listen to a Conversation',script:'Student: My field notebook was left on the bus after yesterday’s trip. Is there a lost-and-found office? Coordinator: Yes, the transport office keeps found items for thirty days. Call them with the route number and an approximate time. Student: I have the route number in my email. Coordinator: Good. Meanwhile, ask your partner for a copy of the measurements.',questions:[
    q('What did the student lose?',['A field notebook','A laptop','A student card','A camera'],0,'The student left a field notebook on the bus.'),q('Where are found items kept?',['The transport office','The library','The science building','The cafeteria'],0,'The transport office keeps them.'),q('For how long are items kept?',['Thirty days','One week','One year','Two days'],0,'The office keeps them for thirty days.'),q('What information should the student provide?',['Route number and approximate time','A course grade','A home address only','A passport number'],0,'The coordinator requests route and time.'),q('What should the student do meanwhile?',['Ask a partner for the measurements','Repeat the trip today','Buy a new notebook','Cancel the course'],0,'The partner can provide a copy of the measurements.'),
  ]},
  {task:'Listen to an Announcement',script:'The language center is offering short pronunciation workshops next month. Each workshop lasts forty-five minutes and focuses on one sound pattern. Students may attend more than one session, but registration is required for each. The sessions are open to all students, regardless of major.',questions:[
    q('What is the language center offering?',['Pronunciation workshops','Exam certificates','Private tutoring only','A new degree'],0,'The announcement describes pronunciation workshops.'),q('How long is each session?',['Forty-five minutes','Twenty minutes','Two hours','One day'],0,'Each lasts forty-five minutes.'),q('What does each workshop focus on?',['One sound pattern','All grammar rules','One country','Academic writing'],0,'Each focuses on one sound pattern.'),q('Can students attend several sessions?',['Yes, with registration for each','No, only one','Only graduate students can','Only if invited'],0,'Multiple sessions are allowed with separate registration.'),q('Who may attend?',['All students','Only language majors','Only first-year students','Only staff'],0,'They are open regardless of major.'),
  ]},
  {task:'Listen to an Academic Talk',script:'A lake’s water can form layers in summer. Warm, less dense water stays near the surface, while colder water remains below. This separation can limit the movement of oxygen to deeper areas. In autumn, surface water cools and the layers may mix. Researchers measure temperature and oxygen at several depths to understand these seasonal changes.',questions:[
    q('What is the talk mainly about?',['Seasonal layers in lake water','Ocean tides','Rainfall forecasting','Fish breeding only'],0,'The lecturer describes lake stratification and mixing.'),q('Where is warmer water in summer?',['Near the surface','At the bottom','Only at the shore','Nowhere in the lake'],0,'Warm, less dense water stays near the surface.'),q('What can the separation limit?',['Oxygen reaching deeper water','Sunlight at the surface','Autumn cooling','The size of the lake'],0,'Layering can limit oxygen movement downward.'),q('What can happen in autumn?',['The layers may mix','The lake disappears','All water freezes','Oxygen stops existing'],0,'Cooling can lead to mixing.'),q('What do researchers measure?',['Temperature and oxygen at different depths','Only wind speed','Only rainfall','Only fish weight'],0,'They measure both at several depths.'),
  ]},
]

export const listeningItems: ChoiceItem[] = [
  {id:'l-response-1',kind:'choice',task:'Listen and Choose a Response',audio:'Could you tell me where the student services office is?',prompt:'Choose the most appropriate response.',options:['It is beside the main library.','I studied yesterday.','The deadline was long.','I prefer the blue one.'],answer:0,explanation:'The question asks for a location.'},
  {id:'l-response-2',kind:'choice',task:'Listen and Choose a Response',audio:'Would you like me to email you the schedule?',prompt:'Choose the most appropriate response.',options:['Yes, that would be helpful.','The room is on the left.','It rained yesterday.','I have three notebooks.'],answer:0,explanation:'The speaker offers to send the schedule.'},
  ...listeningSets.flatMap((set, setIndex) => set.questions.map((item, index) => ({
    id:`l-${setIndex + 1}-${index + 1}`, kind:'choice' as const, task:set.task, audio:set.script, ...item,
  }))),
]

const sentencePairs: [string,string[]][] = [
  ['The professor postponed the lecture until Friday.',['until','the lecture','Friday','postponed','The professor']],
  ['Students can reserve a room online.',['a room','online','Students','reserve','can']],
  ['The library closes at six on Sundays.',['on Sundays','at six','The library','closes']],
  ['The survey results were published yesterday.',['were published','The survey results','yesterday']],
  ['We should compare both methods carefully.',['both methods','carefully','We','compare','should']],
  ['The workshop will begin after lunch.',['after lunch','will begin','The workshop']],
  ['Researchers collected samples from the lake.',['from the lake','samples','collected','Researchers']],
  ['Please submit your application before noon.',['before noon','your application','submit','Please']],
  ['The new route saves passengers time.',['passengers','The new route','time','saves']],
  ['Our group discussed the findings together.',['the findings','together','Our group','discussed']],
]
export const writingItems: PracticeItem[] = [
  ...sentencePairs.map(([answer,words],index):SentenceItem=>({id:`w-sentence-${index+1}`,kind:'sentence',task:'Build a Sentence',prompt:'Organize the words into a natural English sentence. Use every part once.',words,answer})),
  {id:'w-email',kind:'response',task:'Write an Email',prompt:'You borrowed a book from the campus library, but you need it for an assignment after its due date. Write an email asking about a renewal. Explain why you need it and ask what to do next.',guidance:'Write a clear subject, greeting, request, short explanation, and polite closing. Aim for 80–120 words.'},
  {id:'w-discussion',kind:'response',task:'Write for an Academic Discussion',prompt:'Professor: Should universities offer more classes online, or is in-person learning more valuable? Student A: Online classes make education more accessible. Student B: In-person discussion helps me stay engaged. Add your own view and respond to at least one point.',guidance:'State a position, support it with a reason or example, and connect it to the discussion. Aim for at least 100 words.'},
]

const repeatSentences = [
  'The library will extend its hours during final exams.',
  'Please bring your student card to the laboratory.',
  'Our research group meets every Thursday afternoon.',
  'The museum exhibition opens to the public next week.',
  'Students can register for the workshop online.',
  'The results of the survey were published yesterday.',
]
const interviewPrompts = [
  'What is one place on your campus that you would recommend to a new student, and why?',
  'Describe a time when you learned something useful from working in a group.',
  'Do you prefer to study in the morning or evening? Explain your choice.',
  'What is one environmental change your city could make? Give a reason.',
  'How would you prepare for a difficult course next semester?',
]
export const speakingItems: ResponseItem[] = [
  ...repeatSentences.map((text,index)=>({id:`s-repeat-${index+1}`,kind:'response' as const,task:'Listen and Repeat',prompt:'Listen to the sentence, then repeat it aloud.',guidance:'Compare your recording with the original sentence. Focus on clarity and complete meaning.',audio:text})),
  ...interviewPrompts.map((prompt,index)=>({id:`s-interview-${index+1}`,kind:'response' as const,task:'Take an Interview',prompt,guidance:'Give a direct answer and develop it with a reason or example. Record about 30–45 seconds.',audio:prompt})),
]

export const practiceSections: {id:Skill; title:string; minutes:number; items:PracticeItem[]}[] = [
  {id:'reading',title:'Reading',minutes:30,items:readingItems},
  {id:'listening',title:'Listening',minutes:29,items:listeningItems},
  {id:'writing',title:'Writing',minutes:23,items:writingItems},
  {id:'speaking',title:'Speaking',minutes:8,items:speakingItems},
]

export const TOEFL_PRACTICE_EXAM = {
  id:'exame-1',
  title:'Exame 1',
  totalItems:practiceSections.reduce((total,section)=>total+section.items.length,0),
} as const
