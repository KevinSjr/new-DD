# Daydreaming.

Plataforma em desenvolvimento para estudantes brasileiros explorarem oportunidades de estudo no exterior. Este projeto usa React, TypeScript e Vite.

## Executar e preparar a publicação

```bash
npm ci
npm run dev
npm run build
```

`npm run build` gera a pasta `dist/` e verifica se os seis arquivos de rankings estão presentes, completos e atualizados em `dist/data/`. Se algum dado estiver faltando, o build falha em vez de gerar um site com rankings quebrados. Para conferir o build localmente, execute `npm run preview`.

Os arquivos-fonte do site, `package.json`, `package-lock.json` e os seis JSONs em `public/data/` devem entrar no repositório. `node_modules/` e `dist/` são gerados e continuam ignorados pelo Git. O Vite copia os JSONs de `public/data/` para `dist/data/` durante o build. O arquivo `backup-unused-2026-10-18.tar.gz` não faz parte do site.

Para hospedar como site estático, publique **o conteúdo de `dist/`** na raiz do site. A hospedagem precisa devolver `index.html` para rotas como `/rankings` e `/paises/alemanha`; sem essa regra, links diretos e recargas nessas páginas dão erro 404. Publicar o código em um repositório GitHub, por si só, não coloca o site no ar. GitHub Pages em uma subpasta de projeto também exige configuração de caminho-base e roteamento, ainda não incluída aqui; confirme a hospedagem escolhida antes do deploy.

## Banco e administração de bolsas

O primeiro módulo de CRUD usa PostgreSQL e uma API Node no mesmo projeto. Não há bolsas fictícias pré-carregadas. A migração `db/migrations/001_scholarships.sql` cria países, bolsas e a relação entre eles; novas migrações devem receber um novo número, sem editar as já aplicadas. A exclusão no painel é recuperável. Apenas registros `published` não removidos aparecem em `GET /api/scholarships`.

1. Crie um banco PostgreSQL vazio e copie `.env.example` para `.env.local`, preenchendo `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` e `ADMIN_USERNAME`. Esse arquivo é ignorado pelo Git; não compartilhe a senha em mensagens ou commits.
2. Execute `npm run admin:hash` e copie a linha gerada para `ADMIN_PASSWORD_HASH` no `.env.local`. Use senha longa; não coloque a senha em texto puro no repositório.
3. Execute `npm run db:migrate`.
4. Em terminais separados, execute `npm run api:dev` e `npm run dev`. Abra `/admin/bolsas` para administrar.

O painel mantém as credenciais apenas na memória da aba; recarregar exige novo login. Em produção, use HTTPS, defina `NODE_ENV=production`, `PUBLIC_ORIGIN=https://seu-dominio`, `DATABASE_URL` e as variáveis de administrador no ambiente do servidor; faça `npm run build` e inicie com `npm run api:start`. O servidor Node entrega `dist/` e `/api` na mesma origem. **Hospedagem puramente estática/GitHub Pages não executa o CRUD.** Uma conta administrativa única é adequada só para esta primeira versão; múltiplos editores exigirão autenticação e papéis próprios antes de sua implementação.

### Ver o buscador de bolsas no navegador

Com o PostgreSQL local ativo e `.env.local` configurado, abra **dois terminais** na pasta do projeto. No primeiro execute `npm run api:dev`; no segundo, `npm run dev`. Depois abra [http://127.0.0.1:5173/bolsas](http://127.0.0.1:5173/bolsas) ou clique em “Buscador de bolsas” na home. Mantenha os dois terminais abertos enquanto usa a página. A API usa a porta 3001 e o Vite a 5173; se o Vite mostrar outra porta, use a URL exibida no terminal. O buscador público funciona mesmo antes de configurar a senha do painel administrativo; o painel `/admin/bolsas` só funciona após gerar `ADMIN_PASSWORD_HASH`.

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
