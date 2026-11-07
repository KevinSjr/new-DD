import type { ImageSourcePropType } from 'react-native'
import { GERMANY_SECTIONS } from '../data/guides/germanyGuide'
import { CANADA_SECTIONS } from '../data/guides/canadaGuide'
import { UNITED_STATES_SECTIONS } from '../data/guides/unitedStatesGuide'
import { UNITED_KINGDOM_SECTIONS } from '../data/guides/unitedKingdomGuide'
import { FRANCE_SECTIONS } from '../data/guides/franceGuide'
import { AUSTRALIA_SECTIONS } from '../data/guides/australiaGuide'
import { JAPAN_SECTIONS } from '../data/guides/japanGuide'
import { CHINA_SECTIONS } from '../data/guides/chinaGuide'
import { KOREA_SECTIONS } from '../data/guides/southKoreaGuide'
import { NEW_ZEALAND_SECTIONS } from '../data/guides/newZealandGuide'
import { PORTUGAL_SECTIONS } from '../data/guides/portugalGuide'
import { SPAIN_SECTIONS } from '../data/guides/spainGuide'
import { ITALY_SECTIONS } from '../data/guides/italyGuide'
import { IRELAND_SECTIONS } from '../data/guides/irelandGuide'
import { BELGIUM_SECTIONS } from '../data/guides/belgiumGuide'
import { DENMARK_SECTIONS } from '../data/guides/denmarkGuide'
import { FINLAND_SECTIONS } from '../data/guides/finlandGuide'
import { HONG_KONG_SECTIONS } from '../data/guides/hongKongGuide'
import { MALAYSIA_SECTIONS } from '../data/guides/malaysiaGuide'
import { NORWAY_SECTIONS } from '../data/guides/norwayGuide'
import { NETHERLANDS_SECTIONS } from '../data/guides/netherlandsGuide'
import { SINGAPORE_SECTIONS } from '../data/guides/singaporeGuide'
import { SWEDEN_SECTIONS } from '../data/guides/swedenGuide'
import { SWITZERLAND_SECTIONS } from '../data/guides/switzerlandGuide'
import { TAIWAN_SECTIONS } from '../data/guides/taiwanGuide'

export type GuideSource={label:string;url:string;verifiedAt:string}
export type GuideBlock={title:string;text:string;items?:readonly string[];note?:string;source?:GuideSource;link?:{label:string;url:string}}
export type GuideSection={id:string;tab:string;kicker:string;title:string;intro:string;blocks:readonly GuideBlock[]}
export type MobileGuide={slug:string;name:string;flag:string;region:string;lead:string;image:ImageSourcePropType;sections:readonly GuideSection[]}
export const MOBILE_GUIDES:readonly MobileGuide[]=[
  {slug:'estados-unidos',name:'Estados Unidos',flag:'🇺🇸',region:'América do Norte',lead:'Compare cursos, bolsas, custos e passos para estudar no país.',image:require('../../assets/images/country-us.png'),sections:UNITED_STATES_SECTIONS},
  {slug:'canada',name:'Canadá',flag:'🇨🇦',region:'América do Norte',lead:'Entenda idiomas, custos, bolsas e regras de estudo por província.',image:require('../../assets/images/country-canada.png'),sections:CANADA_SECTIONS},
  {slug:'reino-unido',name:'Reino Unido',flag:'🇬🇧',region:'Europa',lead:'Compare cursos, financiamento e condições de estudo e trabalho.',image:require('../../assets/images/country-uk.png'),sections:UNITED_KINGDOM_SECTIONS},
  {slug:'alemanha',name:'Alemanha',flag:'🇩🇪',region:'Europa',lead:'Comece pelo idioma e pelos requisitos do curso que interessa a você.',image:require('../../assets/images/country-germany.png'),sections:GERMANY_SECTIONS},
  {slug:'franca',name:'França',flag:'🇫🇷',region:'Europa',lead:'Explore cursos, bolsas, custos e os caminhos de candidatura.',image:require('../../assets/images/country-france.jpg'),sections:FRANCE_SECTIONS},
  {slug:'australia',name:'Austrália',flag:'🇦🇺',region:'Oceania',lead:'Compare cursos, custos, bolsas e os passos para estudar no país.',image:require('../../assets/images/country-australia.jpg'),sections:AUSTRALIA_SECTIONS},
  {slug:'japao',name:'Japão',flag:'🇯🇵',region:'Ásia',lead:'Explore idiomas, cursos, bolsas e preparação para a candidatura.',image:require('../../assets/images/country-japan.jpg'),sections:JAPAN_SECTIONS},
  {slug:'china',name:'China',flag:'🇨🇳',region:'Ásia',lead:'Conheça as opções de estudo e os requisitos a conferir.',image:require('../../assets/images/country-china.jpg'),sections:CHINA_SECTIONS},
  {slug:'coreia-do-sul',name:'Coreia do Sul',flag:'🇰🇷',region:'Ásia',lead:'Organize sua pesquisa sobre cursos, idioma e bolsas.',image:require('../../assets/images/country-south-korea.jpg'),sections:KOREA_SECTIONS},
  {slug:'nova-zelandia',name:'Nova Zelândia',flag:'🇳🇿',region:'Oceania',lead:'Compare cursos, custos e etapas para estudar no país.',image:require('../../assets/images/country-new-zealand.jpg'),sections:NEW_ZEALAND_SECTIONS},
  {slug:'portugal',name:'Portugal',flag:'🇵🇹',region:'Europa',lead:'Conheça os caminhos de estudo e candidatura para brasileiros.',image:require('../../assets/images/country-portugal.jpg'),sections:PORTUGAL_SECTIONS},
  {slug:'espanha',name:'Espanha',flag:'🇪🇸',region:'Europa',lead:'Explore cursos, financiamento e requisitos de entrada.',image:require('../../assets/images/country-spain.jpg'),sections:SPAIN_SECTIONS},
  {slug:'italia',name:'Itália',flag:'🇮🇹',region:'Europa',lead:'Compare programas, custos e opções de bolsa.',image:require('../../assets/images/country-italy.jpg'),sections:ITALY_SECTIONS},
  {slug:'irlanda',name:'Irlanda',flag:'🇮🇪',region:'Europa',lead:'Pesquise cursos, custos e condições de estudo.',image:require('../../assets/images/country-ireland.jpg'),sections:IRELAND_SECTIONS},
  {slug:'belgica',name:'Bélgica',flag:'🇧🇪',region:'Europa',lead:'Compare regiões, idiomas, universidades e financiamento.',image:require('../../assets/images/country-belgium.jpg'),sections:BELGIUM_SECTIONS},
  {slug:'dinamarca',name:'Dinamarca',flag:'🇩🇰',region:'Europa',lead:'Explore cursos, custos, bolsas e regras de estudo.',image:require('../../assets/images/country-denmark.jpg'),sections:DENMARK_SECTIONS},
  {slug:'finlandia',name:'Finlândia',flag:'🇫🇮',region:'Europa',lead:'Conheça cursos, requisitos e caminhos de financiamento.',image:require('../../assets/images/country-finland.jpg'),sections:FINLAND_SECTIONS},
  {slug:'hong-kong',name:'Hong Kong',flag:'🇭🇰',region:'Ásia',lead:'Compare universidades, idiomas, custos e possibilidades de estudo.',image:require('../../assets/images/country-hong-kong.jpg'),sections:HONG_KONG_SECTIONS},
  {slug:'malasia',name:'Malásia',flag:'🇲🇾',region:'Ásia',lead:'Pesquise programas, custos e requisitos de candidatura.',image:require('../../assets/images/country-malaysia.jpg'),sections:MALAYSIA_SECTIONS},
  {slug:'noruega',name:'Noruega',flag:'🇳🇴',region:'Europa',lead:'Entenda cursos, custos e condições de estudo.',image:require('../../assets/images/country-norway.jpg'),sections:NORWAY_SECTIONS},
  {slug:'paises-baixos',name:'Países Baixos (Holanda)',flag:'🇳🇱',region:'Europa',lead:'Explore programas, bolsas e preparação para a candidatura.',image:require('../../assets/images/country-netherlands.jpg'),sections:NETHERLANDS_SECTIONS},
  {slug:'singapura',name:'Singapura',flag:'🇸🇬',region:'Ásia',lead:'Compare cursos, custos e opções de financiamento.',image:require('../../assets/images/country-singapore.jpg'),sections:SINGAPORE_SECTIONS},
  {slug:'suecia',name:'Suécia',flag:'🇸🇪',region:'Europa',lead:'Conheça universidades, bolsas e condições de estudo.',image:require('../../assets/images/country-sweden.jpg'),sections:SWEDEN_SECTIONS},
  {slug:'suica',name:'Suíça',flag:'🇨🇭',region:'Europa',lead:'Pesquise cursos, custos e requisitos por instituição.',image:require('../../assets/images/country-switzerland.jpg'),sections:SWITZERLAND_SECTIONS},
  {slug:'taiwan',name:'Taiwan',flag:'🇹🇼',region:'Ásia',lead:'Explore universidades, idiomas e possibilidades de bolsa.',image:require('../../assets/images/country-taiwan.jpg'),sections:TAIWAN_SECTIONS},
]
export const guideFor=(slug:string)=>MOBILE_GUIDES.find(item=>item.slug===slug)
export const hasMobileGuide=(slug:string)=>!!guideFor(slug)
