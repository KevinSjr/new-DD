# API para a primeira versão do aplicativo

O app usa a API Node e o PostgreSQL existentes. Em produção, configure `NODE_ENV=production`, `PUBLIC_ORIGIN` com HTTPS e publique o servidor de API em um endereço HTTPS acessível pelo celular. `127.0.0.1` funciona somente no próprio computador; o app em um aparelho precisa do endereço do servidor.

## Sessão móvel

Em requisições nativas, envie `X-Daydreaming-Client: mobile` e não envie `Origin`. `POST /api/account/register` e `POST /api/account/login` retornam `sessionToken` e `expiresInDays` junto ao usuário, sem `Set-Cookie`. Guarde o token no armazenamento seguro do sistema (Keychain no iOS ou Keystore no Android), nunca em código, logs ou armazenamento simples. Para rotas da conta, envie também `Authorization: Bearer <sessionToken>`. O servidor guarda apenas o hash do token e expira a sessão em 30 dias.

`POST /api/account/logout` revoga o token. `POST /api/account/password` troca a senha, revoga as sessões anteriores e retorna um novo token móvel. O app deve substituí-lo imediatamente. Uma resposta 401 exige novo login. O site continua usando cookie `HttpOnly`.

## Rotas do primeiro lançamento

| Função | Rotas existentes |
| --- | --- |
| Conta e perfil | `GET /api/account/me`, `POST /api/account/register`, `POST /api/account/login`, `POST /api/account/logout`, `PUT /api/account/profile` |
| Países | `GET /api/countries`, `GET /api/account/destinations` |
| Bolsas | `GET /api/scholarship-catalog`, `GET/POST/DELETE /api/account/saved-scholarships` |
| Jornada | `GET /api/account/journey`, `PUT/DELETE /api/account/journey/tasks/:key`, `POST/PUT/DELETE /api/account/journey/deadlines/:id` |
| Documentos | `GET/POST /api/account/documents`, `GET /api/account/documents/:id/download`, `DELETE /api/account/documents/:id` |
| Progresso | `GET /api/account/missions` |
| Busca de bolsas | `GET /api/scholarship-catalog` com `country`, `level`, `area`, `deadline`, `criteria`, `q` e `page` |
| Catálogo e simulados | SAT: `GET /api/sat/exam`, `POST /api/sat/exam/grade`; MEXT: `GET /api/mext/exam`, `POST /api/mext/exam/grade` |
| Desafios diários | `GET /api/sat/daily`, `POST /api/sat/daily/answer`, `GET /api/mext/daily`, `POST /api/mext/daily/answer` |

O upload de documentos envia os bytes do arquivo no corpo, com `Content-Type`, `X-Document-Name` e `X-Document-Category`. O limite atual é 5 MB por arquivo e 20 arquivos por conta.

SAT e MEXT usam as mesmas questões do PostgreSQL que o site. As imagens são servidas pela API em `/sat-assets/` e `/mext-assets/`. Em requisições nativas, o GET do desafio devolve `dailyToken`; o app guarda esse identificador no armazenamento seguro e o envia em `X-Daydreaming-Daily-Token` nas próximas requisições do desafio. É independente do token da conta. O desafio pode ser feito sem login; para registrar XP, a pessoa precisa entrar na conta e usar a prova de conclusão retornada ao terminar.

Para testar num celular na mesma rede, a API precisa escutar na rede local (`API_HOST=0.0.0.0` em `.env.local`) e a porta 3001 precisa estar acessível. O app usa o endereço do Metro com a porta 3001 por padrão; `EXPO_PUBLIC_API_URL` pode apontar para outra origem. Reinicie a API após alterar o servidor.

Os seis rankings QS são incluídos no pacote do app a partir dos mesmos arquivos versionados usados pelo site. `npm run sync:rankings` atualiza a cópia; o script também roda antes do Expo iniciar e durante a exportação Android. Os filtros do buscador consultam a API e não filtram apenas os 12 itens da página atual.

## Guias de países

O app inclui os 25 guias de países do site, cada um com uma ilustração própria no cartão e no cabeçalho. Os dados são sincronizados com os arquivos de conteúdo do site por `npm run sync:guides`; cada tema mantém textos, fontes e datas da página web. Os guias funcionam sem API; o buscador de bolsas continua dependendo do PostgreSQL e da API.

## Perfil móvel

Em **Perfil → Editar meu perfil**, as abas **Pessoais**, **Acadêmicos** e **Metas** usam `GET /api/account/me` e `PUT /api/account/profile`. O formulário guarda os mesmos campos do site: nome, escola, localização, idiomas, notas, exames, nível, área, até três destinos e ano planejado. Os dados são atualizados na sessão móvel após salvar e podem ser vistos no site com a mesma conta. A calculadora mantém separadamente as três estimativas de GPA salvas.

Em **Perfil → Meu avatar**, o app oferece oito personagens ilustrados, roupas e acessórios em imagens 3D e bandeiras dos 25 países dos guias mais Brasil como fundo. A opção de tom de pele foi removida. `PUT /api/account/avatar` valida e salva a escolha no PostgreSQL; `GET /api/account/me` devolve `avatar` ou `null`. As migrações `056_user_avatars.sql` e `057_avatar_flag_backgrounds.sql` criam os campos e ajustam os fundos anteriores. O primeiro salvamento concede 50 XP; os seguintes não repetem o bônus. O editor e o retrato estão disponíveis no app móvel nesta etapa.

## Ligas semanais de SAT e MEXT

O SAT tem ligas distintas para Leitura e Escrita e para Matemática; o MEXT mantém uma liga própria. A participação é opcional em **Início → Ligas semanais**, com um apelido aleatório que não expõe nome ou e-mail. `GET /api/account/leagues/:source` mostra a semana, a liga, o ranking dos dez primeiros e a posição do usuário; `POST` inscreve e `DELETE` sai da liga e remove seus pontos. `source` aceita `sat-reading-writing`, `sat-math` ou `mext`. A migração `055_weekly_exam_leagues.sql` cria as tabelas; `059_sat_leagues_by_area.sql` abre as duas ligas SAT, inscreve nelas os membros da antiga liga geral e recupera resultados por área enquanto os registros originais dos desafios ainda existirem. Registros antigos sem a tentativa original permanecem preservados no banco, mas não são atribuídos a uma área sem evidência.

Os pontos são registrados apenas após a validação de um desafio concluído em `POST /api/account/missions/claim`: 10 por acerto, sem bônus pela conclusão. Em cada liga SAT, entram os acertos da respectiva área em cada um dos sete dias da semana; Leitura e Escrita e Matemática não compartilham pontos nem ranking. No MEXT vale o melhor desafio do dia; entre desafios com a mesma pontuação, fica o que perdeu menos vidas. No ranking, o desempate usa menos vidas perdidas nos desafios contabilizados, depois mais dias de prática e, por fim, o apelido. A semana vai de segunda a domingo no horário de São Paulo. A liga da semana atual depende da pontuação da semana anterior: Bronze abaixo de 140, Prata de 140 a 279, Ouro a partir de 280. Ao atingir Prata ou Ouro, o usuário recebe automaticamente, uma única vez por semana concluída, um bônus de 20 ou 40 XP, respectivamente. O bônus também é concedido se a pessoa voltar ao app após uma ausência. Os números do ranking vêm do banco; não há gemas, avatares exclusivos ou prêmios materiais. A migração `058_league_accuracy_and_lives.sql` recalcula os pontos já registrados; XP concedido antes da mudança não é revogado.

## Verificação

Com PostgreSQL e API ativos, defina `ACCOUNT_API_URL` com a origem da API e execute `node tests/mobile-account.test.mjs`. O teste cria uma conta temporária, acessa as rotas protegidas com Bearer, revoga a sessão e exclui a conta de teste.

Para verificar os exames, execute `node tests/mobile-exams-smoke.mjs` com a API atual na porta 3002, ou defina `EXAM_API_URL` para outra origem. O teste abre as provas e imagens e responde uma questão anônima de cada desafio diário.

Para verificar os cinco filtros de bolsas na API, execute `node tests/mobile-scholarship-filters-smoke.mjs` com a API na porta 3002, ou defina `EXAM_API_URL` para outra origem.
