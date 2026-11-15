export type DeleKind = 'reading' | 'listening' | 'integrated' | 'writing' | 'speaking'
export type DeleItem = {
  id: string
  task: number
  kind: 'choice' | 'writing' | 'speaking'
  context: string
  prompt: string
  options?: string[]
  answer?: number
  audio?: string
  review?: string
}
export type DeleSection = { id: string; title: string; kind: DeleKind; minutes: number; preparationMinutes?: number; taskSizes: number[]; items: DeleItem[] }
export type DeleExam = { level: string; title: string; sourceUrl: string; sections: DeleSection[] }

// Matrices from Instituto Cervantes adult (generales) exam guides. These are
// structural references only; every prompt below is original Daydreaming work.
const matrices = [
  { level: 'A1', source: 'https://examenes.cervantes.es/es/dele/examenes/a1', parts: [
    ['reading', 45, [5, 6, 6, 8]], ['listening', 25, [5, 5, 8, 7]], ['writing', 25, [1, 1]], ['speaking', 10, [1, 1, 1], 10],
  ] },
  { level: 'A2', source: 'https://examenes.cervantes.es/sites/default/files/DELE_A2_v2020_Guia_de_examen.pdf', parts: [
    ['reading', 60, [5, 8, 6, 6]], ['listening', 40, [6, 6, 6, 7]], ['writing', 45, [1, 1]], ['speaking', 12, [1, 1, 1], 12],
  ] },
  { level: 'B1', source: 'https://examenes.cervantes.es/es/dele/examenes/b1', parts: [
    ['reading', 70, [6, 6, 6, 6, 6]], ['listening', 40, [6, 6, 6, 6, 6]], ['writing', 60, [1, 1]], ['speaking', 15, [1, 1, 1, 1], 15],
  ] },
  { level: 'B2', source: 'https://examenes.cervantes.es/es/dele/examenes/b2', parts: [
    ['reading', 70, [6, 10, 6, 14]], ['listening', 40, [6, 6, 6, 6, 6]], ['writing', 80, [1, 1]], ['speaking', 20, [1, 1, 1], 20],
  ] },
  { level: 'C1', source: 'https://examenes.cervantes.es/sites/default/files/DELE_C1_v2024_Guia_de_examen_def_1.pdf', parts: [
    ['reading', 90, [6, 6, 6, 8, 14]], ['listening', 50, [6, 8, 6, 10]], ['writing', 80, [1, 1]], ['speaking', 20, [1, 1, 1], 20],
  ] },
  { level: 'C2', source: 'https://examenes.cervantes.es/sites/default/files/Guia_examen_dele_C2_2024_2.pdf', parts: [
    ['integrated', 105, [12, 6, 8, 5, 7, 6, 8]], ['writing', 150, [1, 1, 1]], ['speaking', 20, [1, 1, 1], 30],
  ] },
] as const

const labels: Record<DeleKind, string> = {
  reading: 'Comprensión de lectura', listening: 'Comprensión auditiva', integrated: 'Comprensión de lectura, auditiva y uso de la lengua',
  writing: 'Expresión e interacción escritas', speaking: 'Expresión e interacción orales',
}

type Situation = { place: string; time: string; action: string; reason: string; text: string }
const situations: Situation[] = [
  {place:'la biblioteca',time:'el lunes a las nueve',action:'recoger un libro reservado',reason:'preparar un trabajo de historia',text:'La biblioteca municipal avisó a Clara de que su libro ya está disponible. Debe retirarlo el lunes a las nueve; lo necesita para preparar un trabajo de historia.'},
  {place:'la estación',time:'el martes a las ocho',action:'tomar el tren regional',reason:'visitar a su hermana',text:'Álvaro irá a la estación el martes a las ocho para tomar el tren regional. Viaja para visitar a su hermana.'},
  {place:'el centro cultural',time:'el miércoles a las seis',action:'inscribirse en un taller de fotografía',reason:'aprender a usar su cámara',text:'El miércoles a las seis, Inés se inscribirá en un taller de fotografía en el centro cultural. Quiere aprender a usar su cámara.'},
  {place:'la universidad',time:'el jueves a las once',action:'entregar una solicitud',reason:'pedir una beca de movilidad',text:'Daniel tiene que entregar una solicitud en la universidad el jueves a las once. El trámite es necesario para pedir una beca de movilidad.'},
  {place:'el museo',time:'el viernes a las cinco',action:'hacer una visita guiada',reason:'conocer una exposición de arte',text:'El museo organiza una visita guiada el viernes a las cinco. Marta participará porque quiere conocer una exposición de arte.'},
  {place:'el polideportivo',time:'el sábado a las diez',action:'participar en una carrera',reason:'recaudar fondos para una escuela',text:'El sábado a las diez habrá una carrera en el polideportivo. Sus participantes quieren recaudar fondos para una escuela.'},
  {place:'la oficina de correos',time:'el lunes a las cuatro',action:'enviar un paquete',reason:'felicitar a su abuelo',text:'Lucía irá a la oficina de correos el lunes a las cuatro. Enviará un paquete para felicitar a su abuelo.'},
  {place:'el mercado',time:'el domingo a las nueve',action:'comprar verduras',reason:'preparar una comida familiar',text:'Óscar pasará por el mercado el domingo a las nueve. Comprará verduras para preparar una comida familiar.'},
  {place:'el teatro',time:'el martes a las siete',action:'ver una obra',reason:'acompañar a sus compañeros',text:'El grupo se reunirá en el teatro el martes a las siete. Verán una obra porque quieren acompañar a sus compañeros de clase.'},
  {place:'el centro de salud',time:'el jueves a las tres',action:'asistir a una charla',reason:'aprender primeros auxilios',text:'El centro de salud ofrece una charla el jueves a las tres. Pablo asistirá para aprender primeros auxilios.'},
  {place:'el jardín botánico',time:'el viernes a las diez',action:'observar plantas autóctonas',reason:'preparar un proyecto ambiental',text:'Nora visitará el jardín botánico el viernes a las diez. Observará plantas autóctonas para preparar un proyecto ambiental.'},
  {place:'la escuela de idiomas',time:'el miércoles a las cuatro',action:'hacer una prueba de nivel',reason:'elegir un curso adecuado',text:'El miércoles a las cuatro, Raúl hará una prueba de nivel en la escuela de idiomas. Así podrá elegir un curso adecuado.'},
  {place:'el ayuntamiento',time:'el lunes a las doce',action:'consultar un programa de voluntariado',reason:'colaborar con su barrio',text:'En el ayuntamiento, Sara consultará un programa de voluntariado el lunes a las doce. Le interesa colaborar con su barrio.'},
  {place:'la radio local',time:'el sábado a las once',action:'grabar una entrevista',reason:'difundir un proyecto juvenil',text:'Eva irá a la radio local el sábado a las once. Grabará una entrevista para difundir un proyecto juvenil.'},
  {place:'la cafetería del campus',time:'el martes a las dos',action:'reunirse con un tutor',reason:'revisar su plan de estudios',text:'La cafetería del campus será el punto de encuentro el martes a las dos. Bruno se reunirá con un tutor para revisar su plan de estudios.'},
  {place:'el archivo municipal',time:'el miércoles a las once',action:'consultar fotografías antiguas',reason:'investigar la historia del barrio',text:'En el archivo municipal, Elena consultará fotografías antiguas el miércoles a las once para investigar la historia del barrio.'},
  {place:'la cooperativa agrícola',time:'el viernes a las ocho',action:'entrevistar a productores',reason:'preparar un reportaje',text:'Tomás visitará la cooperativa agrícola el viernes a las ocho. Quiere entrevistar a productores para preparar un reportaje.'},
  {place:'el laboratorio universitario',time:'el lunes a las diez',action:'presentar los resultados de un experimento',reason:'recibir comentarios del equipo',text:'En el laboratorio universitario, Julia presentará los resultados de un experimento el lunes a las diez para recibir comentarios del equipo.'},
  {place:'la asociación vecinal',time:'el sábado a las cinco',action:'organizar una recogida de libros',reason:'ampliar una biblioteca comunitaria',text:'La asociación vecinal organizará una recogida de libros el sábado a las cinco para ampliar una biblioteca comunitaria.'},
  {place:'el cine del barrio',time:'el jueves a las siete',action:'asistir a un coloquio',reason:'debatir sobre cine documental',text:'El cine del barrio invita a asistir a un coloquio el jueves a las siete para debatir sobre cine documental.'},
  {place:'la oficina de turismo',time:'el martes a las doce',action:'solicitar un mapa accesible',reason:'planear una visita con sus abuelos',text:'Miriam acudirá a la oficina de turismo el martes a las doce. Solicitará un mapa accesible para planear una visita con sus abuelos.'},
  {place:'el centro juvenil',time:'el domingo a las cuatro',action:'coordinar una sesión de juegos',reason:'dar la bienvenida a nuevos vecinos',text:'En el centro juvenil, Leo coordinará una sesión de juegos el domingo a las cuatro para dar la bienvenida a nuevos vecinos.'},
  {place:'la clínica veterinaria',time:'el miércoles a las nueve',action:'hacer prácticas supervisadas',reason:'conocer el trabajo del equipo',text:'Patricia hará prácticas supervisadas en la clínica veterinaria el miércoles a las nueve para conocer el trabajo del equipo.'},
  {place:'el auditorio',time:'el viernes a las seis',action:'escuchar una conferencia',reason:'entender un proyecto científico',text:'El auditorio ofrecerá una conferencia el viernes a las seis. Iván asistirá para entender un proyecto científico.'},
  {place:'la escuela de cocina',time:'el sábado a las once',action:'participar en un taller',reason:'aprender recetas tradicionales',text:'Alicia participará en un taller en la escuela de cocina el sábado a las once para aprender recetas tradicionales.'},
]

const questions = [
  {key:'place',prompt:'¿Dónde ocurre la actividad principal?'},
  {key:'time',prompt:'¿Cuándo está prevista?'},
  {key:'action',prompt:'¿Qué va a hacer la persona?'},
  {key:'reason',prompt:'¿Para qué va a hacerlo?'},
] as const

const advancedCloze = [
  {context:'La comisión decidió aplazar la reunión, ___ faltaban documentos esenciales.',options:['puesto que','a pesar de','si bien'],answer:0},
  {context:'Se publicará el informe siempre ___ los datos hayan sido contrastados.',options:['que','cuando','como'],answer:0},
  {context:'La propuesta fue aceptada, ___ algunas reservas sobre su financiación.',options:['con','por','para'],answer:0},
  {context:'No se trata solo de reducir gastos, ___ de mejorar el servicio.',options:['sino','pero','aunque'],answer:0},
  {context:'El equipo revisó los resultados ___ detectar posibles errores.',options:['a fin de','con tal que','pese a'],answer:0},
  {context:'Por mucho que ___ los plazos, necesitaremos una revisión final.',options:['acortemos','acortamos','acortaremos'],answer:0},
  {context:'La noticia se difundió antes de que los responsables la ___.',options:['confirmaran','confirmaron','confirmarían'],answer:0},
  {context:'De haberse anunciado antes, más personas ___ participado.',options:['habrían','habían','hubieran de'],answer:0},
  {context:'Conviene que el documento ___ disponible para todos.',options:['esté','está','estará'],answer:0},
  {context:'El proyecto tendrá continuidad ___ se mantenga el apoyo institucional.',options:['siempre que','aun cuando','por más que'],answer:0},
  {context:'La medida resultó eficaz; ___, tuvo un coste superior al previsto.',options:['sin embargo','por consiguiente','de hecho'],answer:0},
  {context:'Los investigadores hicieron hincapié ___ la necesidad de repetir el estudio.',options:['en','a','por'],answer:0},
  {context:'La convocatoria se cerró sin que ___ recibido suficientes solicitudes.',options:['se hubieran','se habían','se habrán'],answer:0},
  {context:'Cabe ___ que la muestra no representa a toda la población.',options:['señalar','señalando','señalado'],answer:0},
] as const

function choiceItems(level:string, kind:DeleKind, taskSizes:readonly number[]):DeleItem[] {
  const items:DeleItem[]=[]
  let number=0
  taskSizes.forEach((size,taskIndex)=>{
    for(let i=0;i<size;i++){
      const situationIndex=(Math.floor(number/4)+taskIndex+(kind==='listening'?12:kind==='integrated'?7:0))%situations.length
      const situation=situations[situationIndex]
      const cloze=(level==='C1'&&kind==='reading'&&taskIndex===4)||(level==='C2'&&kind==='integrated'&&taskIndex===0)
      if(cloze){
        const example=advancedCloze[i%advancedCloze.length]
        const answer=(number+taskIndex)%3
        const options=[...example.options.slice(1)];options.splice(answer,0,example.options[0])
        items.push({id:level.toLowerCase()+'-'+kind+'-'+(++number),task:taskIndex+1,kind:'choice',context:example.context,
          prompt:'Elija la opción que completa la frase de forma adecuada.',options,answer,review:'Observe la relación gramatical y lógica entre las partes de la frase.'})
        continue
      }
      const question=questions[number%4]
      const values=[situation, situations[(situationIndex+2)%situations.length],situations[(situationIndex+5)%situations.length]]
      const answer=(number+taskIndex)%3
      const correct=values[0][question.key]
      const distractors=values.slice(1).map(value=>value[question.key])
      const options=[...distractors]; options.splice(answer,0,correct)
      const listening=kind==='listening'||kind==='integrated'&&taskIndex>=3
      items.push({id:level.toLowerCase()+'-'+kind+'-'+(++number),task:taskIndex+1,kind:'choice',context:situation.text,
        audio:listening?situation.text:undefined,prompt:question.prompt,options,answer,review:'Localice a informação correspondente no documento.'})
    }
  })
  return items
}

const openPrompts:Record<string,{writing:string[];speaking:string[]}>= {
  A1:{writing:['Complete un breve formulario con información personal y sus intereses.','Escriba un mensaje corto para invitar a un amigo a una actividad; indique cuándo y dónde.'],speaking:['Preséntese: nombre, origen, estudios y aficiones.','Hable de su vida diaria y describa una actividad que le guste.','Converse con el examinador imaginario sobre sus planes para el fin de semana.']},
  A2:{writing:['Responda a un mensaje de una persona que quiere visitar su ciudad. Dé recomendaciones prácticas.','Escriba un correo a un centro de idiomas para pedir información sobre horarios y precios.'],speaking:['Describa un viaje reciente o uno que le gustaría hacer.','Compare dos formas de viajar y explique cuál prefiere.','Dialogue para organizar una salida con otra persona.']},
  B1:{writing:['Escriba a un amigo sobre un cambio importante en sus estudios y explique sus razones.','Redacte una breve opinión sobre el uso de bibliotecas públicas e incluya ejemplos.'],speaking:['Realice una breve presentación sobre una experiencia de aprendizaje.','Dialogue sobre ventajas y problemas de estudiar a distancia.','Describa una imagen imaginaria de estudiantes colaborando y explique qué sucede.','Simule una conversación para resolver un problema de organización.']},
  B2:{writing:['Escriba un texto argumentativo para un blog sobre transporte sostenible. Defienda su postura con ejemplos.','Redacte una carta formal a una institución para proponer una mejora de su servicio.'],speaking:['Analice dos propuestas para mejorar una universidad y justifique una elección.','Participe en una conversación y responda a objeciones sobre su propuesta.','Comente los datos de una encuesta hipotética sobre hábitos de lectura y extraiga una conclusión.']},
  C1:{writing:['Escuche este resumen oral: una biblioteca amplió horarios y duplicó los préstamos digitales, pero redujo las actividades presenciales. Redacte una síntesis, valore las consecuencias y exprese su opinión.','Escriba un texto formal para una asociación cultural proponiendo un programa de intercambio; argumente prioridades y medidas.'],speaking:['Mediación: explique a un grupo los puntos de vista contrapuestos sobre la educación híbrida y proponga una síntesis.','Responda a preguntas críticas sobre su propuesta y matice sus argumentos.','Negocie con un interlocutor imaginario la distribución de recursos para un proyecto cultural.']},
  C2:{writing:['Mediación: transforme en un informe formal este resumen de una reunión oral: el equipo propuso ampliar la biblioteca digital, expresó dudas sobre la privacidad y pidió una fase piloto. Integre las perspectivas.','Mediación escrita: resuma para estudiantes internacionales un anuncio institucional sobre cambios en la matrícula, explicando consecuencias y límites.','Redacte una columna argumentativa sobre el acceso equitativo a la educación internacional; valore contraargumentos.'],speaking:['Mediación: exponga los argumentos de un debate sobre financiación universitaria y formule una propuesta equilibrada.','Responda a una entrevista simulada sobre los riesgos y beneficios de su propuesta.','Negocie con un interlocutor imaginario la prioridad entre becas, infraestructura y apoyo académico.']},
}
function openItems(level:string, kind:'writing'|'speaking', count:number):DeleItem[]{
  const prompts=openPrompts[level][kind]
  return Array.from({length:count},(_,i)=>({id:level.toLowerCase()+'-'+kind+'-'+(i+1),task:i+1,kind,
    context:kind==='writing'?'Producción original en español. Organice sus ideas y revise el registro.':'Práctica oral individual; en el examen real participa un examinador.',
    prompt:prompts[i],review:'Revise claridad, coherencia, vocabulario y corrección lingüística. Se requiere evaluación humana.'}))
}

export const deleExams:DeleExam[]=matrices.map(matrix=>({
  level:matrix.level,title:'DELE '+matrix.level+' · Exame 1',sourceUrl:matrix.source,
  sections:matrix.parts.map(([kind,minutes,taskSizes,preparationMinutes])=>({
    id:matrix.level.toLowerCase()+'-'+kind,title:matrix.level==='C1'&&kind==='reading'?'Comprensión de lectura y uso de la lengua':matrix.level==='C1'&&kind==='listening'?'Comprensión auditiva y uso de la lengua':labels[kind],kind,minutes,preparationMinutes,taskSizes:[...taskSizes],
    items:kind==='writing'||kind==='speaking'?openItems(matrix.level,kind,taskSizes.length):choiceItems(matrix.level,kind,taskSizes),
  })),
}))
export function findDeleExam(level:string){return deleExams.find(exam=>exam.level.toLowerCase()===level.toLowerCase())}
