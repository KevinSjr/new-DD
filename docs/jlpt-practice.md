# JLPT — Exame 1 autoral

Rotas: `/exames/jlpt` e `/exames/jlpt/n5` até `/n1`.

O teste é **inspirado no formato do JLPT; não é oficial**, não oferece certificado e não reproduz os itens, áudios ou a nota escalonada da organização. As questões e os pequenos textos são autorais. O relatório informa apenas acertos brutos por habilidade; não determina aprovação.

## Tempos e contagens adotados

| Nível | Vocabulário | Gramática | Leitura | Audição | Total | Tempos das seções |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| N5 | 21 | 17 | 5 | 24 | 67 | 20 + 40 + 30 min |
| N4 | 28 | 21 | 8 | 28 | 85 | 25 + 55 + 35 min |
| N3 | 35 | 23 | 16 | 28 | 102 | 30 + 70 + 40 min |
| N2 | 32 | 22 | 21 | 32 | 107 | 105 + 50 min |
| N1 | 25 | 20 | 25 | 30 | 100 | 110 + 55 min |

Tempos: [composição atual das seções](https://www.jlpt.jp/e/guideline/testsections.html). N4/N5: [revisão de contagens de 2020](https://www.jlpt.jp/e/topics/202009091599642827.html). N1, audição: [revisão de 2022](https://jlpt.jp/sp/e/topics/202208051659677223.html). N1/N2/N3 e seções não revisadas: [caderno oficial de prática de 2018 e respectivas chaves](https://www.jlpt.jp/e/samples/sampleindex.html). Fontes consultadas em 09/11/2026.

O JLPT informa que o número de itens **pode variar entre aplicações**. Estes totais são a composição fixa escolhida para o Exame 1 do Daydreaming, baseada nas aproximações oficiais; não são uma promessa de contagem idêntica em todas as provas reais.

## Limitações da adaptação

- Os textos e áudios são curtos e os tipos de pergunta são menos variados que os da prova, sobretudo nos níveis N2 e N1. A dificuldade real não foi calibrada.
- A audição usa a síntese de voz japonesa instalada no navegador. Se ela faltar, o estudante pode abrir a transcrição para continuar a prática.
- O JLPT utiliza pontuação escalonada baseada no padrão de respostas, que não pode ser calculada a partir de simples porcentagens de acerto. [Explicação oficial da pontuação](https://www.jlpt.jp/e/about/pdf/scaledscore_e.pdf).
- A sessão fica em `sessionStorage`: recarregar a aba preserva respostas e o prazo da seção; não há sincronização com a conta.

As questões não copiam os cadernos oficiais. Seus [termos de uso](https://www.jlpt.jp/e/samples/sampleindex.html) apontam restrições de reprodução e materiais de terceiros.
