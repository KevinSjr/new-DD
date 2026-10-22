# PROGRESSO.md — Daydreaming

Registro das micro tarefas. Marque `[x]` só quando a tarefa estiver concluída e verificada.
Antes de cada tarefa, consultar `AGENTS.md` e `CLAUDE.md` (na raiz do projeto).

Última atualização: 2026-10-22

## Identidade visual — 2026-10-22

- A marca enviada pelo usuário foi adaptada em três peças com fundo transparente: versão principal para o rodapé, horizontal para o cabeçalho e ícone para favicon/atalho móvel. Os textos explicativos e a paleta da prancha de referência não fazem parte das imagens finais.
- O nome visível e os títulos das páginas passaram a usar “Daydreaming” em uma palavra. Os tokens da marca seguem as cores indicadas na prancha; os demais tokens da interface foram preservados.
- `npm run build` passou. `npm run lint` ainda aponta dois problemas anteriores, em `Trail.tsx` e `ScholarshipSearchPage.tsx`, fora da mudança de marca.

## Decisões duradouras

- Projeto novo em pasta separada do `dd5`/XAMPP.
- Stack: Vite + React + TypeScript, CSS próprio (tokens em `src/styles/tokens.css`).
- Sem bibliotecas extras até haver necessidade clara (ex.: roteador só quando houver a segunda página).
- Logo "Daydreaming" (nuvem azul, estrelas amarelas e trajetória branca) é o elemento de marca; versões principal, horizontal e ícone, sem mascote.
- Primeira entrega: somente a home.
- Dados de demonstração e funcionalidades planejadas devem ser identificados como tais na interface.
- Convenção visual: **contorno tracejado = ainda não existe / em desenvolvimento** (sempre acompanhado de texto, nunca só de cor).
- Etiquetas de conteúdo: Confirmado, Estimativa, Orientação geral, Demonstração (definidas na seção de confiança).
- Cores, espaços e fontes só em `tokens.css`; componentes não usam valores soltos.
- A lista de guias de países fica em `src/data/countries.ts` (só nomes e estado; dados do país exigem fonte e data de verificação).
- Nenhuma funcionalidade da home existe ainda (busca, ferramentas, conta, progresso). Os textos devem continuar dizendo isso até que existam.

## Estrutura de pastas

```
daydreaming/
├── AGENTS.md
├── CLAUDE.md
├── PROGRESSO.md
├── docs/                 decisões e notas do projeto
├── public/               favicon e arquivos estáticos
└── src/
    ├── assets/           logo e imagens
    ├── components/
    │   ├── layout/       Header, Footer
    │   ├── home/         seções da home
    │   └── ui/           Button, Logo
    ├── data/             conteúdo com fonte e data de verificação
    ├── hooks/
    ├── pages/
    ├── styles/           tokens.css, global.css
    └── types/
```

## Fase 0 — Preparação

- [x] 0.1 Node.js e projeto Vite + React + TS
- [x] 0.2 Estrutura de pastas e PROGRESSO.md
- [x] 0.3 Tokens de design
- [x] 0.4 Logo e favicon
- [ ] 0.5 Fonte Nunito hospedada localmente (ver pendências: não usar Google Fonts)

## Fase 1 — Home v2 (recomeço baseado na referência aprovada em 2026-10-17)

Decisões: manter a cara da referência (azul vivo, roxo-marinho, fonte Poppins, botões e cartões "táteis"); header da referência com a nossa logo; manter o rodapé da versão anterior; refazer só a trilha, mais curta e com animação conforme a pessoa rola a página.
A home anterior (v1) foi substituída. Os arquivos antigos das seções são removidos na tarefa 1.7.

- [x] 1.1 Base visual (tokens e fonte Poppins) e cabeçalho com a logo
- [x] 1.2 Topo da página: título, botões, ilustração e quatro cartões de funcionalidades
- [x] 1.3 Trilha compacta com animação ao rolar
- [x] 1.4 Ferramentas (as nove funcionalidades)
- [x] 1.5 Passaportes de países (links para os guias)
- [x] 1.6 Chamada final e rodapé (rodapé anterior, links atualizados e bloco "Como tratamos os dados", que os guias referenciam em `/#confianca`)
- [x] 1.7 Limpeza dos arquivos antigos da home (feita pelo Kevin; `Trust` e `Footer` mantidos)
- [ ] 1.8 Revisão: responsividade, acessibilidade, links e movimento reduzido (marcar depois de aplicar e rodar `npm run build` sem erros)

### Home v1 (substituída)

Tarefas 1.1 a 1.10 da primeira versão foram concluídas e depois substituídas por esta fase. As notas de verificação dessa versão continuam abaixo como histórico.

## Fase 2 — Guias de países

- [ ] 2.1 Template de página de país, com roteador próprio (marcar depois de aplicar e rodar `npm run build` sem erros)
- [x] 2.2 Página da Alemanha reformulada com o texto-base enviado, dez temas navegáveis, fontes oficiais e data de verificação para regras e valores
- [ ] 2.3 Índice de países
- [ ] 2.4 Demais países (uma tarefa por país)

## Fase 3 — Ferramentas

- [ ] 3.1 Calculadora de GPA
- [ ] 3.2 Teste vocacional
- [ ] 3.3 Descobridor de destinos
- [ ] 3.4 Buscador de bolsas
- [ ] 3.5 Rank de universidades (página e dados preparados; falta configurar a hospedagem e publicar)
- [ ] 3.6 Simulador prático e simulador de entrevista
- [ ] 3.7 Match de bolsas e universidades
- [ ] 3.8 Fórum

## Notas de verificação

### Preparo para publicação dos rankings — 2026-10-19

- O responsável pelo projeto confirmou a autorização para disponibilizar os dados QS. Os seis JSONs em `public/data/` deixaram de ser ignorados pelo Git e devem acompanhar o código-fonte no repositório.
- `npm run build` gera `dist/` e verifica se os seis rankings foram copiados sem alteração e com as edições e quantidades esperadas. `dist/` continua ignorada por ser artefato gerado; o deploy deve publicar seu conteúdo.
- Ainda não houve publicação externa. A hospedagem escolhida precisa servir `index.html` para as rotas internas; GitHub Pages em subpasta exige adaptação específica.

### Ciências Sociais e Administração — 2026-10-19

- O seletor de rankings e a home agora apontam para seis listas locais, incluindo `/rankings/ciencias-sociais-administracao`; as cinco áreas amplas QS by Subject 2026 estão disponíveis.
- A área usa os 550 registros da aba `Social Sciences & Management` da planilha QS by Subject 2026 versão 1.4 (`_18.xlsx`), incluindo 151 pontuações não exibidas e os pesos metodológicos da fonte.
- As 16 disciplinas aparecem em português com links para os rankings individuais na QS. O JSON da área foi incluído no conjunto publicável conforme a autorização posterior.

### Ciências Naturais — 2026-10-19

- O seletor de rankings e a home agora apontam para cinco listas locais, incluindo `/rankings/ciencias-naturais`.
- A área usa os 554 registros da aba `Natural Sciences` da planilha QS by Subject 2026 versão 1.4 (`_17.xlsx`), incluindo 152 pontuações não exibidas e os pesos metodológicos da fonte.
- As nove disciplinas aparecem em português com links para os rankings individuais na QS. O JSON da área foi incluído no conjunto publicável conforme a autorização posterior.

### Ciências da Vida e Medicina — 2026-10-19

- O seletor de rankings e a home agora apontam para quatro listas locais, incluindo `/rankings/ciencias-da-vida-medicina`.
- A nova área usa os 550 registros da aba `Life Sciences & Medicine` da planilha QS by Subject 2026 versão 1.4 (`_21.xlsx`), incluindo 149 pontuações não exibidas e seus pesos metodológicos próprios. O extrator compartilhado confere os registros contra a planilha.
- As nove disciplinas aparecem em português e apontam para os rankings individuais na QS. O JSON da área foi incluído no conjunto publicável conforme a autorização posterior.

### Engenharia e Tecnologia e tradução dos subjects — 2026-10-19

- A escolha em `/rankings` agora oferece três listas locais: universidades QS 2027, Artes e Humanidades QS 2026 e Engenharia e Tecnologia QS 2026. A rota da nova área é `/rankings/engenharia-tecnologia`.
- Os dados de Engenharia e Tecnologia vêm da aba homônima da planilha QS by Subject 2026 versão 1.4 (`_20.xlsx`): 556 instituições, das quais 154 não têm pontuação exibida. Extração e verificação registro a registro usam o script compartilhado `scripts/extract_qs_subjects_2026.py`. O JSON foi incluído no conjunto publicável conforme a autorização posterior.
- As 13 disciplinas de Artes e Humanidades e as oito de Engenharia e Tecnologia têm nomes em português e links para os rankings específicos no site oficial da QS; o site ainda não hospeda os dados de cada disciplina individualmente.

### Escolha de rankings e Artes e Humanidades — 2026-10-19

- O cartão Rankings da home e os links do cabeçalho e rodapé levam a `/rankings`, onde o usuário escolhe entre o ranking geral QS 2027 e a área Artes e Humanidades QS by Subject 2026. A rota antiga `/ranking` continua acessível.
- `/rankings/artes-humanidades` usa os 553 registros da aba `Arts & Humanities` da planilha QS by Subject 2026 versão 1.4 fornecida pelo usuário, incluindo 152 pontuações não exibidas. O JSON foi incluído no conjunto publicável conforme a autorização posterior. A página distingue o ranking da área das 13 disciplinas e aponta para os rankings oficiais de cada uma na QS.
- Extração conferida registro a registro com a planilha; build passou. Navegação da home à escolha e desta à página da área, carregamento dos 553 registros e filtro por nome foram testados no navegador local. Não foram testados leitor de tela real, Firefox ou Safari.

### Ranking de universidades — 2026-10-18

- A rota `/ranking` segue a estrutura útil da referência local `rank.php`: abertura, filtros, tabela, ordenação e paginação. Usa a identidade visual e os componentes compartilhados do projeto, sem copiar os dados fictícios ou as imagens da página antiga.
- Os primeiros 1.000 registros da planilha QS 2027 versão 1.3 ficam em `public/data/qs-world-university-rankings-2027-top1000.json`, agora incluído no conjunto publicável. A extração foi conferida registro a registro com a planilha: rank, nome, país/território, região e overall score. Há 300 pontuações não exibidas na fonte, mantidas como `null`. A planilha não informa cidade nem área de estudo.
- Busca por nome, filtros de país e região, ordenação, paginação e estado vazio foram testados no navegador. Build e lint direcionado passaram; sem rolagem horizontal da página a 360 px e sem erros no console. Comparar com correções da QS ao atualizar os dados; a publicação externa ainda não foi feita.

### Guia da Alemanha reformulado — 2026-10-18

- O conteúdo anterior de `src/data/guides/alemanha.ts` foi removido. A rota `/paises/alemanha` usa `GermanyGuidePage.tsx` e o conteúdo novo de `src/data/germanyGuide.ts`.
- O layout se inspira no modelo local `alemanha-daydreaming`: abertura ilustrada, informações rápidas, dez abas e indicador de exploração. O progresso das abas vale apenas durante a visita; não é salvo no navegador nem sincronizado.
- Custos, comprovação financeira, bolsas, idioma e trabalho foram conferidos em páginas oficiais do DAAD, Make it in Germany, universidades e portal federal, com data junto dos blocos. A população informada no texto-base não foi publicada porque não houve confirmação da referência temporal. Prazos genéricos e faixas salariais também não foram apresentados como dados atuais.
- `npm run build` e lint direcionado dos arquivos alterados passaram. No navegador, a página foi conferida em desktop e 360 px; sem rolagem horizontal no celular, um `h1`, dez abas funcionais, teclado com seta, indicador 10/10 ao abrir todas e sem erros no console. Leitor de tela real, Firefox e Safari não foram testados.

### Home v2, tarefa 1.8 (revisão final) — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild, com Layout, rodapé e `data/countries.ts` de teste; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- Sem rolagem horizontal em 320, 360, 414, 600, 768, 900, 1024, 1280, 1536 e 1920 px (com a lista de países aberta) e com texto a 200% (celular e desktop).
- Teclado: 21 paradas de Tab, na ordem visual (ir para o conteúdo, logo, menu, botões do topo, link de países nas ferramentas, passaportes, botão "Ver os outros", chamada final, rodapé), todas com contorno de foco visível. Nenhum link ou botão sem nome. Os três botões "(em breve)" usam `aria-disabled` e não fazem nada.
- Estrutura: um `h1`; títulos sem saltos; IDs únicos; `aria-labelledby` e `aria-controls` válidos; todos os links de âncora têm destino; marcos `header`, `nav` (menu e rodapé), `main` e `footer`.
- Movimento reduzido: 0 animações rodando (com movimento normal: 5). Nenhuma requisição externa e nenhum erro no console.
- Contraste de todo o texto visível, calculado a partir dos estilos reais: 0 falhas (o texto branco sobre o degradê da chamada final foi calculado à mão: ≥ 4,6:1).
- Alvos de toque: botões e cartões-link com 44 px ou mais; só links dentro de frases ficam menores.
- Correções desta revisão: coluna do painel da trilha e caixa da chamada final estouravam com fonte a 300%.
- Limite conhecido: a 300% de fonte em tela de 360 px a ponta da nuvem do passo da trilha ainda passa da largura (efeito decorativo; o requisito de 200% é atendido).

Pendente (não testado): leitor de tela real (NVDA/VoiceOver); Firefox e Safari; desempenho (ver o tamanho no `npm run build`); `index.html` (`lang="pt-BR"`, título, favicons); revisão jurídica do aviso de privacidade; guias dos 24 países sem página; guia da Malásia pausado; a ordem das âncoras move o olhar mas não o foco do teclado.

### Home v2, tarefa 1.7 — 2026-10-18

Revisão local: os 10 arquivos antigos de Journey, Discovery, Countries, Preparation e Gamification foram retirados dos diretórios ativos. Cinco recursos de imagem/SVG foram inicialmente retirados e depois restaurados quando houve dúvida sobre a marca. A logo ativa (`src/assets/logo.png`) permaneceu no projeto. Cópia recuperável dos 15 itens: `backup-unused-2026-10-18.tar.gz` na raiz (entradas verificadas).

O plano anterior previa mover os arquivos para `daydreaming_backup_home_v1`. A revisão local acima substituiu esse destino pelo arquivo compactado; as orientações originais abaixo ficam como histórico da tarefa.

- Mover (v1, não usados pela home v2): `Journey`, `Discovery`, `Countries`, `Preparation`, `Gamification` (cada um `.tsx` e `.css`) em `src/components/home`.
- Manter em `src/components/home`: `Hero`, `Perks`, `Trail`, `Tools`, `Passports`, `Final`, `Trust` (cada um `.tsx` e `.css`). `Hero` já foi sobrescrito pela versão v2.
- Manter em `src/data` e `src/types`: `countries.ts` e `country.ts` (usados por `Passports`, `Final` e pelos guias).
- Verificação: `npm run build` sem erros e a home abrindo com todas as seções. Se o build apontar um arquivo movido por engano, trazê-lo de volta da pasta de backup.
- Opcional: se a fonte Nunito (0.5) foi instalada, `npm uninstall @fontsource/nunito` (a v2 usa Poppins).

### Home v2, tarefa 1.6 — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild, com Layout e `data/countries.ts` de teste; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- Ordem da home: topo, cartões, trilha, ferramentas, países, "Como tratamos os dados" (`id="confianca"`, o bloco de confiança da v1 com novo rótulo), chamada final e rodapé. O aviso provisório "Em construção" foi removido.
- Chamada final "Pronto para decolar?": botão principal leva ao guia da Alemanha (via `COUNTRY_GUIDES`; se não estiver publicado, cai em `/#paises`); "Criar conta (em breve)" é botão desativado, tracejado, sem função.
- Rodapé: mesma aparência e mesmo aviso de privacidade; links agora `/#trilha`, `/#ferramentas`, `/#paises`, `/#confianca`, `/#privacidade`, que funcionam também a partir das páginas de país. "Voltar ao topo" rola até o topo.
- Todos os links de âncora da home têm destino; IDs únicos; um único `h1`. Sem rolagem horizontal de 320 a 1920 px e com texto a 200%. Contraste: 0 falhas reais (o teste automático marca texto branco sobre o degradê da chamada final por não ler degradês; calculado à mão: ≥ 4,6:1).
- Pendente: a `Footer.tsx` foi reconstruída a partir da versão 1.9 (não havia a cópia exata aplicada na 2.1); conferir se o seu `Footer.css` continua servindo. O aviso de privacidade segue provisório (revisão jurídica, e-mail de contato e responsável pelos dados).

### Home v2, tarefa 1.5 — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild, com `data/countries.ts` de teste; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- 25 bilhetes, na ordem pedida (Estados Unidos, Reino Unido, Canadá, Austrália, Alemanha, França, Japão, China, Coreia do Sul, Espanha, Países Baixos (Holanda), Itália, Portugal, Irlanda, Suíça, Suécia, Finlândia, Dinamarca, Bélgica, Noruega, Taiwan, Hong Kong, Singapura, Malásia, Nova Zelândia). Aparecem 6 de início e o botão "Ver os outros 19 destinos" mostra o resto (`aria-expanded`, o foco fica no botão, que vira "Mostrar menos"). Em 1, 2 ou 3 colunas; `id="paises"` ligado ao menu e ao cartão "Guia de países".
- Só a Alemanha é link (`/paises/alemanha`), decidido por `COUNTRY_GUIDES` (`status === 'available'` e `href`); os outros dizem "Guia em preparação" (contorno tracejado) e não clicam. Malásia aparece só como "em preparação" (o guia segue pausado).
- Idioma e clima só aparecem para a Alemanha (do guia publicado); nada de dado não verificado para os outros.
- Sem rolagem horizontal de 320 a 1920 px (com a lista aberta e fechada) e com texto a 200%. Contraste de 114 textos visíveis: 0 falhas. IDs únicos.
- Correções: canhoto do bilhete que estourava a 200% (agora encolhe) e texto do painel da trilha ("Trilha completa") que estourava a 200%.
- Pendente: confirmar no seu `data/countries.ts` que o campo é `slug` e que o país publicado tem `status: 'available'` e `href`; as siglas de aeroporto são só detalhe visual; "Nova Zelândia?" foi incluída (vinha com interrogação); 25 slugs novos ainda não existem como guias. O aviso "Em construção" sai na 1.6.

### Home v2, tarefa 1.4 — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- Nove cartões em grade (1, 2 ou 3 colunas), `id="ferramentas"` ligado ao menu. Oito trazem "Em breve" (contorno tracejado + texto) e não são clicáveis. "Guia de países" é o único link (`/#paises`) e diz "Só a Alemanha por enquanto".
- Sem rolagem horizontal de 320 a 1920 px e com texto a 200%. Contraste de 83 textos visíveis: 0 falhas. Foco por teclado visível no cartão-link. IDs únicos.
- Ajuste na trilha: a linha colorida não aparece mais como um ponto antes de o passo ser concluído.
- Pendente: o aviso "Em construção" sai na 1.5 (países).

### Home v2, tarefa 1.3 — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- Trilha curta: 5 passos em 3 etapas (sem listar as nove ferramentas, sem metas, ligas, XP ou nomes fictícios). Rolando a página, os passos passam de bloqueado para atual e concluído, a linha pontilhada se colore e o painel mostra "Etapa X de 5" até "Trilha completa". Conferido em 390 e 1280 px, do topo até o fim da página.
- Sem rolagem horizontal de 320 a 1920 px e com texto a 200% (celular e desktop). Corrigidos: painel que estourava a 200% e um vai e vem do estado no fim da página (o texto final mudava a altura da página; agora a altura é reservada).
- Contraste de 54 textos visíveis: 0 falhas. Nenhum alvo de toque abaixo de 44 px.
- Movimento reduzido: sem pulo da nuvem nem transição da linha; o estado ainda muda (a informação não depende da animação). O estado de cada passo também existe como texto para leitores de tela.
- Honestidade: legenda "Demonstração" visível; os passos não são botões nem abrem ferramenta; nada é salvo. A etiqueta do cartão "Trilha por etapas" passou a "Demonstração".
- Pendente: não testado com leitor de tela real nem em Firefox/Safari. O aviso "Em construção" sai quando ferramentas e países chegarem (1.4 e 1.5).

### Home v2, tarefa 1.2 — 2026-10-18

Verificado em Chromium de teste (código empacotado com esbuild, com roteador e Layout simplificados; **não** foi um projeto Vite completo; `tsc` só com tipos simplificados do React):

- Sem rolagem horizontal em 320, 360, 414, 600, 768, 900, 1024, 1280, 1536 e 1920 px, e com texto a 200% (celular e desktop). Um estouro do selo "Meta do dia" a 200% foi encontrado e corrigido.
- Contraste de 31 textos visíveis, calculado a partir dos estilos reais: 0 falhas.
- Poppins 500 e 700 carregadas; foco visível (contorno de 3 px) em todas as paradas de Tab testadas; nenhuma requisição externa.
- Movimento reduzido: nuvens, rota e selo deixam de animar.
- Alvos de toque: botões pequenos do cabeçalho passaram de 42 para 44 px.
- Honestidade: a ilustração e os três selos são exemplos, com legenda visível; "Já tenho conta" é botão desativado "(em breve)"; os quatro cartões trazem "Em breve". A etiqueta da trilha muda para "Demonstração" na 1.3.
- Pendente: o aviso "Em construção" no fim da página é provisório (sai na 1.3).

### Home v2, tarefa 1.1 — 2026-10-17

Verificado em Chromium de teste (código empacotado com esbuild; fontes da referência embutidas só no teste):

- Cabeçalho: logo, Trilha, Ferramentas, Países, "Entrar (em breve)" e "Começar"; altura de 74 px; ordem de tabulação correta com foco visível (3 px) em todos.
- "Entrar" é um botão `aria-disabled` com contorno tracejado e texto "em breve": não faz nada. "Começar" leva a `/#trilha`.
- Celular: menu abre e fecha, Esc devolve o foco ao botão, o menu fecha ao navegar; links e botões ficam dentro do painel.
- A partir de um guia de país, os links do cabeçalho levam à seção da home. Sem rolagem horizontal de 320 a 1920 px, nem com texto a 200%; 0 falhas de contraste nos textos medidos (cabeçalho, conteúdo e rodapé); nenhuma requisição externa.
- Checagem de tipos passou com o arquivo de tipos simplificado do React (sem `@types/react` no sandbox).
- Rodapé antigo mantido sem alterações; seus links "Como funciona/Bolsas/Preparação/Confiança" ainda apontam para as âncoras antigas até a tarefa 1.6.


### Revisão da home (1.10) — 2026-10-17

Verificado em Chromium de teste (código empacotado com esbuild; **não** foi um projeto Vite completo):

- Sem rolagem horizontal em 320, 360, 414, 600, 768, 900, 1024, 1280, 1536 e 1920 px.
- Fonte ampliada para 200% sem estourar a largura (celular e desktop).
- Contraste de todo o texto visível, calculado a partir dos estilos reais: 0 falhas (celular e desktop).
- 20 links `#...` com destino; `id` únicos; `aria-labelledby` e `aria-controls` válidos; um único `h1`; títulos sem saltos.
- Tabulação por teclado: 20 paradas, todas com contorno de foco visível; menu do celular abre e fecha com Esc.
- Alvos de toque: nenhum link ou botão com menos de 44 px de altura.
- Movimento reduzido: rolagem suave desativada.
- Nenhuma requisição externa; nenhum valor monetário, prazo ou dado de instituição no texto.

Correções feitas na revisão: coluna do hero que estourava com texto ampliado, quebra de palavras longas, moldura em volta da página ao usar "Ir para o conteúdo", e painel de demonstração fixo que não cabia em telas baixas.

### Template de país e guia da Alemanha (2.1) — 2026-10-17

Verificado em Chromium de teste (código empacotado com esbuild, servidor local com fallback para `index.html`):

- Rotas: `/`, `/paises/alemanha` (com e sem barra no fim), `/paises/inexistente`, `/paises` e `/qualquer-coisa` (as três últimas mostram a página 404).
- Navegação sem recarregar a página; botões voltar e avançar; título da aba muda por página; foco vai para o conteúdo principal.
- Links do cabeçalho, do rodapé, da trilha e do índice levam à seção certa, abaixo do cabeçalho fixo (celular e desktop). Menu do celular fecha ao navegar.
- Guia da Alemanha: um único `h1`, títulos sem saltos, `id` únicos, 12 itens no índice com destino, 19 links externos com `https`, `rel="noopener noreferrer"` e aviso "abre em nova aba".
- Sem rolagem horizontal de 320 a 1920 px, nem com texto a 200%, nem com espaçamento de texto ampliado; contraste: 0 falhas em 409 textos.
- Teste com conteúdo de mentira (só no ambiente de testes): informação sem fonte, com `http`, com `javascript:`, com data inválida ou impossível (ex.: 31/02) é ignorada; dado verificado há mais de 180 dias ganha aviso; HTML no texto não é interpretado; guia sem conteúdo mostra "Sem informações verificadas" em todos os temas.
- Checagem de tipos do TypeScript passou, mas usando um arquivo de tipos simplificado do React (o pacote `@types/react` não existe no ambiente de testes). **Ainda falta `npm run build` no seu computador.**

Conferido em fontes oficiais em 2026-10-17 (entram como "Confirmado" ou "Estimativa" no guia): mensalidades e exceções de Baden-Württemberg e Baviera, gasto mensal de referência, contribuição semestral e comprovação de € 992 por mês (DAAD); 140 dias ou 280 meios-dias de trabalho por ano (Make it in Germany); 18 meses para procurar emprego após a formatura (Make it in Germany); € 300 por mês do Deutschlandstipendium (página da Hochschule Anhalt, não do ministério).

Próxima revisão das informações: até **2027-04-15** (180 dias; depois disso a página mostra aviso de "verificado há mais de 6 meses").

## Pendências conhecidas

- **Rodar no computador:** `npm run build` e, se existir, `npm run lint`. No ambiente de testes a checagem de tipos só rodou com um arquivo de tipos simplificado do React.
- **Conferir `index.html`:** `lang="pt-BR"`, `<title>Day Dreaming</title>` e os links dos favicons (não conferido).
- **Fonte:** a home v2 usa Poppins (pesos 500 e 700) pelo pacote `@fontsource/poppins`, hospedada junto com o site. Rodar `npm install @fontsource/poppins`. Não usar Google Fonts (envia o IP do visitante ao Google e contradiz o aviso de privacidade).
- **Privacidade:** o aviso do rodapé é provisório. Pedir revisão jurídica antes de publicar e atualizá-lo antes de qualquer coleta (conta, formulário, análise de uso). Definir e-mail de contato e responsável pelos dados.
- **Canal de erros:** não existe forma de o usuário avisar sobre informação desatualizada.
- **Gamificação:** as regras descritas (vidas que recarregam e podem ser desativadas, ligas opcionais, metas sem punição) são propostas a confirmar.
- **Servidor precisa de fallback:** com o roteador próprio, `/paises/alemanha` só abre se o servidor devolver `index.html` para qualquer endereço. O Vite (`npm run dev` e `npm run preview`) já faz isso. Em hospedagem (Apache/XAMPP, Nginx, etc.) é preciso configurar a regra de reescrita antes de publicar. O site não funciona abrindo o `index.html` direto do disco, nem em subpasta sem ajustar.
- **Guia da Alemanha (versão inicial):** o texto-base foi adaptado; só virou "Confirmado" ou "Estimativa" o que foi conferido em fonte oficial. Não publicados por falta de confirmação: população (a Destatis mostra 83,3 milhões sem data de referência; o texto-base dizia 83,5 milhões no fim de 2025), banco de bolsas e busca de cursos do DAAD (os links não carregaram na consulta), tipos de visto e lista de documentos, número de brasileiros, prazos e salários.
- **Fontes mais fracas no guia:** o valor do Deutschlandstipendium vem da página de uma universidade e a regra de "bolsa conta como comprovação" vem da página de outra. Trocar por páginas oficiais do governo federal e do consulado quando possível. A faixa de € 900 a € 1.200 do DAAD não informa o ano.
- **Checklist do candidato** do guia da Alemanha é uma lista estática. Virar checklist interativo é parte da fase 3 (exige decidir onde guardar o progresso e a política de privacidade).
- **Guias de países:** só a Alemanha existe. Os demais países ainda não foram escolhidos (tarefas 2.3 e 2.4).
- **Acessibilidade ainda não testada:** leitor de tela (NVDA/VoiceOver) e navegadores Firefox e Safari. Links de âncora levam o olhar à seção, mas não movem o foco do teclado para ela.
- **Desempenho:** não medido. Conferir o tamanho final no `npm run build`.
