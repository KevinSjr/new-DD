# CLAUDE.md — Instruções para o Claude Code

## Contexto obrigatório
O **Daydreaming** é uma plataforma em português brasileiro para ajudar estudantes a descobrir, comparar e planejar oportunidades educacionais internacionais.

**Antes de trabalhar no projeto, leia `AGENTS.md` na raiz do repositório.** Esse arquivo contém a visão do produto, o público-alvo, as funcionalidades, a identidade visual, a stack, as regras de segurança e privacidade, os critérios de confiabilidade e os padrões de qualidade.

Se houver conflito entre instruções, siga as instruções mais específicas da tarefa e respeite as regras de segurança. Se o conflito afetar uma decisão importante, explique-o antes de prosseguir.

## Como trabalhar neste repositório
1. Inspecione a estrutura e os arquivos relevantes antes de editar.
2. Descubra qual stack a página ou módulo realmente utiliza. O projeto pode conter HTML/CSS/JavaScript e Bootstrap, além de áreas que usem React e TypeScript.
3. Preserve a arquitetura e os padrões existentes. Não migre tecnologias, reorganize pastas ou instale dependências sem necessidade clara.
4. Implemente o que foi pedido, evitando alterações não relacionadas.
5. Mantenha a experiência visual coesa com o Daydreaming: amigável, clara, responsiva e gamificada com moderação.
6. Prefira uma jornada bem construída a uma sequência de cartões que apenas enumera ferramentas.
7. Preserve funcionalidades, links, conteúdo e interações fora do escopo da mudança.
8. Não invente informações sobre bolsas, universidades, prazos, custos, requisitos ou vistos. Priorize fontes oficiais e mantenha URLs e datas de verificação.
9. Identifique dados de demonstração, placeholders e funcionalidades planejadas.
10. Considere acessibilidade, responsividade, desempenho, segurança e LGPD.

## Processo recomendado

### Antes de editar
- Leia `AGENTS.md`.
- Inspecione os arquivos que serão alterados e os componentes relacionados.
- Entenda o comportamento atual e identifique dependências.
- Se o pedido for ambíguo e as interpretações levarem a soluções substancialmente diferentes, faça uma pergunta curta. Caso contrário, siga a interpretação mais coerente.

### Durante a implementação
- Faça a menor mudança completa que resolva o problema.
- Reutilize componentes e estilos existentes quando fizer sentido.
- Evite duplicação, soluções improvisadas e dependências desnecessárias.
- Não deixe botões ou formulários aparentando funcionar quando não têm comportamento real.
- Trate estados de carregamento, erro, ausência de resultados e sucesso quando aplicável.
- Nunca coloque credenciais, tokens ou segredos no código do frontend.
- Não faça alterações destrutivas nem remova dados sem autorização explícita.

### Verificação
Execute verificações pertinentes à alteração e ao ambiente disponível. Por exemplo:
- Verificar sintaxe JavaScript/TypeScript.
- Executar lint, testes ou build se os scripts estiverem disponíveis.
- Verificar links, seletores, imports e referências aos arquivos afetados.
- Inspecionar a renderização em tamanhos de tela relevantes se houver navegador ou ferramenta disponível.

Não diga que executou um teste, abriu a página ou confirmou o resultado visual se isso não aconteceu. Se não for possível verificar algo, informe a limitação.

### Ao terminar
Apresente um resumo curto com:
- O que foi implementado.
- Quais arquivos foram criados ou modificados.
- Quais verificações foram executadas e seus resultados.
- O que ficou pendente ou não pôde ser verificado.
- Como executar ou visualizar a mudança, se relevante.

## Direção de produto e interface
- A experiência deve ajudar o usuário a avançar: descobrir opções → entender requisitos → comparar alternativas → preparar a candidatura → acompanhar etapas.
- Use títulos, explicações e chamadas para ação específicos.
- Evite transformar a página inicial em um inventário de ferramentas.
- Mantenha consistência entre a página inicial, guias de países, buscadores e ferramentas.
- Escreva em português brasileiro por padrão.
- Não copie diretamente a identidade visual de outros produtos. Use referências de usabilidade sem imitar marcas, personagens ou layouts proprietários.
- Funcionalidades não implementadas devem ser identificadas como planejadas, em vez de apresentadas como prontas.

## Fonte de verdade
`AGENTS.md` é a referência geral do projeto. Quando uma tarefa introduzir uma decisão duradoura — como nova tecnologia, estrutura de dados, padrão de interface ou regra de negócio — verifique se é necessário atualizar a documentação para manter decisões futuras consistentes.
