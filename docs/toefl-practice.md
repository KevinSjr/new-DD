# Exame 1 — simulado original no formato TOEFL iBT

Rota do site: `/exames/toefl`. O catálogo em `/exames` contém o link de entrada. As 120 tarefas atuais pertencem ao **Exame 1**; futuros simulados serão identificados como exames separados.

Desafios diários: `/exames/toefl/desafio-diario`. Eles usam tarefas do Exame 1. Há quatro desafios independentes por dia, um para cada habilidade, com cinco tarefas cada. Reading e Listening usam três sóis; Writing e Speaking não usam vidas porque as respostas abertas não são corrigidas automaticamente. A seleção é determinística pelo dia no horário de Brasília. O estado de cada habilidade fica em `localStorage` e reinicia no dia seguinte; não é sincronizado com a conta e não concede XP. Áudio gravado permanece apenas na memória da aba.

O Exame 1 foi escrito para o Daydreaming e usa a estrutura divulgada pela [ETS para o TOEFL iBT atualizado](https://www.ets.org/toefl/test-takers/ibt/about/content.html), consultada em 09/11/2026: Reading (50 itens), Listening (47), Writing (12) e Speaking (11), nessa ordem. Os tempos de prática são 30, 29, 23 e 8 minutos. Todos os tipos de tarefa dessas quatro seções aparecem no banco local de conteúdo em `src/data/toeflPractice.ts`.

Esta implementação **não é um teste oficial**, não usa questões nem áudios da ETS e não reproduz a adaptação de dificuldade do exame. Reading e Listening usam múltipla escolha; as frases montadas de Writing recebem correção literal normalizada. Textos livres e respostas faladas não recebem nota automática. O relatório apresenta acertos e tarefas praticadas, sem atribuir a [escala oficial de 1 a 6](https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.htm.html).

Listening usa a voz sintética do navegador e oferece transcrição. Speaking pode gravar e reproduzir a voz localmente quando o navegador permite microfone; a gravação não é enviada ao servidor. Respostas e cronômetro são mantidos em `sessionStorage` nesta aba. As gravações ficam só na memória e não sobrevivem a uma recarga.

Ao abrir `/exames/toefl` depois de concluir o Exame 1, a apresentação aparece primeiro. O último relatório da sessão pode ser aberto pelo botão “Ver último resultado”; refazer o exame inicia uma tentativa nova e substitui as respostas anteriores desta aba.

Verificações: `npm run test:toefl`, `node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit`, `node node_modules/eslint/bin/eslint.js src/data/toeflPractice.ts src/lib/toeflPractice.ts src/pages/ToeflPage.tsx`.
