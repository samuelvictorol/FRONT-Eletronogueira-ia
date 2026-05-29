# ⚡ Eletro Nogueira — Frontend Vue + Quasar

Documentação simples para instalar, rodar e entender a estrutura do frontend da **Eletro Nogueira**.

Este projeto é a interface visual do site/sistema. É nele que ficam as páginas, layout, catálogo, detalhes de produto, localização, serviços e área administrativa.

---

## 📌 Resumo rápido

- **Framework principal:** Vue 3
- **Interface visual:** Quasar Framework
- **Requisições para API:** Axios
- **Rotas/páginas:** Vue Router
- **Estado global:** Pinia
- **SEO/meta tags:** @unhead/vue
- **Leitura de código de barras/QR:** @zxing/browser

---

## 🧠 Contextualizando

Pense no projeto como uma loja física:

- `src/pages` são os **cômodos da loja**: página inicial, catálogo, produto, localização etc.
- `src/layouts` é a **estrutura da loja**: topo, menu, rodapé e área onde as páginas aparecem.
- `src/boot` são os **serviços ligados antes da loja abrir**, como conexão com a API.
- `public` são os **arquivos públicos**, como logo, favicon, sitemap e imagens.
- `quasar.config.js` é o **painel de configuração geral** do projeto.
- `.env` é onde ficam os **endereços importantes**, como a URL da API.

---

## ✅ Pré-requisitos

Antes de rodar o projeto, instale no computador:

### 1. Node.js

Baixe e instale o **Node.js LTS** pelo site oficial.

> Recomendado: Node.js 18 ou superior.

Depois de instalar, confira se deu certo:

```bash
node -v
npm -v
```

Se aparecer uma versão nos dois comandos, está tudo certo. ✅

### 2. Git

Instale o Git para conseguir baixar o projeto do GitHub.

Confira se está instalado:

```bash
git --version
```

---

## 📥 Como baixar o projeto

Abra o terminal na pasta onde deseja salvar o projeto e rode:

```bash
git clone https://github.com/samuelvictorol/FRONT-Eletronogueira-ia.git
```

Entre na pasta do projeto:

```bash
cd FRONT-Eletronogueira-ia
```

---

## 📦 Como instalar as dependências

Dependências são os “pacotes” que o projeto precisa para funcionar.

Rode:

```bash
npm install
```

Esse comando cria a pasta `node_modules`, que contém as bibliotecas usadas pelo projeto.

> Não precisa mexer manualmente na pasta `node_modules`.

---

## 🔐 Configuração do arquivo `.env`

Na raiz do projeto existe o arquivo `.env`.

Ele guarda os endereços que o frontend usa para se comunicar com o backend.

Exemplo:

```env
BACKEND_URL=https://api.eletronogueira.com.br
IA_BACKEND_URL=http://localhost:10000
VITE_IA_BACKEND_URL=http://localhost:10000
```

### O que cada variável significa?

| Variável | Para que serve |
|---|---|
| `BACKEND_URL` | Endereço principal da API do sistema. É por onde o frontend busca produtos, dados e informações. |
| `IA_BACKEND_URL` | Endereço de uma API relacionada à IA, usada em ambiente local ou integração específica. |
| `VITE_IA_BACKEND_URL` | Variação usada pelo Vite/frontend para acessar a API de IA quando necessário. |
| `FRONTEND_URL` | Endereço público do frontend, caso seja configurado. |
| `APP_BASE_URL` | URL base da aplicação, usada em configurações específicas. |
| `PROD_SLUGS_API` | Endpoint auxiliar para slugs/produtos, caso esteja sendo usado. |

> Importante: se o backend estiver rodando localmente, troque o `BACKEND_URL` para o endereço local da API, por exemplo:

```env
BACKEND_URL=http://localhost:3000
```

---

## ▶️ Como rodar o projeto em modo desenvolvimento

Depois de instalar tudo, rode:

```bash
npm run dev
```

O Quasar vai iniciar o projeto e abrir o navegador automaticamente.

Normalmente o endereço será algo parecido com:

```bash
http://localhost:9000
```

Se não abrir sozinho, copie o endereço que aparecer no terminal e cole no navegador.

---

## 🏗️ Como gerar a versão de produção

Quando quiser gerar a versão final para publicar em hospedagem, rode:

```bash
npm run build
```

O Quasar vai criar uma pasta chamada:

```bash
dist/spa
```

Essa pasta contém os arquivos finais otimizados para publicação.

---

## 🌐 Como publicar

O projeto já possui arquivos úteis para deploy:

- `public/_redirects`
- `public/netlify.toml`
- `public/robots.txt`
- `public/sitemap.xml`

### Deploy comum na Netlify

1. Faça o build:

```bash
npm run build
```

2. Envie a pasta abaixo para a Netlify:

```bash
dist/spa
```

3. Configure o domínio, se necessário.

O arquivo `_redirects` ajuda o site a não quebrar quando o usuário atualiza uma página interna, como `/catalogo` ou `/catalogo/produto/nome-do-produto`.

---

## 🧭 Rotas principais do sistema

| Rota | Página | Explicação |
|---|---|---|
| `/` | `IndexPage.vue` | Página inicial do site. |
| `/catalogo` | `CatalogoPage.vue` | Catálogo de produtos. |
| `/catalogo/produto/:slug` | `ProdutoPage.vue` | Página individual de um produto. |
| `/localizacao` | `LocHorarioPage.vue` | Página com localização e horários. |
| `/servicos-manutencao` | `ServicosManutencaoPage.vue` | Página de serviços/manutenção. |
| `/admin` | `AdminPage.vue` | Área administrativa. |
| `/:catchAll(.*)*` | `ErrorNotFound.vue` | Página exibida quando a rota não existe. |

Também existem várias rotas com foco em SEO apontando para a página de serviços, como:

- `/manutencao-lavadoras`
- `/manutencao-lavadoras-valparaiso`
- `/mangueiras-hidraulicas`
- `/crimpagem-de-mangueiras`
- `/manutencao-bombas-dagua`
- `/automacao-industrial`
- `/solda-tig`
- `/solda-mig`
- `/torno-mecanico`
- `/rebobinagem-de-motores`
- `/caminhao-munck`

Essas rotas ajudam o Google a encontrar o site por termos específicos de serviço e localização.

---

## 📁 Estrutura de pastas

```bash
FRONT-Eletronogueira-ia/
│
├── public/
│   ├── assets/
│   ├── icons/
│   ├── scripts/
│   ├── _redirects
│   ├── favicon.ico
│   ├── favicon.png
│   ├── furadeira.png
│   ├── logo.png
│   ├── netlify.toml
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── assets/
│   ├── boot/
│   │   ├── axios.js
│   │   ├── axios-ia.js
│   │   └── head.js
│   │
│   ├── components/
│   │   └── EssentialLink.vue
│   │
│   ├── composables/
│   ├── css/
│   ├── layouts/
│   │   └── LandingLayout.vue
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminPage.vue
│   │   ├── CatalogoPage.vue
│   │   ├── ErrorNotFound.vue
│   │   ├── IndexPage.vue
│   │   ├── LocHorarioPage.vue
│   │   ├── ProdutoPage.vue
│   │   └── ServicosManutencaoPage.vue
│   │
│   ├── router/
│   │   ├── index.js
│   │   └── routes.js
│   │
│   ├── stores/
│   │   ├── example-store.js
│   │   └── index.js
│   │
│   └── App.vue
│
├── .env
├── .gitignore
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── postcss.config.js
└── quasar.config.js
```

---

## 🧩 O que cada pasta faz?

### `public/`

Arquivos públicos do projeto.

Tudo que fica aqui pode ser acessado diretamente pelo navegador depois do build.

Exemplos:

- `logo.png`: logo do projeto.
- `favicon.ico` e `favicon.png`: ícone que aparece na aba do navegador.
- `robots.txt`: orienta mecanismos de busca, como o Google.
- `sitemap.xml`: lista páginas importantes para indexação no Google.
- `_redirects`: configuração importante para rotas funcionarem em hospedagens como Netlify.
- `netlify.toml`: configuração de redirecionamento de domínio na Netlify.

---

### `src/`

É onde fica o código principal do frontend.

Quase toda manutenção visual e funcional do site acontece dentro dessa pasta.

---

### `src/boot/`

Arquivos executados na inicialização do app.

| Arquivo | Função |
|---|---|
| `axios.js` | Configura o Axios com a URL principal da API usando `BACKEND_URL`. |
| `axios-ia.js` | Configura uma instância de Axios para API de IA. |
| `head.js` | Configura o gerenciamento de SEO/meta tags com `@unhead/vue`. |

---

### `src/components/`

Componentes reutilizáveis.

Componentes são blocos visuais que podem ser usados em várias páginas.

Exemplo:

- `EssentialLink.vue`: componente de link usado pelo template/base do Quasar.

---

### `src/composables/`

Pasta reservada para funções reutilizáveis com lógica do Vue.

Exemplo de uso comum:

- funções de SEO;
- funções de formatação;
- regras reutilizadas em várias telas.

---

### `src/css/`

Estilos globais do projeto.

Aqui ficam arquivos de CSS/SCSS aplicados em várias partes do site.

---

### `src/layouts/`

Layouts são estruturas que envolvem as páginas.

#### `LandingLayout.vue`

É o layout principal usado nas rotas do site.

Normalmente contém:

- cabeçalho;
- menu;
- área onde a página aparece;
- rodapé;
- estrutura visual geral.

---

### `src/pages/`

Páginas visíveis do sistema.

| Arquivo | Explicação |
|---|---|
| `IndexPage.vue` | Página inicial do site. |
| `CatalogoPage.vue` | Página de catálogo/listagem de produtos. |
| `ProdutoPage.vue` | Página de detalhes de um produto específico. |
| `LocHorarioPage.vue` | Página de localização e horário de atendimento. |
| `ServicosManutencaoPage.vue` | Página de serviços de manutenção e rotas de SEO. |
| `ErrorNotFound.vue` | Página exibida quando o usuário acessa uma rota inexistente. |
| `admin/AdminPage.vue` | Página administrativa do projeto. |

---

### `src/router/`

Controla as rotas do site.

| Arquivo | Explicação |
|---|---|
| `routes.js` | Lista quais URLs existem e qual página cada URL abre. |
| `index.js` | Cria o roteador do Vue e define o modo de navegação. |

---

### `src/stores/`

Pasta do Pinia, usado para estado global.

Estado global é uma informação compartilhada entre várias telas.

Exemplos comuns:

- carrinho;
- usuário logado;
- configurações;
- filtros globais.

No projeto atual existem:

- `index.js`: configura o Pinia.
- `example-store.js`: store de exemplo/base.

---

### `src/App.vue`

Arquivo raiz do app.

Ele é o ponto principal onde o Vue renderiza as rotas e layouts.

---

## 🗂️ Arquivos principais da raiz

### `package.json`

Arquivo que lista:

- nome do projeto;
- scripts de execução;
- dependências;
- versões aceitas do Node/npm/yarn.

Scripts principais:

```json
{
  "dev": "quasar dev",
  "build": "quasar build",
  "postinstall": "quasar prepare"
}
```

---

### `quasar.config.js`

Arquivo principal de configuração do Quasar.

Nele são definidos:

- arquivos de boot carregados ao iniciar o app;
- CSS global;
- ícones/fontes;
- modo de rota `history`;
- variáveis de ambiente;
- plugins do Quasar, como `Notify` e `Dialog`;
- configuração de build.

---

### `.env`

Arquivo com URLs e variáveis sensíveis/ambiente.

É usado para trocar endereços sem precisar mexer no código.

---

### `index.html`

Arquivo HTML base do projeto.

É o primeiro arquivo carregado pelo navegador antes do Vue montar a aplicação.

---

### `jsconfig.json`

Ajuda o editor de código a entender atalhos de importação, como `src/`, `pages/` e `layouts/`.

---

### `postcss.config.js`

Configuração relacionada ao processamento de CSS.

---

## 🧪 Comandos úteis

### Rodar em desenvolvimento

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

### Instalar dependências

```bash
npm install
```

### Reinstalar dependências do zero

Use quando o projeto estiver com erro estranho de pacote:

```bash
rm -rf node_modules package-lock.json
npm install
```

No Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

---

## 🛠️ Problemas comuns e soluções

### ❌ Erro: comando `quasar` não encontrado

Rode:

```bash
npm install
```

Depois tente novamente:

```bash
npm run dev
```

---

### ❌ A tela abriu, mas os produtos não carregam

Verifique se a variável `BACKEND_URL` no `.env` aponta para a API correta.

Exemplo produção:

```env
BACKEND_URL=https://api.eletronogueira.com.br
```

Exemplo local:

```env
BACKEND_URL=http://localhost:3000
```

Depois pare o servidor e rode de novo:

```bash
npm run dev
```

---

### ❌ Atualizei uma página e deu erro 404 na hospedagem

Isso geralmente acontece em projetos com rotas no modo `history`.

O arquivo abaixo resolve esse problema em hospedagens como Netlify:

```bash
public/_redirects
```

Conteúdo esperado:

```bash
/* /index.html 200
```

---

### ❌ Alterei o `.env`, mas nada mudou

Sempre que mudar o `.env`, pare o projeto e rode novamente:

```bash
npm run dev
```

---

## 📋 Fluxo de manutenção recomendado

1. Abra o projeto no VS Code.
2. Rode `npm install` se for a primeira vez.
3. Rode `npm run dev`.
4. Faça as alterações nas páginas dentro de `src/pages`.
5. Ajuste layout geral em `src/layouts/LandingLayout.vue`.
6. Ajuste chamadas de API em `src/boot/axios.js` ou nos arquivos que usam `api`.
7. Teste no navegador.
8. Gere build com `npm run build`.
9. Publique a pasta `dist/spa`.

---

## 🧑‍💻 Manutenção por tipo de alteração

| Quero alterar... | Onde mexer? |
|---|---|
| Página inicial | `src/pages/IndexPage.vue` |
| Catálogo | `src/pages/CatalogoPage.vue` |
| Tela de produto | `src/pages/ProdutoPage.vue` |
| Localização/horários | `src/pages/LocHorarioPage.vue` |
| Serviços de manutenção | `src/pages/ServicosManutencaoPage.vue` |
| Menu/topo/rodapé | `src/layouts/LandingLayout.vue` |
| Rotas/URLs | `src/router/routes.js` |
| URL da API | `.env` e `src/boot/axios.js` |
| SEO geral | `src/boot/head.js`, `public/sitemap.xml`, `public/robots.txt` |
| Imagens públicas | `public/` |
| Estilos globais | `src/css/` |

---

## 🚨 Cuidados importantes

- Não apague a pasta `src`, pois ela contém o código principal.
- Não edite `node_modules`, pois ela é gerada automaticamente.
- Não publique arquivos `.env` com senhas ou tokens secretos.
- Sempre rode `npm install` após baixar o projeto.
- Sempre reinicie o `npm run dev` após alterar variáveis no `.env`.
- Antes de publicar, sempre rode `npm run build`.

---

## ✅ Checklist para entregar/publicar

Antes de publicar, confira:

- [ ] O projeto roda com `npm run dev`.
- [ ] O catálogo abre corretamente.
- [ ] A página de produto abre corretamente.
- [ ] A localização está correta.
- [ ] Os serviços aparecem corretamente.
- [ ] A API configurada em `BACKEND_URL` está funcionando.
- [ ] O build roda sem erro com `npm run build`.
- [ ] A pasta `dist/spa` foi gerada.
- [ ] O domínio está apontando para a hospedagem correta.

---

## 🆘 Suporte

Caso algo não funcione, envie para o desenvolvedor:

1. Print do erro.
2. Texto que aparece no terminal.
3. Qual comando foi executado.
4. Qual página estava sendo acessada.
5. Se o backend estava ligado ou não.

Isso ajuda a resolver o problema mais rápido. ⚡
