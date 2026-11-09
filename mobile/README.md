# Daydreaming para Android e iOS

Este projeto Expo/React Native fica separado do site React e compartilha a mesma identidade visual. A navegação contém Início, Países, Bolsas, Jornada e Conta. Conta, catálogo, bolsas salvas e prazos usam a mesma API e o mesmo PostgreSQL do site.

## Executar

Na pasta `mobile`, execute `npm install` e `npm start`. Abra o QR code com Expo Go no celular, ou pressione `a` para Android com emulador configurado. Para conferir a estrutura no navegador, execute `npm run web`. O aplicativo iOS precisa ser testado em um iPhone ou em um simulador disponível no macOS.

O site e a API continuam sendo executados na raiz do repositório com `npm run dev`. O endereço `127.0.0.1` do computador não serve como endereço da API para um celular físico.

Para testar a integração na mesma rede Wi-Fi, use `API_HOST=0.0.0.0` no `.env.local` da raiz e execute `npm run dev` na raiz, além de `npm start` nesta pasta. O app descobre o endereço do computador a partir do Expo Go e chama a API na porta 3001. Em produção, configure `EXPO_PUBLIC_API_URL` com a URL HTTPS pública antes de gerar o app. Se a API não carregar no celular, confira o firewall do Windows e se os dois dispositivos estão na mesma rede.

## Estrutura

- `src/app/(tabs)`: telas e navegação principal com Expo Router.
- `src/components/Screen.tsx`: estrutura compartilhada das telas e aviso de recurso em preparação.
- `src/theme.ts`: cores da marca.
- `assets/images/daydreaming-*`: imagens da marca utilizadas no app.

O contrato da API móvel está em `../docs/mobile-api.md`.

Em **Perfil → Editar meu perfil**, é possível salvar informações pessoais, dados acadêmicos e metas de estudo na mesma conta usada no site.

Em **Início → Ligas semanais**, é possível entrar nas ligas separadas de SAT e MEXT. Depois de registrar um desafio diário na conta, o ranking recebe os pontos da atividade. A API precisa estar atualizada e a migração `055_weekly_exam_leagues.sql` aplicada.

Em **Perfil → Meu avatar**, é possível escolher personagem, roupa, acessório e uma bandeira de país para o fundo. A seleção é salva na conta pelo endpoint `PUT /api/account/avatar` e aparece no perfil móvel. A primeira personalização concede 50 XP uma única vez. As migrações `056_user_avatars.sql` e `057_avatar_flag_backgrounds.sql` são necessárias.

Os oito retratos principais seguem a referência visual enviada para o app e estão em `assets/images/avatars/`. Roupas e acessórios agora também são imagens 3D transparentes. O registro dos prompts está em `../docs/avatar-asset-prompts.md`.

## Calculadora de GPA

Na tela inicial, abra **Calculadora de GPA**. É possível converter uma média geral ou informar disciplinas e créditos, comparar três métodos e, com uma conta conectada, salvar as três estimativas. Os valores salvos também aparecem em **Conta**. O cálculo é local; o salvamento usa a API e o PostgreSQL do site.

As regras e tabelas de conversão têm como fonte os arquivos do site `src/data/gpaMethods.ts` e `src/lib/gpa.ts`. Antes de iniciar o app com `npm start`, `npm run android`, `npm run ios` ou `npm run web`, o script copia esses arquivos para `mobile/src`. Após alterar as regras no site, execute `npm run sync:gpa` nesta pasta; `npm run check:gpa` confere se as cópias estão atualizadas.

## Se o Expo Go mostrar erro 500

Interrompa o Metro com `Ctrl+C` e, nesta pasta, execute `npm install` até o comando terminar. Depois inicie com `npx expo start --clear --lan` e leia o novo QR code. O celular e o computador precisam estar na mesma rede. Se o erro persistir, copie a primeira mensagem `Android Bundling failed` do terminal; ela identifica o módulo que falhou.

## Se aparecer “Cannot connect to Expo CLI”

O aviso é da conexão de atualização automática do Expo Go com o Metro na porta 8081. Primeiro, no navegador do celular, abra o endereço exibido no aviso seguido de `/status` (por exemplo, `http://192.168.0.204:8081/status`). A resposta esperada é `packager-status:running`.

- Se não abrir no celular, confirme que celular e computador estão na mesma rede, sem rede de convidados ou isolamento de dispositivos. Verifique o firewall do Windows para o Node.js na rede ativa.
- Se abrir, feche e reabra o projeto no Expo Go. Se o aviso persistir, interrompa o Metro com `Ctrl+C` e, na pasta `mobile`, inicie `npx expo start --clear --lan`. Abra o QR code novo. Não mantenha dois Metros na porta 8081.
- Se a instância antiga continuar exibindo o aviso mesmo após reiniciar o projeto no Expo Go, inicie uma sessão limpa em outra porta com `npx expo start --clear --lan --port 8082` e abra `exp://<IP-DO-COMPUTADOR>:8082` no Expo Go. Encerre o Metro antigo depois de confirmar que a nova sessão funciona.
- `adb reverse` só se aplica a um aparelho Android conectado por USB com ADB configurado; não é necessário para testar pela rede Wi-Fi.
- O modo `--tunnel` pode ajudar a diagnosticar a conexão do Expo Go, mas a API do Daydreaming na porta 3001 precisa continuar acessível ao celular por uma URL própria configurada em `EXPO_PUBLIC_API_URL`.

Se o app abre e o aviso aparece apenas no console, abra o menu de desenvolvimento do Expo Go (agite o celular ou use o menu do Expo Go) e escolha **Reload**. Se o aviso voltar, é possível desligar temporariamente **Fast Refresh** nesse menu e recarregar manualmente após cada alteração de código. Isso desativa apenas a atualização automática durante o desenvolvimento. Problemas de dados da conta e bolsas são da API na porta 3001 e devem ser diagnosticados separadamente.

## Referência visual do app

A referência vigente, que substitui os conceitos anteriores, está em [docs/mobile-visual-reference.md](../docs/mobile-visual-reference.md). A imagem original também foi guardada no repositório.

## Teste vocacional

Na tela inicial, abra **Teste vocacional**. O fluxo usa as mesmas 60 atividades do site, em 10 etapas, com prioridades opcionais. O resultado mostra as seis áreas de interesse no gráfico e sugere carreiras para as duas maiores. As respostas ficam na memória da tela e são descartadas ao sair; para contas conectadas, apenas eventos de conclusão e exploração de áreas são enviados para conquistas.

Perguntas, exemplos de carreiras e pontuação vêm dos arquivos do site em `src/data/vocationalQuestions.ts`, `src/data/vocationalCareers.ts` e `src/lib/vocational.ts`. Os comandos de início sincronizam as cópias automaticamente; após mudar o site, execute `npm run sync:vocational` ou confira com `npm run check:vocational`.
