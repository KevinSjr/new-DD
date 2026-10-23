# SAT no Daydreaming

## Formato conferido em 22/10/2026

O [SAT digital atual](https://satsuite.collegeboard.org/sat/whats-on-the-test/structure) tem Reading and Writing (54 questões, 64 minutos: dois módulos de 27 questões/32 minutos) e Math (44 questões, 70 minutos: dois módulos de 22 questões/35 minutos), com intervalo de 10 minutos. O segundo módulo de cada seção é adaptado ao desempenho no primeiro. A pontuação oficial não pode ser inferida diretamente de uma porcentagem de acertos.

Os arquivos fornecidos pelo usuário são as **versões não digitais/em papel** dos [SAT Practice Tests #4](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf) e [#5](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-digital.pdf), com suas explicações de respostas. Cada teste tem 33 questões em cada módulo de Reading and Writing (39 minutos por módulo) e 27 em cada módulo de Math (43 minutos por módulo). A plataforma identifica o modo exame como reprodução não adaptativa desse material; não o apresenta como SAT digital oficial.

## Estado da implementação

- As migrações `027_sat_questions.sql`, `028_sat_practice_4_starter.sql` e `029_sat_practice_4_complete.sql` criam o esquema e inserem as 120 questões dos quatro módulos. A migração final adiciona 115 questões e seus recortes em `public/sat-assets/practice-4/`. O gabarito foi conferido com as [explicações oficiais](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf) e a [chave de correção oficial](https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf). A transcrição textual é automática e pode perder notação matemática; a imagem preserva o original. O script `scripts/audit_sat_pdf.py` permite auditar posições e reconstruir os arquivos a partir dos PDFs.
- A migração `030_sat_practice_5.sql` adiciona as 120 questões do teste nº 5 e `public/sat-assets/practice-5/` contém seus recortes. `scripts/import_sat_practice_5.py` audita posições e o gabarito frente às [explicações oficiais](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf) e reconstrói a migração. Questões com frações e gráficos dependem da imagem original; recomenda-se revisão humana item a item antes da divulgação pública.
- `/exames/sat` oferece escolha de modo. O desafio diário se divide em Reading and Writing e Mathematics, com cinco questões e três sóis independentes por área. Ambos misturam questões dos testes 4 e 5, sem criar um desafio próprio para cada teste. Os sóis renovam no dia seguinte, pelo horário de Brasília. O servidor mantém o estado por cookie anônimo; respostas de dias anteriores são removidas quando o desafio é acessado em um novo dia. Sem conta, limpar o cookie permite recomeçar; não é um sistema competitivo à prova de fraude.
- `/exames/sat/simulado` permite escolher o teste nº 4 ou nº 5, cada qual com 120 questões publicadas nas quatro posições completas. O cronômetro segue os tempos da versão em papel. O relatório final mantém as mesmas métricas e layout: acertos por módulo e seção, faixa por seção (200–800) e faixa total (400–1600). `server/satScoring.mjs` contém as tabelas oficiais específicas dos [testes nº 4](https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf) e [nº 5](https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-5-digital.pdf). As faixas inferiores e superiores são somadas separadamente. Não se apresenta um valor único nem uma nota oficial do SAT digital adaptativo. A tentativa e o relatório não são salvos: recarregar reinicia.
- `/admin/sat` usa a mesma autenticação do CRUD de bolsas. O administrador pode criar, ler, editar, publicar e arquivar questões. A importação automatizada mantém o recorte visual original justamente porque a extração de texto perde parte dos elementos visuais; uma revisão humana item a item ainda é recomendada antes de disponibilização pública.

## Como executar

1. Configure o PostgreSQL em `.env.local` e rode `npm run db:migrate`.
2. Em um terminal, rode `npm run api:dev`; em outro, `npm run dev`.
3. Abra `http://localhost:5173/exames/sat`.
4. Para o CRUD, defina `ADMIN_USERNAME` e `ADMIN_PASSWORD_HASH` em `.env.local`. Gere o hash com `npm run admin:hash`, digitando a senha localmente (não a envie pelo chat nem a versione). Reinicie a API e abra `http://localhost:5173/admin/sat`.

O catálogo público não possui links externos nos cartões. URLs oficiais são mantidas nos dados e no painel de administração para rastreabilidade.

Para reconstruir a migração e os recortes a partir dos PDFs originais, instale `pymupdf` e `pillow` em um ambiente Python. Execute `python scripts/audit_sat_pdf.py <teste4.pdf> <explicacoes4.pdf> --build` para o nº 4 ou `python scripts/import_sat_practice_5.py <teste5.pdf> <explicacoes5.pdf>` para o nº 5. A reconstrução substitui os arquivos gerados; ela não executa a migração no banco. Sem `--build`, o script nº 4 apenas audita numeração e gabaritos. A chave nº 5 está registrada no script e conferida contra as explicações fornecidas.
