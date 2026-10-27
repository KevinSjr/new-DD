export type SpainSource = { label: string; url: string; verifiedAt: string }
export type SpainBlock = { title: string; text: string; note?: string; source?: SpainSource; link?: { label: string; url: string } }
export type SpainSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly SpainBlock[] }

const verifiedAt = '2026-10-26'

export const SPAIN_SOURCES = {
  population: { label: 'INE · População em 1.º de julho de 2026', url: 'https://www.ine.es/dyngs/Prensa/ECP2T26.htm', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/system/files/documents/global-report-document/hdr2025reporten.pdf', verifiedAt },
  climate: { label: 'AEMET · Serviços climáticos', url: 'https://www.aemet.es/es/lineas_de_interes/servicios_climaticos', verifiedAt },
  scholarships: { label: 'Fundación Carolina · Chamada 2026/27', url: 'https://www.fundacioncarolina.es/convocatoria-de-becas-2026-2027/', verifiedAt },
  visa: { label: 'Consulado da Espanha em São Paulo · Visto de estudos', url: 'https://www.exteriores.gob.es/Consulados/saopaulo/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=Brasil&scd=263&scs=Visados+Nacionales+-+Visado+de+estudios', verifiedAt },
  studies: { label: 'Ministério de Migrações · Estadia por estudos', url: 'https://inclusion.gob.es/web/migraciones/w/estancia-por-estudios', verifiedAt },
  work: { label: 'Ministério de Migrações · Trabalho de estudantes', url: 'https://www.inclusion.gob.es/es/web/migraciones/w/hoja-4-bis-acceso-al-empleo-de-las-personas-titulares-de-una-autorizacion-de-estancia-de-larga-duracion-por-estudios-movilidad-de-alumnos-servicios-de-voluntariado-o-actividades-formativas', verifiedAt },
  salary: { label: 'BOE · Salário mínimo interprofissional de 2026', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815', verifiedAt },
  recognition: { label: 'Ministério da Educação · Homologação de estudos', url: 'https://www.educacionfpydeportes.gob.es/mc/convalidacion-homologacion/convalidacion-no-universitaria/solicitud.html', verifiedAt },
  jobSearch: { label: 'Ministério de Migrações · Residência para busca de emprego', url: 'https://inclusion.gob.es/web/migraciones/w/20.-autorizacion-de-residencia-para-busqueda-de-empleo-o-inicio-de-proyecto-empresarial', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, SpainSource>

export const SPAIN_SECTIONS: readonly SpainSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Confira o idioma do curso e da região', intro: 'O espanhol é o idioma nacional, mas o cotidiano e o ensino podem incluir línguas cooficiais.', blocks: [
    { title: 'Espanhol e outras línguas', text: 'Catalão, basco e galego têm presença oficial em suas regiões. Consulte o idioma das aulas, avaliações e estágios na página do programa.' },
    { title: 'Comprovação de proficiência', text: 'A universidade define os certificados aceitos, como DELE ou equivalentes, e o nível exigido. A proximidade com o português ajuda na aprendizagem, mas não substitui a comprovação quando exigida.' },
    { title: 'Programas em inglês', text: 'Há cursos ministrados em inglês. Confira se todas as disciplinas de interesse seguem esse idioma e qual certificado é necessário.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Escolha a cidade com o clima em mente', intro: 'O clima espanhol muda bastante entre a costa, o norte e o interior.', blocks: [
    { title: 'Regiões diferentes', text: 'Partes da costa têm influência mediterrânea, o norte é mais úmido e o interior pode combinar verões quentes com invernos frios. Evite usar a média de uma cidade para todo o país.' },
    { title: 'Consulte dados locais', text: 'Compare temperaturas e chuva mês a mês na cidade onde pretende estudar, inclusive na época de chegada.', source: SPAIN_SOURCES.climate, link: { label: 'Consultar dados climáticos da AEMET', url: SPAIN_SOURCES.climate.url } },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Faça as contas para o seu curso e sua cidade', intro: 'Mensalidades e despesas diárias variam conforme a comunidade autônoma, a instituição e a moradia.', blocks: [
    { title: 'Mensalidade', text: 'Nas universidades públicas, preços são definidos no âmbito das comunidades autônomas e variam entre programas. Consulte a tabela de preços do seu ano de ingresso e confirme o valor aplicável ao seu perfil.' },
    { title: 'Custo de vida', text: 'Use estimativas de moradia, alimentação e transporte fornecidas pela universidade ou por serviços locais. Registre a cidade, a moeda (euro) e o período de referência. Não há uma faixa nacional confiável para todos os estudantes.' },
    { title: 'Despesas de chegada', text: 'Inclua documentos, seguro, depósito de moradia e deslocamento inicial no planejamento. Confira quais itens sua autorização de estudos exige.', source: SPAIN_SOURCES.studies },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Verifique editais e cobertura antes de contar com a bolsa', intro: 'A edição, o programa e a instituição determinam os requisitos e o valor do apoio.', blocks: [
    { title: 'Fundación Carolina · edição 2026/27', text: 'A chamada anunciou 736 bolsas em 203 programas, incluindo pós-graduação, doutorado, estadias curtas, mobilidade docente e bolsas institucionais. Os prazos dessa edição terminaram em 2 de março ou 9 de abril de 2026, conforme a modalidade; o programa ECV terminou em 18 de fevereiro.', note: 'A chamada citava estudantes ibero-americanos; isso não confirma elegibilidade individual. Confira requisitos, cobertura e datas da próxima edição no edital.', source: SPAIN_SOURCES.scholarships, link: { label: 'Ver a chamada da Fundación Carolina', url: SPAIN_SOURCES.scholarships.url } },
    { title: 'Mobilidade Erasmus+', text: 'Se você já estuda em uma instituição com convênio, consulte o escritório internacional sobre mobilidade e apoio financeiro. Requisitos e inscrição dependem do acordo e da chamada da instituição.' },
    { title: 'Bolsas da universidade', text: 'Procure na página do programa se há redução de mensalidade, bolsa de manutenção ou edital separado. Leia as condições para candidatos internacionais antes de se inscrever.' },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare programas, não só posições', intro: 'Rankings mudam a cada edição e usam metodologias diferentes.', blocks: [
    { title: 'Onde começar a pesquisa', text: 'Universidad Autónoma de Madrid, Universidad Complutense de Madrid e Universitat de Barcelona são exemplos em ordem alfabética, não uma classificação.' },
    { title: 'O que comparar', text: 'Consulte currículo, idioma, reconhecimento do diploma, mensalidade, bolsas e serviços de apoio. Se usar um ranking, veja o ano, a fonte e o método antes de comparar instituições.' },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Conheça a rotina da sua cidade', intro: 'Costumes e idiomas regionais fazem parte da experiência, mas variam de lugar para lugar.', blocks: [
    { title: 'Vida social', text: 'Horários de refeições e encontros para tapas podem ser diferentes dos que você conhece no Brasil. Observe a rotina local sem presumir que ela será igual em todas as cidades.' },
    { title: 'Festas e línguas', text: 'Semana Santa, San Fermín e La Tomatina são exemplos conhecidos; datas e regras variam por ano. Respeite também o uso das línguas locais em cada região.' },
    { title: 'Apoio consular', text: 'Antes da viagem, localize o consulado brasileiro responsável pela cidade de destino e confira os serviços disponíveis.', source: SPAIN_SOURCES.consular, link: { label: 'Consultar o e-Consular', url: SPAIN_SOURCES.consular.url } },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote os prazos do programa escolhido', intro: 'Muitos cursos começam no segundo semestre do ano, mas não existe um calendário único de candidatura.', blocks: [
    { title: 'Datas acadêmicas', text: 'O ano letivo costuma começar em setembro e terminar em junho, mas cada universidade publica seu próprio calendário. Confira início das aulas, matrícula e exames.' },
    { title: 'Prazos separados', text: 'Registre as datas de candidatura, bolsa, comprovação de idioma e visto. Use sempre a edição e o fuso horário publicados pelo programa.' },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Prepare os documentos exigidos pelo curso', intro: 'A lista final vem da instituição e pode mudar conforme o nível de estudo.', blocks: [
    { title: '1. Escolha o programa', text: 'Confirme área, nível, idioma, mensalidade e critérios de admissão. Verifique se há processo específico para candidatos com formação obtida no Brasil.' },
    { title: '2. Organize os comprovantes', text: 'Histórico, diploma, carta de motivação e certificado de idioma são exemplos comuns. A instituição pode exigir tradução oficial, apostila e outros documentos.' },
    { title: '3. Confira reconhecimento', text: 'Se o curso ou a profissão exigir homologação de estudos feitos no Brasil, consulte o procedimento oficial aplicável ao nível de ensino.', source: SPAIN_SOURCES.recognition },
    { title: '4. Revise a inscrição', text: 'Antes do envio, confira formulário, anexos, prazo e confirmação de recebimento. Depois da admissão, verifique o visto ou autorização de estudos.', source: SPAIN_SOURCES.visa },
  ] },
  { id: 'residencia', tab: 'Residência', kicker: '09 · Entrada no país', title: 'Confira sua situação migratória antes de viajar', intro: 'Tipo e duração do curso afetam o procedimento de entrada e permanência.', blocks: [
    { title: 'Visto e autorização de estudos', text: 'Use a página consular responsável por sua residência no Brasil e as orientações do Ministério de Migrações para confirmar documentos, prazos e condições atuais.', source: SPAIN_SOURCES.visa, link: { label: 'Consultar o visto de estudos', url: SPAIN_SOURCES.visa.url } },
    { title: 'Depois da graduação', text: 'Existe uma modalidade de residência para busca de emprego ou início de projeto empresarial, sujeita a requisitos próprios. Verifique se seu curso e sua situação se enquadram antes de planejar a permanência.', source: SPAIN_SOURCES.jobSearch },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Leia as condições da sua autorização', intro: 'Estudar na Espanha não dá as mesmas condições de trabalho para todos os cursos.', blocks: [
    { title: 'Ensino superior', text: 'A autorização de estadia de longa duração para estudos superiores pode permitir trabalho empregado ou autônomo sem autorização adicional, desde que compatível com os estudos. O limite geral é de 30 horas por semana.', note: 'Confira o tipo de autorização, as exceções e as condições atuais antes de aceitar uma vaga.', source: SPAIN_SOURCES.work },
    { title: 'Outras modalidades', text: 'Mobilidade de alunos, voluntariado e certas atividades formativas podem depender de autorização específica para trabalhar. Consulte o procedimento correspondente ao seu curso.', source: SPAIN_SOURCES.work },
    { title: 'Salário mínimo de 2026', text: 'O salário mínimo interprofissional para jornada completa é de €1.221 por mês em 14 pagamentos (€17.094 ao ano) em 2026. Contratos de jornada parcial são proporcionais; esse valor não é uma promessa de renda para estudantes.', source: SPAIN_SOURCES.salary },
  ] },
]
