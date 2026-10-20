# AGENTS.md — Daydreaming

## 1. Visão geral do projeto
O **Daydreaming** é uma plataforma digital para ajudar estudantes brasileiros a descobrir, comparar e planejar oportunidades educacionais internacionais. O objetivo é tornar informações sobre bolsas, universidades, cursos e processos seletivos mais acessíveis, organizadas e confiáveis.

A plataforma deve orientar o usuário desde a exploração de possibilidades até a preparação de uma candidatura. Não deve ser apenas um catálogo de ferramentas: as páginas e funcionalidades precisam se conectar em uma jornada clara, acolhedora e útil.

Princípios fundamentais:
- Acessibilidade, especialmente para estudantes com poucos recursos e estudantes de escolas públicas.
- Confiabilidade e transparência sobre fontes, datas e limitações dos dados.
- Clareza na explicação de termos, requisitos, custos e etapas.
- Autonomia: ajudar o usuário a decidir sem prometer aprovação ou resultados.
- Evolução gradual: entregar funcionalidades úteis e testadas antes de aumentar a complexidade.

## 2. Público-alvo
Estudantes brasileiros interessados em:
- Graduação.
- Pós-graduação e especialização.
- Mestrado e doutorado.
- MBA e programas profissionais.
- Intercâmbio acadêmico.
- Cursos de idiomas.
- Cursos de curta duração, summer schools e programas de pesquisa.

Considere usuários com diferentes níveis de conhecimento, orçamento, proficiência em idiomas e familiaridade com candidaturas internacionais. Explique siglas e conceitos quando necessário.

## 3. Objetivos e funcionalidades
Confirme o estado real de implementação antes de afirmar que uma funcionalidade está pronta.

### Descoberta e busca
- Buscador de bolsas, auxílios financeiros, universidades, cursos e programas.
- Filtros por país/região, nível de estudo, área, idioma, financiamento, elegibilidade e prazo, quando disponíveis.
- Guias de países com informações sobre educação, custo de vida, clima, trabalho, vistos e permanência após os estudos.
- Rankings de universidades e cursos, com metodologia, ano e fonte explícitos.
- Questionário para recomendar destinos ou programas com base nas preferências do usuário.

### Planejamento da candidatura
- Checklist de documentos e etapas.
- Acompanhamento de progresso e prazos.
- Comparação de oportunidades.
- Recomendações de próximos passos.
- Correspondência entre perfil do usuário e oportunidades, com explicação dos critérios e sem prometer elegibilidade ou aprovação.

### Preparação acadêmica
- Calculadora de GPA/conversão de notas, explicando que instituições podem usar métodos próprios.
- Simulados e exercícios para exames de proficiência e admissão.
- Simulador de entrevistas.
- Recursos para preparar currículo, carta de motivação, redações e documentos, quando implementados.
- Teste vocacional ou de interesses, apresentado como orientação exploratória, não como diagnóstico definitivo.

### Comunidade e engajamento
- Conteúdo educativo e comunidade, se fizerem parte do escopo atual.
- Gamificação que incentive o progresso sem pressionar ou enganar.
- Progresso visual, metas e conquistas acessíveis e opcionais.

Não implemente tudo de uma vez. Confirme a prioridade da tarefa. Não crie seções que apenas enumerem funcionalidades quando a necessidade for desenvolver uma experiência completa. Cada seção deve ter propósito, conteúdo, hierarquia visual e um próximo passo claro.

## 4. Experiência e identidade visual
A interface deve ser acolhedora, moderna, organizada, amigável e levemente gamificada. Pode se inspirar em padrões de usabilidade de produtos educacionais, mas deve manter identidade visual original — sem copiar diretamente marcas, personagens ou interfaces.

Diretrizes:
- Use títulos que comuniquem valor e orientem a jornada.
- Crie hierarquia clara entre título, explicação, conteúdo principal e ação.
- Prefira layouts editoriais, módulos destacados e narrativas visuais a grades repetitivas de cartões.
- Use ilustrações, ícones e SVGs com propósito.
- Mantenha consistência em cores, espaçamento, tipografia, bordas, sombras e estados interativos.
- Use português brasileiro por padrão.
- Evite excesso de gradientes, emojis, efeitos, animações ou cores concorrentes.
- CTAs devem indicar o resultado esperado, como “Explorar bolsas” ou “Comparar destinos”.
- Não afirme que uma ferramenta está disponível se ainda for apenas uma ideia ou protótipo.

A identidade deve ser consistente entre página inicial, páginas de países, buscadores, ferramentas e páginas de conteúdo.

## 5. Tecnologias e ferramentas
A stack prevista inclui HTML, CSS, JavaScript, React, TypeScript e PostgreSQL. O projeto pode conter páginas legadas em HTML/CSS/JavaScript e Bootstrap.

Antes de alterar arquivos, inspecione o código existente e identifique a stack realmente usada naquela parte do projeto.
- Não migre uma página para React/TypeScript sem solicitação ou plano aprovado.
- Não adicione bibliotecas, frameworks ou serviços desnecessários.
- Quando apropriado, considere um serviço gerenciado como Supabase para PostgreSQL, autenticação e APIs, avaliando os requisitos antes.
- Nunca exponha chaves secretas, tokens ou credenciais no frontend ou em arquivos versionados.
- Respeite versões, scripts, dependências e convenções existentes.

## 6. Arquitetura e organização do código
- Preserve a organização existente, salvo quando a tarefa incluir refatoração.
- Separe estrutura, estilos e comportamento quando compatível com a arquitetura atual.
- Em aplicações com componentes, mantenha componentes pequenos, coesos e reutilizáveis.
- Evite duplicação de lógica e estilos.
- Use nomes claros e consistentes.
- Evite arquivos monolíticos quando a separação trouxer benefício real.
- Não introduza abstrações complexas para problemas simples.
- Não altere arquivos sem relação com a solicitação.
- Reutilize componentes e padrões existentes.
- Mantenha links, rotas, formulários e estados interativos funcionais.
- Não substitua conteúdo real por placeholders ou dados fictícios sem avisar.

## 7. Banco de dados e modelagem
- Modele entidades e relacionamentos de acordo com o domínio real.
- Use chaves primárias/estrangeiras, restrições e índices apropriados.
- Considere entidades para países, instituições, programas, bolsas, requisitos, fontes, prazos e usuários conforme a necessidade.
- Diferencie oportunidades, instituições e programas.
- Armazene URLs de fonte e datas de verificação para informações mutáveis.
- Registros de scraping devem entrar no buscador como **listados no catálogo**, sem fila padrão de "pendente de revisão". Para novas fontes, use `catalog_status = 'listed'` como estado inicial e integre esse estado à busca; mantenha registros rejeitados fora dos resultados. "Listado" não significa edital aberto, dados verificados ou elegibilidade confirmada.
- Use migrations versionadas para alterações de esquema.
- Evite exclusões destrutivas sem confirmação e plano de recuperação.
- Nunca armazene senhas em texto puro; use autenticação e hash adequados, preferencialmente por provedor confiável.
- Defina autorização no servidor e no banco, não apenas na interface.

Não defina o esquema final antes de entender as consultas e funcionalidades necessárias.

## 8. Segurança, privacidade e LGPD
- Colete somente dados pessoais necessários.
- Explique a finalidade da coleta e evite dados sensíveis sem necessidade clara.
- Siga privacidade por padrão e por concepção.
- Não exponha dados de usuários, tokens, chaves privadas ou configurações.
- Valide entradas no cliente e no servidor.
- Proteja endpoints e ações com autenticação e autorização apropriadas.
- Evite SQL injection, XSS, CSRF e outros riscos pertinentes à arquitetura.
- Não confie exclusivamente na validação do frontend.
- Não registre segredos ou dados pessoais desnecessários em logs.
- Proteja credenciais de integrações externas.
- Redobre cuidados com pagamentos, documentos e dados de candidatura.

Estas diretrizes não substituem uma avaliação jurídica ou de segurança especializada.

## 9. Confiabilidade das informações
Informações sobre bolsas, universidades, vistos, custos, requisitos, prazos e trabalho internacional podem mudar. A confiabilidade é parte central do produto.

Regras:
- Priorize fontes oficiais de universidades, governos, embaixadas, órgãos de imigração e organizações responsáveis pelo programa.
- Preserve a fonte direta e, quando possível, a data em que a informação foi verificada.
- Diferencie fatos confirmados, estimativas, orientações gerais e conteúdo ilustrativo.
- Não invente bolsas, valores, prazos, requisitos, rankings, estatísticas, links ou critérios de elegibilidade.
- Não apresente dados de exemplo como oportunidades reais.
- Se não puder confirmar algo, sinalize a incerteza e indique como verificar.
- Não conclua que alguém é elegível apenas por uma correspondência parcial de perfil.
- Explique que os requisitos finais e as decisões pertencem à instituição ou entidade responsável.
- Em rankings, informe fonte, edição/ano e metodologia quando disponíveis.
- Para custos, indique moeda, período de referência e se o valor é estimado.
- Para prazos, inclua ano e fuso horário quando relevantes; não reutilize datas antigas como atuais.

Se não houver dados verificados, prefira uma estrutura pronta para receber informações confiáveis a preencher a interface com dados inventados.

## 10. Responsividade, acessibilidade e desempenho
### Responsividade
- Desenvolva para celular, tablet e desktop.
- Evite larguras fixas que causem rolagem horizontal.
- Verifique menus, formulários, tabelas, filtros, abas e cartões em telas estreitas.
- Mantenha as ações importantes fáceis de encontrar em dispositivos móveis.

### Acessibilidade
- Use HTML semântico e hierarquia correta de títulos.
- Associe rótulos aos campos.
- Garanta navegação por teclado e foco visível.
- Use contraste suficiente e não comunique estados somente por cor.
- Adicione textos alternativos úteis a imagens informativas.
- Respeite `prefers-reduced-motion`.
- Dê nomes acessíveis a controles com apenas ícones.
- Não dependa de animações para transmitir informações essenciais.

### Desempenho
- Otimize imagens e carregue mídia de forma apropriada.
- Evite JavaScript e dependências desnecessários.
- Minimize consultas e requisições redundantes.
- Considere estados de carregamento, vazio, erro e sucesso.

## 11. Funcionalidades e interações
Toda funcionalidade visível deve funcionar conforme a promessa da interface.
- Botões executam ações reais ou são claramente identificados como desabilitados/planejados.
- Links apontam para destinos válidos.
- Formulários têm validação, mensagens claras e tratamento de erros.
- Filtros alteram os resultados de verdade.
- Abas e menus funcionam com mouse, teclado e toque.
- Salvar progresso no navegador não deve ser apresentado como sincronização entre dispositivos.
- Se o backend não existir, identifique o comportamento demonstrativo.
- Não simule login, busca, envio ou persistência como se fossem reais.

## 12. Como a IA deve trabalhar
Antes de implementar:
1. Leia este arquivo e as instruções específicas do ambiente.
2. Inspecione os arquivos relevantes e entenda a funcionalidade atual.
3. Identifique dependências, rotas, estilos e comportamentos afetados.
4. Escolha a menor alteração que resolva a necessidade sem comprometer o restante.
5. Se houver ambiguidade que mude significativamente o resultado, faça uma pergunta objetiva; caso contrário, adote a opção mais coerente e informe a decisão.

Durante o trabalho:
- Implemente de fato quando a tarefa pedir código, não apenas dê recomendações.
- Preserve funcionalidades existentes e compatibilidade.
- Evite reescrever tudo sem necessidade.
- Não afirme que executou testes, abriu o navegador ou conferiu o visual se isso não ocorreu.
- Informe limitações e dados simulados.
- Prefira mudanças compreensíveis e fáceis de revisar.

Ao concluir:
- Resuma o que mudou.
- Liste arquivos modificados.
- Informe os testes executados e resultados reais.
- Explique o que não foi implementado ou verificado.
- Dê instruções para executar ou visualizar o resultado, quando necessário.

## 13. Fases de desenvolvimento
As fases são uma orientação, não uma obrigação rígida. Confirme prioridades antes de iniciar um grande bloco de trabalho.

### Fase 1 — Fundamentos
- Identidade visual e navegação.
- Estrutura responsiva.
- Organização do conteúdo e fontes.
- Protótipos das páginas essenciais.

### Fase 2 — Conteúdo e descoberta
- Guias de países.
- Catálogo/buscador de oportunidades com fontes.
- Filtros e páginas de detalhes.
- Comparação de programas e destinos.

### Fase 3 — Preparação
- Calculadora GPA.
- Simulados e exercícios.
- Teste vocacional exploratório.
- Preparação para entrevistas e documentos.

### Fase 4 — Personalização e acompanhamento
- Perfil e preferências.
- Recomendações explicáveis.
- Checklists e progresso de candidatura.
- Salvamento/sincronização com controles de privacidade.

### Fase 5 — Comunidade e melhoria contínua
- Recursos comunitários, se priorizados.
- Monitoramento da qualidade dos dados.
- Melhorias de acessibilidade, desempenho e experiência.

Não marque uma funcionalidade como concluída só porque a interface existe. Considere comportamento, estados de erro, qualidade dos dados e testes.

## 14. Critérios de qualidade
Use a lista pertinente à tarefa:
- [ ] A alteração atende ao pedido específico.
- [ ] Os arquivos relevantes foram inspecionados antes da edição.
- [ ] A identidade visual e os padrões do projeto foram respeitados.
- [ ] Nenhuma funcionalidade não relacionada foi removida.
- [ ] Links, botões e controles afetados foram verificados.
- [ ] A interface é responsiva.
- [ ] Há estados de carregamento, vazio e erro quando necessários.
- [ ] Acessibilidade básica foi considerada.
- [ ] Não há dados inventados apresentados como reais.
- [ ] Fontes e datas de verificação foram preservadas quando aplicável.
- [ ] Os testes pertinentes foram executados ou as limitações foram informadas.
- [ ] A documentação foi atualizada quando necessário.

## 15. Princípio central
**O Daydreaming deve transformar uma busca confusa por oportunidades internacionais em uma jornada clara, confiável e possível de seguir.**

Não basta listar funcionalidades ou produzir uma interface bonita. Cada página deve ajudar o usuário a entender suas opções, tomar uma decisão informada e identificar o próximo passo concreto.
