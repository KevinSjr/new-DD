import type { DestinationAnswers } from '../lib/destinationMatcher'
import type { Region } from './destinationProfiles'

export type RadioKey = Exclude<keyof DestinationAnswers, 'regions' | 'priorities'>
type Question = { key:RadioKey; title:string; options:{value:string;label:string}[] }

export const regionOptions:{value:Region;label:string}[] = [
  {value:'america',label:'América do Norte'}, {value:'europe',label:'Europa'},
  {value:'asia',label:'Ásia'}, {value:'oceania',label:'Oceania'},
]

export const questionSteps:Question[][] = [
  [
    {key:'climate',title:'Que clima você prefere?',options:[{value:'snow',label:'Frio com neve'},{value:'mild',label:'Ameno, com estações'},{value:'warm',label:'Quente'},{value:'any',label:'Tanto faz'}]},
    {key:'language',title:'Em que idioma você quer estudar e viver?',options:[{value:'english',label:'Inglês'},{value:'learn',label:'Aceito aprender o idioma local'},{value:'similar',label:'Idioma parecido com português'}]},
    {key:'learningTime',title:'Quanto tempo aceitaria investir em um novo idioma?',options:[{value:'none',label:'Nenhum'},{value:'year',label:'Até 1 ano'},{value:'long',label:'Quanto for preciso'}]},
  ],
  [
    {key:'budget',title:'Qual é seu orçamento mensal para viver fora?',options:[{value:'low',label:'Baixo'},{value:'medium',label:'Médio'},{value:'high',label:'Alto'}]},
    {key:'tuition',title:'Como pretende pagar o curso?',options:[{value:'low',label:'Preciso de curso sem ou com pouca mensalidade'},{value:'scholarship',label:'Só com bolsa'},{value:'can-pay',label:'Posso pagar'}]},
    {key:'place',title:'Onde se sente melhor?',options:[{value:'large',label:'Cidade grande'},{value:'medium',label:'Cidade média ou universitária'},{value:'nature',label:'Perto da natureza'}]},
    {key:'work',title:'Quer trabalhar durante o curso?',options:[{value:'need',label:'Preciso'},{value:'nice',label:'Seria bom'},{value:'no',label:'Não pretendo'}]},
  ],
  [
    {key:'after',title:'O que gostaria de fazer depois do curso?',options:[{value:'stay',label:'Explorar oportunidades de permanência'},{value:'maybe',label:'Ainda não sei'},{value:'return',label:'Voltar ao Brasil'}]},
    {key:'level',title:'O que pretende estudar?',options:[{value:'undergraduate',label:'Graduação'},{value:'graduate',label:'Mestrado ou pós-graduação'},{value:'research',label:'Doutorado ou pesquisa'},{value:'exchange',label:'Intercâmbio'},{value:'language',label:'Idioma'},{value:'short',label:'Curso de curta duração'},{value:'undecided',label:'Ainda não sei'}]},
    {key:'field',title:'Qual área mais interessa?',options:[{value:'stem',label:'Exatas, tecnologia ou engenharia'},{value:'health',label:'Saúde e ciências da vida'},{value:'humanities',label:'Humanidades e educação'},{value:'business',label:'Negócios e ciências sociais'},{value:'arts',label:'Artes e criação'},{value:'undecided',label:'Ainda não sei'}]},
  ],
]

export const stepTitles = ['Onde você se imagina?', 'O que torna a viagem possível?', 'Que caminho quer seguir?']
export const stepKeys:(keyof DestinationAnswers)[][] = [
  ['regions','climate','language','learningTime'],
  ['budget','tuition','place','work'],
  ['after','level','field'],
]
