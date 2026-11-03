# Daydreaming.

Plataforma em desenvolvimento para estudantes brasileiros explorarem oportunidades de estudo no exterior. Este projeto usa React, TypeScript e Vite.

## Executar e preparar a publicação

```bash
npm ci
npm run db:migrate
npm run dev
npm run build
```

Configure `.env.local` a partir de `.env.example` antes de iniciar. `npm run dev` inicia a API Node e o Vite no mesmo terminal; o PostgreSQL precisa estar ativo.

`npm run build` gera a pasta `dist/` e verifica se os seis arquivos de rankings estão presentes, completos e atualizados em `dist/data/`. Se algum dado estiver faltando, o build falha em vez de gerar um site com rankings quebrados. Para conferir o build localmente, execute `npm run preview`.

Os arquivos-fonte do site, `package.json`, `package-lock.json` e os seis JSONs em `public/data/` devem entrar no repositório. `node_modules/` e `dist/` são gerados e continuam ignorados pelo Git. O Vite copia os JSONs de `public/data/` para `dist/data/` durante o build. O arquivo `backup-unused-2026-10-18.tar.gz` não faz parte do site.

Para hospedar como site estático, publique **o conteúdo de `dist/`** na raiz do site. A hospedagem precisa devolver `index.html` para rotas como `/rankings` e `/paises/alemanha`; sem essa regra, links diretos e recargas nessas páginas dão erro 404. Publicar o código em um repositório GitHub, por si só, não coloca o site no ar. GitHub Pages em uma subpasta de projeto também exige configuração de caminho-base e roteamento, ainda não incluída aqui; confirme a hospedagem escolhida antes do deploy.

## Banco e administração de bolsas

O primeiro módulo de CRUD usa PostgreSQL e uma API Node no mesmo projeto. Não há bolsas fictícias pré-carregadas. A migração `db/migrations/001_scholarships.sql` cria países, bolsas e a relação entre eles; novas migrações devem receber um novo número, sem editar as já aplicadas. A exclusão no painel é recuperável. Apenas registros `published` não removidos aparecem em `GET /api/scholarships`.

1. Crie um banco PostgreSQL vazio e copie `.env.example` para `.env.local`, preenchendo `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` e `ADMIN_USERNAME`. Esse arquivo é ignorado pelo Git; não compartilhe a senha em mensagens ou commits.
2. Execute `npm run admin:hash` e copie a linha gerada para `ADMIN_PASSWORD_HASH` no `.env.local`. Use senha longa; não coloque a senha em texto puro no repositório.
3. Execute `npm run db:migrate`.
4. Execute `npm run dev` e abra `/admin/bolsas` para administrar.

O painel mantém as credenciais apenas na memória da aba; recarregar exige novo login. Em produção, use HTTPS, defina `NODE_ENV=production`, `PUBLIC_ORIGIN=https://seu-dominio`, `DATABASE_URL` e as variáveis de administrador no ambiente do servidor; faça `npm run build` e inicie com `npm run api:start`. O servidor Node entrega `dist/` e `/api` na mesma origem. **Hospedagem puramente estática/GitHub Pages não executa o CRUD.** Uma conta administrativa única é adequada só para esta primeira versão; múltiplos editores exigirão autenticação e papéis próprios antes de sua implementação.

## Contas e perfis de estudantes

A migração `046_user_accounts.sql` cria contas, perfis e sessões. O cadastro fica em `/conta` e usa a mesma API Node e o mesmo PostgreSQL do buscador. Cada pessoa pode entrar, editar nome e preferências (nível, área e destino), trocar a senha, sair e excluir a própria conta. As senhas usam scrypt com salt individual; a sessão usa um token aleatório cujo hash é guardado no banco e um cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção. Sessões expiram em 30 dias. O painel administrativo continua separado das contas de estudantes.

Para ativar localmente, execute `npm run db:migrate` e `npm run dev`. Abra `/conta` no endereço do Vite. Execute `npm run test:account` para verificar hash e validações. Não há recuperação de senha por e-mail nem verificação de endereço nesta versão. As preferências ficam no perfil; o usuário aplica os filtros do buscador de bolsas manualmente. As respostas dos exames completos não são vinculadas à conta; desafios diários concluídos podem registrar missões na conta. Antes de abrir o cadastro ao público, publique uma política de privacidade completa com responsável, contato e prazos de retenção.

A aba **Documentos** em `/conta?tab=documentos` permite guardar, baixar e excluir arquivos PDF, DOCX, PNG e JPG de até 5 MB cada (máximo de 20 por conta). A migração `052_user_documents.sql` guarda os arquivos no PostgreSQL, vinculados ao usuário; somente a sessão do proprietário pode listá-los ou baixá-los, e a exclusão da conta apaga os registros. Faça backups seguros do PostgreSQL antes de usar o recurso com dados reais. O teste de integração pode ser executado com a API local ativa: `ACCOUNT_API_URL=http://127.0.0.1:3001 npm run test:documents` (ajuste a sintaxe da variável no PowerShell). Esta versão não verifica vírus, não envia documentos a universidades e não acompanha cartas confidenciais enviadas por recomendantes.

Usuários autenticados podem usar **Salvar bolsa** em `/bolsas` e consultar ou remover suas escolhas em `/conta?tab=bolsas`. A migração `053_user_saved_scholarships.sql` vincula cada bolsa à conta pela fonte e pelo ID do catálogo. A lista mostra os dados atuais do catálogo quando disponíveis; se um registro sair do catálogo, mantém o título e o link original com um aviso. Salvar não confirma inscrições abertas nem elegibilidade. Para testar a API com ela em execução, defina `ACCOUNT_API_URL` para a origem local e execute `node tests/saved-scholarships.test.mjs`.

### Conquistas

A aba **Progresso e gamificação** em `/conta?tab=progresso` mostra conquistas por atividade, progresso e XP. A migração `054_user_achievement_events.sql` guarda eventos da conta sem respostas de testes e permite associar uma bolsa salva a um prazo da jornada. Cada conquista é concedida uma vez; repetir o mesmo evento não duplica XP. As respostas e relatórios completos de SAT/MEXT não são salvos na coleção, mas as faixas de pontuação das duas áreas do SAT são registradas para verificar evolução entre exames. “Vida no destino” e “Da ideia ao curso” ficam identificadas como indisponíveis enquanto as seções ou links necessários não existirem. Com a API local ativa, execute `node tests/achievements.test.mjs` com `ACCOUNT_API_URL` configurada.

### Ver o buscador de bolsas no navegador

Com o PostgreSQL local ativo e `.env.local` configurado, execute `npm run dev`. Depois abra [http://127.0.0.1:5173/bolsas](http://127.0.0.1:5173/bolsas) ou clique em “Buscador de bolsas” na home. Mantenha o terminal aberto enquanto usa a página. A API usa a porta 3001 e o Vite a 5173; se o Vite mostrar outra porta, use a URL exibida no terminal. O buscador público funciona mesmo antes de configurar a senha do painel administrativo; o painel `/admin/bolsas` só funciona após gerar `ADMIN_PASSWORD_HASH`.

O buscador tem duas visões: bolsas verificadas e publicadas (somente tabela `scholarships`) e registros do IEFA em análise (tabela `scholarship_imports`). A segunda visão permite pesquisar e paginar os dados coletados, mas não os apresenta como editais abertos. A busca depende da API Node e do PostgreSQL; abrir apenas o Vite ou publicar apenas `dist/` em hospedagem estática resultará em erro de carregamento.

### Coleta IEFA — filtro Brasil (19/10/2026)

O arquivo `data/imports/iefa-brazil-2026-10-19.json` contém **1.203 registros únicos** obtidos das três páginas do [filtro Brazil do IEFA](https://www.iefa.org/scholarships?AwardSearch%5Bdetails%5D=33). A coleta registra apenas informações da listagem e a data/hora de acesso; não valida a vigência dos editais, a candidatura de brasileiros em todos os casos nem os requisitos finais. A listagem contém oportunidades antigas. Portanto, os registros são importados para `scholarship_imports` com estado `pending`, não para o catálogo público `scholarships`.

Após configurar o banco e executar as migrações, importe sem criar duplicatas:

```bash
npm run db:migrate
npm run data:import-iefa -- data/imports/iefa-brazil-2026-10-19.json
npm run data:verify-iefa
```

Para uma nova coleta, execute `python scripts/scrape_iefa.py data/imports/iefa-brazil-AAAA-MM-DD.json`, usando a data real no nome. Antes de promover qualquer registro ao catálogo, confira o edital e o link oficial da organização, ano, prazo e elegibilidade. A fonte IEFA é um índice de descoberta, não substitui o edital.

## Rankings e fontes

- Ranking geral QS World University Rankings 2027: primeiras 1.000 instituições da planilha fornecida.
- Cinco rankings de áreas amplas QS World University Rankings by Subject 2026: Artes e Humanidades, Engenharia e Tecnologia, Ciências da Vida e Medicina, Ciências Naturais, e Ciências Sociais e Administração.

Cada página informa a edição, a fonte, a metodologia e as limitações. As disciplinas listadas dentro das áreas apontam para os rankings específicos no site da QS; os dados dessas disciplinas individuais não são hospedados aqui. Veja [data/README.md](data/README.md) para os arquivos, a extração e a atribuição dos dados.
