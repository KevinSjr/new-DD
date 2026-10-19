import type { InterestArea } from './vocationalQuestions'

export type CareerPath = {
  title: string
  courses: string
}

// Curadoria inicial fornecida pelo projeto. São exemplos para explorar, não
// perfis ocupacionais validados nem requisitos formais de exercício profissional.
export const CAREERS_BY_AREA: Record<InterestArea, readonly CareerPath[]> = {
  organizational: [
    { title: 'Contabilidade', courses: 'Ciências Contábeis' },
    { title: 'Auditoria e controladoria', courses: 'Ciências Contábeis, Administração' },
    { title: 'Finanças e planejamento financeiro', courses: 'Administração, Economia' },
    { title: 'Logística e cadeia de suprimentos', courses: 'Logística, Engenharia de Produção' },
    { title: 'Gestão pública e administração', courses: 'Administração Pública' },
    { title: 'Análise de dados e de processos', courses: 'Estatística, Sistemas de Informação' },
    { title: 'Secretariado executivo e gestão documental', courses: 'Secretariado Executivo, Arquivologia' },
    { title: 'Bibliotecas e gestão da informação', courses: 'Biblioteconomia' },
  ],
  creative: [
    { title: 'Design gráfico, de produto e de interfaces', courses: 'Design' },
    { title: 'Arquitetura e urbanismo', courses: 'Arquitetura e Urbanismo' },
    { title: 'Publicidade e criação', courses: 'Publicidade e Propaganda' },
    { title: 'Audiovisual, cinema e animação', courses: 'Cinema, Audiovisual' },
    { title: 'Jornalismo e produção de conteúdo', courses: 'Jornalismo, Comunicação Social' },
    { title: 'Música e artes cênicas', courses: 'Música, Artes Cênicas' },
    { title: 'Moda', courses: 'Design de Moda' },
    { title: 'Jogos digitais', courses: 'Jogos Digitais, Design' },
  ],
  social: [
    { title: 'Professor(a) e pedagogo(a)', courses: 'Pedagogia, licenciaturas' },
    { title: 'Psicologia', courses: 'Psicologia' },
    { title: 'Enfermagem', courses: 'Enfermagem' },
    { title: 'Fisioterapia e terapia ocupacional', courses: 'Fisioterapia, Terapia Ocupacional' },
    { title: 'Serviço social', courses: 'Serviço Social' },
    { title: 'Nutrição', courses: 'Nutrição' },
    { title: 'Fonoaudiologia', courses: 'Fonoaudiologia' },
    { title: 'Recursos humanos', courses: 'Gestão de RH, Psicologia organizacional' },
  ],
  investigative: [
    { title: 'Pesquisa científica', courses: 'Biologia, Física, Química, Matemática' },
    { title: 'Medicina e áreas da saúde com foco em pesquisa', courses: 'Medicina, Biomedicina, Farmácia' },
    { title: 'Ciência de dados e IA', courses: 'Ciência da Computação, Estatística' },
    { title: 'Engenharias com foco em desenvolvimento e pesquisa', courses: 'Engenharia (várias)' },
    { title: 'Economia e pesquisa econômica', courses: 'Economia' },
    { title: 'Ciências ambientais e climáticas', courses: 'Ciências Ambientais, Geologia' },
    { title: 'Desenvolvimento de software', courses: 'Ciência da Computação, Engenharia de Software' },
    { title: 'Ciências sociais e pesquisa', courses: 'Ciências Sociais, Antropologia' },
  ],
  enterprising: [
    { title: 'Empreendedorismo e criação de negócios', courses: 'Administração, Empreendedorismo' },
    { title: 'Vendas e gestão comercial', courses: 'Administração, Gestão Comercial' },
    { title: 'Marketing e estratégia', courses: 'Marketing, Administração' },
    { title: 'Direito (advocacia, carreiras públicas e consultoria)', courses: 'Direito' },
    { title: 'Consultoria e gestão de projetos', courses: 'Administração, Engenharia de Produção' },
    { title: 'Comércio exterior e negócios internacionais', courses: 'Relações Internacionais, Comércio Exterior' },
    { title: 'Mercado financeiro e investimentos', courses: 'Economia, Administração' },
    { title: 'Liderança em saúde e gestão de negócios de saúde', courses: 'Administração Hospitalar' },
  ],
  practical: [
    { title: 'Engenharia civil e de campo', courses: 'Engenharia Civil' },
    { title: 'Engenharia mecânica, elétrica e mecatrônica', courses: 'Engenharias' },
    { title: 'Agronomia e produção agropecuária', courses: 'Agronomia, Zootecnia' },
    { title: 'Medicina veterinária', courses: 'Medicina Veterinária' },
    { title: 'Aviação e navegação', courses: 'Ciências Aeronáuticas, cursos técnicos' },
    { title: 'Eletrônica, automação e manutenção', courses: 'cursos técnicos e tecnológicos' },
    { title: 'Educação física e esportes', courses: 'Educação Física' },
    { title: 'Gastronomia e artes culinárias', courses: 'Gastronomia' },
  ],
}
