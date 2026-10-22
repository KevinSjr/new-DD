# SAT no Daydreaming

## Formato conferido em 22/10/2026

O [SAT digital atual](https://satsuite.collegeboard.org/sat/whats-on-the-test/structure) tem Reading and Writing (54 questões, 64 minutos: dois módulos de 27 questões/32 minutos) e Math (44 questões, 70 minutos: dois módulos de 22 questões/35 minutos), com intervalo de 10 minutos. O segundo módulo de cada seção é adaptado ao desempenho no primeiro. A pontuação oficial não pode ser inferida diretamente de uma porcentagem de acertos.

Os arquivos fornecidos pelo usuário são a **versão não digital/em papel** do [SAT Practice Test #4](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf) e suas [explicações de respostas](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf). São 33 questões em cada módulo de Reading and Writing (39 minutos por módulo) e 27 em cada módulo de Math (43 minutos por módulo). A plataforma identifica o modo exame como reprodução não adaptativa desse material; não o apresenta como SAT digital oficial.

## Estado da implementação

- As migrações `027_sat_questions.sql`, `028_sat_practice_4_starter.sql` e `029_sat_practice_4_complete.sql` criam o esquema e inserem as 120 questões dos quatro módulos. A migração final adiciona 115 questões e seus recortes em `public/sat-assets/practice-4/`. O gabarito foi conferido com as [explicações oficiais](https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf) e a [chave de correção oficial](https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf). A transcrição textual é automática e pode perder notação matemática; a imagem preserva o original. O script `scripts/audit_sat_pdf.py` permite auditar posições e reconstruir os arquivos a partir dos PDFs.
- `/exames/sat` oferece escolha de modo. O desafio diário traz cinco questões, três sóis e uma perda por erro. Os sóis renovam no dia seguinte, pelo horário de Brasília. O servidor mantém o estado por cookie anônimo; respostas de dias anteriores são removidas quando o desafio é acessado em um novo dia. Sem conta, limpar o cookie permite recomeçar; não é um sistema competitivo à prova de fraude.
- `/exames/sat/simulado` habilita o exame com 120 questões publicadas nas quatro posições completas. O cronômetro segue os tempos da versão em papel. O relatório final mostra acertos por módulo e seção, faixa de pontuação por seção (200–800) e faixa total (400–1600) a partir da tabela do guia de correção específico deste teste. `server/satScoring.mjs` contém as 67 linhas da tabela oficial; as faixas inferiores e superiores são somadas separadamente. Não se apresenta um valor único nem uma nota oficial do SAT digital adaptativo. A tentativa e o relatório não são salvos: recarregar reinicia.
- `/admin/sat` usa a mesma autenticação do CRUD de bolsas. O administrador pode criar, ler, editar, publicar e arquivar questões. A importação automatizada mantém o recorte visual original justamente porque a extração de texto perde parte dos elementos visuais; uma revisão humana item a item ainda é recomendada antes de disponibilização pública.

## Como executar

1. Configure o PostgreSQL em `.env.local` e rode `npm run db:migrate`.
2. Em um terminal, rode `npm run api:dev`; em outro, `npm run dev`.
3. Abra `http://localhost:5173/exames/sat`.
4. Para o CRUD, defina `ADMIN_USERNAME` e `ADMIN_PASSWORD_HASH` em `.env.local`. Gere o hash com `npm run admin:hash`, digitando a senha localmente (não a envie pelo chat nem a versione). Reinicie a API e abra `http://localhost:5173/admin/sat`.

O catálogo público não possui links externos nos cartões. URLs oficiais são mantidas nos dados e no painel de administração para rastreabilidade.

Para reconstruir a migração e os recortes a partir dos PDFs originais, instale `pymupdf` e `pillow` em um ambiente Python e execute `python scripts/audit_sat_pdf.py <teste.pdf> <explicacoes.pdf> --build`. A reconstrução substitui os arquivos gerados; ela não executa a migração no banco. Sem `--build`, o script apenas audita numeração e gabaritos. A chave oficial está registrada no script e sua fonte é o guia de correção do College Board acima.
