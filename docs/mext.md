# MEXT 2025 — graduação, modalidades A e B

As provas enviadas de Japonês A, Inglês A e Matemática A e o respectivo gabarito foram
importados como 147 itens corrigíveis: 45 de japonês, 70 de inglês e 32 de matemática.
Cada disciplina soma 100 pontos conforme os pesos do gabarito. As seis disciplinas
enviadas da modalidade B também foram importadas: Japonês B (48 itens), Inglês B
(50), Matemática B (20), Física (24), Química (40) e Biologia (73). No exame B, o
estudante escolhe Física ou Biologia além de Japonês, Inglês, Matemática e Química,
totalizando cinco provas e até 500 pontos de prática.

O importador `scripts/import_mext_2025_a.py` gera a migração
`db/migrations/041_mext_2025_a_seed.sql` e as imagens em `public/mext-assets/2025-a/`.
As imagens preservam fórmulas, furigana, passagens e a disposição dos enunciados.
O importador `scripts/import_mext_2025_b.py` gera a migração
`db/migrations/043_mext_2025_b_seed.sql` e imagens em
`public/mext-assets/2025-b/`, a partir dos sete PDFs B na ordem indicada no cabeçalho
do script. A migração `042_mext_b_daily.sql` amplia o desafio diário para B.
O texto extraído é oferecido como transcrição automática auxiliar e não deve ser
considerado fiel quando o PDF usa fórmulas ou disposição complexa. O PDF oficial
continua acessível a partir de cada item.

## Preparar o banco

Depois de configurar `.env.local` com `DATABASE_URL`:

```sh
npm run db:migrate
npm run api:dev
npm run dev
```

Abra `/exames/mext`. Os endpoints públicos são:

- `GET /api/mext/exam/availability?track=A|B&science=physics|biology`
- `GET /api/mext/exam?track=A|B&science=physics|biology`
- `POST /api/mext/exam/grade` (`track`, `science`, `answers`)
- `GET /api/mext/daily?track=A|B&subject=japanese|english|math|physics|chemistry|biology`
- `POST /api/mext/daily/answer`

O desafio diário usa um cookie anônimo por navegador, data de Brasília, modalidade
e disciplina. A modalidade A só aceita suas três disciplinas.
O exame não salva respostas; o cronômetro de cada prova roda no navegador. A
pontuação apresentada é somente uma prática com o gabarito de 2025, não um resultado
oficial nem uma previsão de concessão da bolsa.

Nas respostas abertas de Matemática B e Química, o sistema compara com formas
cadastradas do gabarito. A correção automática não reconhece necessariamente todas
as formas matematicamente equivalentes, nem reproduz toda a pontuação parcial de
equações químicas. O aluno deve conferir respostas não reconhecidas com o PDF oficial.

## Fonte e publicação

[Página oficial das provas anteriores](https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/examination.html).
A [política do Study in Japan](https://www.studyinjapan.go.jp/en/about/sitepolicy.html)
exige permissão expressa para republicar o conteúdo. Confirme essa autorização
antes de publicar os enunciados e imagens fora do ambiente local.
