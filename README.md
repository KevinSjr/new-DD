# Daydreaming

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

## Rankings e fontes

- Ranking geral QS World University Rankings 2027: primeiras 1.000 instituições da planilha fornecida.
- Cinco rankings de áreas amplas QS World University Rankings by Subject 2026: Artes e Humanidades, Engenharia e Tecnologia, Ciências da Vida e Medicina, Ciências Naturais, e Ciências Sociais e Administração.

Cada página informa a edição, a fonte, a metodologia e as limitações. As disciplinas listadas dentro das áreas apontam para os rankings específicos no site da QS; os dados dessas disciplinas individuais não são hospedados aqui. Veja [data/README.md](data/README.md) para os arquivos, a extração e a atribuição dos dados.
