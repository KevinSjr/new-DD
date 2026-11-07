export type JapanSource = { label: string; url: string; verifiedAt: string }
export type JapanBlock = { title: string; text: string; note?: string; source?: JapanSource; link?: { label: string; url: string } }
export type JapanSection = { id: string; tab: string; kicker: string; title: string; intro: string; blocks: readonly JapanBlock[] }

const verifiedAt = '2026-10-28'

export const JAPAN_SOURCES = {
  population: { label: 'Statistics Bureau of Japan · Estimativas populacionais', url: 'https://www.stat.go.jp/data/jinsui/index.html', verifiedAt },
  hdi: { label: 'PNUD · Relatório de Desenvolvimento Humano 2025', url: 'https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.pdf', verifiedAt },
  jlpt: { label: 'JLPT · Níveis N1 a N5', url: 'https://www.jlpt.jp/e/about/levelsummary.html', verifiedAt },
  climate: { label: 'Agência Meteorológica do Japão · Médias climáticas', url: 'https://www.data.jma.go.jp/stats/en/normal/normal.html', verifiedAt },
  rainySeason: { label: 'Agência Meteorológica do Japão · Estação chuvosa', url: 'https://www.data.jma.go.jp/cpd/longfcst/en/tourist_baiu.html', verifiedAt },
  costs: { label: 'Study in Japan/JASSO · Custos de vida', url: 'https://www.studyinjapan.go.jp/en/life/cost-of-living/', verifiedAt },
  mext: { label: 'Study in Japan · Bolsas MEXT', url: 'https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/', verifiedAt },
  mextBrazil: { label: 'Consulado do Japão em Curitiba · Modalidades MEXT', url: 'https://www.curitiba.br.emb-japan.go.jp/itpr_pt/00_000021.html', verifiedAt },
  jasso: { label: 'JASSO · Programas de apoio a estudantes internacionais', url: 'https://www.studyinjapan.go.jp/en/about/support-program.html', verifiedAt },
  work: { label: 'Study in Japan · Trabalho de meio período', url: 'https://www.studyinjapan.go.jp/en/work-in-japan/part-time-jobs/', verifiedAt },
  tokyoWage: { label: 'Tokyo Labour Bureau · Salário mínimo desde outubro de 2026', url: 'https://jsite.mhlw.go.jp/tokyo-roudoukyoku/news_topics/houdou/20260930chinginka_00001.html', verifiedAt },
  afterStudy: { label: 'Study in Japan · Situação de residência para trabalho', url: 'https://www.studyinjapan.go.jp/en/work-in-japan/employment/status.html', verifiedAt },
  jobSearch: { label: 'Agência de Imigração do Japão · Busca de emprego após a graduação', url: 'https://www.moj.go.jp/isa/applications/status/designatedactivities14.html', verifiedAt },
  tokyoUniversity: { label: 'University of Tokyo · Site oficial', url: 'https://www.u-tokyo.ac.jp/en/', verifiedAt },
  kyotoUniversity: { label: 'Kyoto University · Site oficial', url: 'https://www.kyoto-u.ac.jp/en/', verifiedAt },
  osakaUniversity: { label: 'Osaka University · Site oficial', url: 'https://www.osaka-u.ac.jp/en/', verifiedAt },
  consular: { label: 'Itamaraty · Portal e-Consular', url: 'https://econsular.itamaraty.gov.br/', verifiedAt },
} satisfies Record<string, JapanSource>

export const JAPAN_SECTIONS: readonly JapanSection[] = [
  { id: 'idioma', tab: 'Idioma', kicker: '01 · Comunicação', title: 'Escolha o idioma do curso', intro: 'Programas em japonês e em inglês podem ter processos de admissão diferentes.', blocks: [
    { title: 'Cursos em japonês', text: 'O japonês usa hiragana, katakana e kanji. O JLPT tem níveis de N5 a N1, mas cada curso decide se aceita o exame e qual nível exige. Confira também se há prova própria da universidade.', source: JAPAN_SOURCES.jlpt, link: { label: 'Entender os níveis do JLPT', url: JAPAN_SOURCES.jlpt.url } },
    { title: 'Cursos em inglês', text: 'A oferta existe e varia por instituição e área. Confirme o idioma de todas as disciplinas e os exames de inglês aceitos; não existe uma nota única de IELTS ou TOEFL para o Japão inteiro.' },
  ] },
  { id: 'clima', tab: 'Clima', kicker: '02 · Vida cotidiana', title: 'Compare o clima da região escolhida', intro: 'As quatro estações têm características diferentes entre Hokkaido e Okinawa.', blocks: [
    { title: 'Estações e diferenças regionais', text: 'A primavera traz a floração das cerejeiras em épocas distintas pelo país. Verões costumam ser quentes e úmidos em muitas regiões; o inverno é mais frio no norte. Consulte médias mensais da cidade onde vai estudar.', source: JAPAN_SOURCES.climate, link: { label: 'Consultar médias climáticas', url: JAPAN_SOURCES.climate.url } },
    { title: 'Estação chuvosa', text: 'A estação chuvosa, chamada tsuyu ou baiu, ocorre no começo do verão em grande parte do país. O período varia por região e ano; Hokkaido não segue o mesmo padrão das demais áreas.', source: JAPAN_SOURCES.rainySeason },
  ] },
  { id: 'custos', tab: 'Custos', kicker: '03 · Orçamento', title: 'Planeje tudo em ienes', intro: 'Mensalidade, moradia e transporte variam conforme cidade e instituição.', blocks: [
    { title: 'Referência de custo de vida', text: 'A pesquisa JASSO de 2023 apontou despesa média mensal de ¥105.000 para estudantes internacionais financiados por conta própria, sem incluir estudo e pesquisa. A média de moradia era maior em Tóquio do que no conjunto do país. Use esses valores apenas como ponto de partida, com o ano da pesquisa visível.', source: JAPAN_SOURCES.costs },
    { title: 'Orçamento individual', text: 'Confirme taxa do curso, alojamento, alimentação, transporte, seguro e despesas de chegada na página da instituição. Compare valores em ienes e atualize o câmbio somente ao planejar o pagamento.', source: JAPAN_SOURCES.costs },
  ] },
  { id: 'bolsas', tab: 'Bolsas', kicker: '04 · Financiamento', title: 'Identifique a modalidade de bolsa adequada', intro: 'Graduação, pesquisa e intercâmbio seguem editais e calendários próprios.', blocks: [
    { title: 'Bolsa MEXT', text: 'O governo japonês oferece modalidades que vão de graduação a pesquisa e pós-graduação. Dependendo da modalidade, há isenção de taxas, passagem e bolsa mensal. A seleção pode ocorrer por recomendação da embaixada ou de uma universidade; confira o edital aplicável ao Brasil.', note: 'As páginas do consulado trazem informações de seleções anteriores. Consulte a embaixada ou o consulado responsável pelo seu estado para o próximo ciclo.', source: JAPAN_SOURCES.mext, link: { label: 'Conhecer as modalidades MEXT', url: JAPAN_SOURCES.mext.url } },
    { title: 'Candidatura no Brasil', text: 'A embaixada e os consulados japoneses publicam editais por modalidade e jurisdição. Graduação e pesquisa têm requisitos e provas diferentes; não reutilize o prazo de uma modalidade em outra.', source: JAPAN_SOURCES.mextBrazil, link: { label: 'Ver orientações consulares', url: JAPAN_SOURCES.mextBrazil.url } },
    { title: 'JASSO e universidades', text: 'A JASSO administra programas de apoio e intercâmbio. Universidades também podem oferecer bolsas próprias. Confira nacionalidade, curso, valor, duração e prazo no edital responsável.', source: JAPAN_SOURCES.jasso },
  ] },
  { id: 'universidades', tab: 'Universidades', kicker: '05 · Instituições', title: 'Compare os programas antes do ranking', intro: 'Posições mudam conforme edição e metodologia.', blocks: [
    { title: 'Instituições para pesquisar', text: 'Kyoto University, Osaka University e University of Tokyo são exemplos em ordem alfabética, sem posição de ranking.', source: JAPAN_SOURCES.tokyoUniversity },
    { title: 'O que observar', text: 'Compare idioma, currículo, requisitos, custos, bolsas e apoio internacional no site de cada instituição. Verifique o ano e o método se usar rankings.', link: { label: 'Explorar a Kyoto University', url: JAPAN_SOURCES.kyotoUniversity.url } },
  ] },
  { id: 'vida', tab: 'Vida no país', kicker: '06 · Adaptação', title: 'Prepare a rotina e conheça a cultura local', intro: 'Há grande diversidade entre regiões, cidades e comunidades.', blocks: [
    { title: 'Convívio', text: 'Cortesia e pontualidade ajudam na vida acadêmica. Cerimônia do chá, ikebana, origami, anime e mangá são apenas algumas expressões culturais; conheça também as atividades da sua cidade e universidade.' },
    { title: 'Apoio brasileiro', text: 'Procure a equipe internacional da instituição e confirme no e-Consular a representação brasileira responsável. Há comunidades brasileiras em diferentes regiões do Japão, mas este guia não apresenta uma contagem sem método verificável.', source: JAPAN_SOURCES.consular },
  ] },
  { id: 'calendario', tab: 'Calendário', kicker: '07 · Datas', title: 'Anote o calendário da instituição e da bolsa', intro: 'O ano acadêmico costuma começar em abril, mas há outras entradas conforme o curso.', blocks: [
    { title: 'Início das aulas', text: 'Muitas instituições iniciam o ano acadêmico em abril; algumas oferecem outra entrada. Confira as datas do programa, das provas, da matrícula e da chegada diretamente com a universidade.' },
    { title: 'Prazos de bolsas', text: 'A seleção MEXT é publicada por modalidade e ano. Anote separadamente prazo de inscrição, prova, entrevista, indicação da universidade e resultado. As datas da última edição não servem como prazo automático da próxima.', source: JAPAN_SOURCES.mextBrazil },
  ] },
  { id: 'candidatura', tab: 'Candidatura', kicker: '08 · Plano de ação', title: 'Monte sua candidatura por programa', intro: 'Os critérios finais pertencem à instituição e ao edital da bolsa.', blocks: [
    { title: '1. Escolha o curso', text: 'Confirme idioma, formação anterior aceita, provas, taxa, prazo e documentos na página do programa.' },
    { title: '2. Escolha a rota de financiamento', text: 'Se for buscar a MEXT, leia o edital da modalidade e da representação japonesa responsável. Prepare histórico acadêmico e projeto de estudos quando forem exigidos.', source: JAPAN_SOURCES.mextBrazil },
    { title: '3. Revise antes de enviar', text: 'Confira traduções, cartas de recomendação, certificados de idioma e formulários exigidos. Guarde os comprovantes de envio e acompanhe as etapas publicadas pela instituição.' },
  ] },
  { id: 'residencia', tab: 'Visto', kicker: '09 · Entrada e permanência', title: 'Confirme a situação de residência para estudar', intro: 'A admissão e a bolsa não substituem as formalidades de imigração.', blocks: [
    { title: 'Antes da viagem', text: 'Consulte a universidade e a representação japonesa sobre documentos e a categoria de residência adequada ao seu curso. Verifique também o procedimento de chegada e registro local.' },
    { title: 'Depois da graduação', text: 'Graduados elegíveis podem pedir mudança para a categoria Designated Activities a fim de continuar procurando emprego, sujeita a requisitos e documentos. Para assumir um emprego, é necessário obter uma categoria de residência que permita a atividade.', source: JAPAN_SOURCES.jobSearch, link: { label: 'Consultar a Agência de Imigração', url: JAPAN_SOURCES.jobSearch.url } },
  ] },
  { id: 'trabalho', tab: 'Trabalho', kicker: '10 · Durante os estudos', title: 'Obtenha autorização antes de trabalhar', intro: 'A renda de meio período complementa o orçamento, sem garantir todos os custos.', blocks: [
    { title: 'Limite geral', text: 'Quem tem status de estudante precisa da autorização para atividades fora do status de residência. O limite geral é de até 28 horas por semana; durante férias escolares longas, a orientação oficial permite até 8 horas por dia. Trabalho em negócios de entretenimento adulto é proibido.', source: JAPAN_SOURCES.work },
    { title: 'Salário mínimo local', text: 'O piso varia por província. Em Tóquio, passou a ¥1.280 por hora em 1.º de outubro de 2026. Verifique o valor vigente na região onde trabalhar e não use esse número como piso nacional.', source: JAPAN_SOURCES.tokyoWage },
    { title: 'Após conseguir emprego', text: 'O status de estudante deve ser alterado para uma categoria compatível com a atividade profissional. Confira os requisitos antes de iniciar o trabalho.', source: JAPAN_SOURCES.afterStudy },
  ] },
]
