<p align="center">
  <img src="https://pomodoro-nuxt-ten.vercel.app/favicon.png" alt="Pomodoro Move.it" width="80" />
</p>

<h1 align="center">Pomodoro Move.it</h1>

<p align="center">
  Aplicacao de Pomodoro gamificada com desafios de saude e bem-estar
</p>

<p align="center">
  <a href="https://pomodoro-nuxt-ten.vercel.app">Live Demo</a>
  ·
  <a href="https://github.com/Azincourt-tech/pomodoro-nuxt/issues">Reportar Bug</a>
  ·
  <a href="https://github.com/Azincourt-tech/pomodoro-nuxt/issues">Sugerir Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxtdotjs" />
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/DaisyUI-4-5A0EF8?style=flat-square" />
  <img src="https://img.shields.io/badge/Pinia-2-FBE334?style=flat-square" />
  <img src="https://img.shields.io/badge/Cloudflare%20Workers-F6821F?style=flat-square&logo=cloudflare" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/Lucide-Icons-orange?style=flat-square" />
</p>

---

## Sobre

Pomodoro Move.it e uma aplicacao que combina a tecnica Pomodoro com desafios de saude e bem-estar. A cada ciclo completado, voce recebe um desafio para alongar, descansar os olhos, se hidratar ou praticar respiracao. Agora com PWA, sync na nuvem, historico de sessoes, interface moderna com glassmorphism e muito mais.

---

## Versao 2.0 - Novidades

- **Design Moderno**: Glassmorphism, gradientes vibrantes e animacoes suaves em todos componentes
- **Icones Lucide**: Integracao completa com biblioteca Lucide Icons para iconografia consistente
- **Timer Aprimorado**: Barra de progresso com gradientes dinamicos, brilho adaptativo por tema e animacoes
- **Modais Modernizados**: Challenge, Shortcuts, Share, Edit Profile com design premium
- **Login Seguro**: Sistema de autenticao com feedback visual de forca de senha e dicas de seguranca
- **Historico Visual**: Tela de historio com cards estatisticos e glassmorphism
- **Responsivo**: Navbar e footer otimizados para mobile e desktop
- **UX Aprimorada**: Toasts de feedback, hover effects avancados e transicoes fluidas

---

## Monorepo Structure

```
pomodoro-nuxt/
├── apps/
│   ├── web/                   # Nuxt 3 Frontend
│   │   ├── components/        # Vue components (atoms/molecules/organisms)
│   │   │   ├── atoms/         # Atomic components (Icon, TimerPresets, etc)
│   │   │   ├── molecules/     # Composite components (Countdown, Profile, etc)
│   │   │   └── organisms/     # Complex components
│   │   ├── composables/       # useSound, useToast, usePwaInstall
│   │   ├── stores/            # Pinia stores (countdown, challenges, profile, history, theme)
│   │   ├── pages/             # index, history, login
│   │   ├── layouts/           # default layout com navbar e footer
│   │   ├── public/icons/      # PWA icons
│   │   └── tests/             # Vitest unit tests
│   └── api/                   # Hono API (Cloudflare Workers)
├── package.json               # Workspace root
└── turbo.json                 # Turborepo config
```

---

## Tech Stack

### Frontend
- **Framework**: Nuxt 3.15+ (Vue 3.5)
- **UI**: TailwindCSS 3.4 + DaisyUI 4.12
- **Icons**: Lucide Icons via @iconify/vue
- **State**: Pinia 2.3
- **i18n**: Vue I18n 9.5
- **PWA**: @vite-pwa/nuxt 1.1
- **Testing**: Vitest 4.1

### Backend
- **API**: Hono 4.0 (Cloudflare Workers)
- **Database**: D1 (SQLite)
- **Auth**: GitHub OAuth 2.0 + Email/Password

### DevOps
- **Hosting**: Vercel (frontend) + Cloudflare (API)
- **Monorepo**: Turborepo
- **Package Manager**: npm

---

## Features

### Core
- **Timer Pomodoro**: Configuravel com presets (5-60min) e tempo customizado
- **Desafios de Saude**: 50+ desafios categorizados (alongamento, olhos, hidratacao, respiracao, postura, meditacao, caminhada)
- **Sistema de XP e Level**: Gamificacao com progressao por niveis
- **Streaks**: Acompanhamento de sequencia diaria
- **PWA**: Instalavel como app nativo (mobile/desktop)
- **Offline**: Service worker para funcionamento offline

### Moderno
- **Glassmorphism**: Efeitos de blur e transparencia em cards e modais
- **Gradientes Vibrantes**: Cores dinamicas que se adaptam ao tema
- **Animacoes Suaves**: Transicoes fluidas em toda interface
- **Responsivo**: Layout otimizado para mobile, tablet e desktop
- **Temas**: 10+ temas DaisyUI (light, dark, cyberpunk, dracula, etc)

### Seguranca
- **Autenticacao**: GitHub OAuth ou Email/Password
- **Password Strength**: Feedback visual de forca de senha com dicas
- **Validacao em Tempo Real**: Icons de check/x para validacao instantanea

---

## Configuracao do Projeto

### Pre-requisitos
- Node.js 20+
- npm 10+
- Wrangler CLI (para API Cloudflare): `npm install -g wrangler`
- Vercel CLI (opcional): `npm install -g vercel`

### 1. Instalacao

```bash
# Clonar repositorio
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Instalar dependencias
npm install
```

---

## Ambiente de Desenvolvimento (Localhost)

> **IMPORTANTE**: Este ambiente roda 100% localmente. Nenhum dado de producao e acessado.

### 2.1 Configuracao do Frontend Local

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite `.env` com as configuracoes locais:

```bash
# Frontend (Nuxt)
NUXT_PUBLIC_API_BASE=http://localhost:8787
```

### 2.2 Configuracao da API Local (Cloudflare Workers)

#### Passo 1: Autenticar no Cloudflare

```bash
# Fazer login (necessario mesmo para desenvolvimento local)
wrangler login
```

> **Nota**: O login e necessario porque o Wrangler precisa autenticar para criar recursos locais.

#### Passo 2: Criar Banco de Dados D1

```bash
# Criar database D1
wrangler d1 create pomodoro-db
```

Você vera algo como:

```bash
✅ Successfully created DB 'pomodoro-db' with ID 84f5543d-e0b0-45cd-96e1-0d55f8c620bf
```

**Copie o `database_id` gerado** (ex: `84f5543d-e0b0-45cd-96e1-0d55f8c620bf`).

#### Passo 3: Criar Namespace KV

```bash
# Criar namespace KV
wrangler kv:namespace create "pomodoro-kv"
```

Você vera algo como:

```bash
✅ Successfully created namespace 'pomodoro-kv' with ID a1b2c3d4e5f6789012345678901234ab
```

**Copie o `id` gerado** (ex: `a1b2c3d4e5f6789012345678901234ab`).

#### Passo 4: Configurar wrangler.toml

```bash
# Copiar template
cp apps/api/wrangler.toml.example apps/api/wrangler.toml
```

Edite `apps/api/wrangler.toml` e substitua os placeholders pelos IDs reais:

```toml
name = "pomodoro-api"
main = "src/index.ts"
compatibility_date = "2024-11-01"

[[d1_databases]]
binding = "DB"
database_name = "pomodoro-db"
database_id = "84f5543d-e0b0-45cd-96e1-0d55f8c620bf"  # ← Cole o ID do D1

[[kv_namespaces]]
binding = "KV"
id = "a1b2c3d4e5f6789012345678901234ab"  # ← Cole o ID do KV
```

> **IMPORTANTE**: Estes IDs sao unicos para o SEU ambiente. Use os IDs que voce obteve nos passos 2 e 3.

#### Passo 5: Aplicar Schema do Banco (Opcional)

Se o projeto tiver migrations SQL:

```bash
# Aplicar schema localmente
wrangler d1 execute pomodoro-db --local --file=./migrations/001_init.sql

# Ou se houver um comando npm:
npm run db:migrate:local
```

#### Passo 2: Configurar Secrets Locais

Crie `apps/api/.dev.vars` (arquivo de secrets para desenvolvimento local):

```bash
cat > apps/api/.dev.vars << 'EOF'
GITHUB_CLIENT_ID=seu_client_id_aqui
GITHUB_CLIENT_SECRET=seu_client_secret_aqui
BETTER_AUTH_SECRET=chave_secreta_minimo_32_caracteres_aqui
EOF
```

Proteja o arquivo:

```bash
chmod 600 apps/api/.dev.vars
```

> **Seguranca**: `.dev.vars` ja esta no `.gitignore` para evitar que va para o repositorio.

### 2.3 Rodar o Projeto Localmente

**Terminal 1 - API Cloudflare (localhost:8787):**
```bash
cd apps/api
wrangler dev
```

**Terminal 2 - Frontend Nuxt (localhost:3000):**
```bash
cd apps/web
npm run dev
```

Acesse: **http://localhost:3000**

### 2.4 Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm run dev           # Turborepo: tenta rodar ambos
npm run dev:api       # Apenas API (wrangler dev)
npm run dev:web       # Apenas Frontend (nuxt dev)

# Qualidade de codigo
npm run lint          # ESLint
npm run lint:fix      # ESLint com auto-fix
npm run format        # Prettier
npm run test          # Vitest (testes unitarios)
npm run test:watch    # Vitest watch mode

# Verificar se esta rodando
curl http://localhost:8787/health  # Testar API
curl http://localhost:3000         # Testar Frontend
```

---

## Deploy para Producao

> **IMPORTANTE**: Este ambiente usa servicos reais da nuvem (Cloudflare + Vercel). Dados reais sao armazenados.

### 3.1 Frontend (Vercel)

#### Opcao 1: Deploy Automatico via GitHub (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e conecte seu repositorio GitHub
2. Configure as variaveis de ambiente no painel do Vercel:
   - `NUXT_PUBLIC_API_BASE=https://sua-api.exemplo.com` (URL da API em producao)
   - `GITHUB_CLIENT_ID` (se usar OAuth)
   - `GITHUB_CLIENT_SECRET` (se usar OAuth)
3. Push para `master` dispara deploy automatico

#### Opcao 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

### 3.2 API (Cloudflare Workers)

#### Passo 1: Configurar Secrets na Producao

```bash
cd apps/api

# Adicionar secrets criptografados no Cloudflare
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

#### Passo 2: Deploy da API

```bash
# Deploy para producao
npm run deploy

# Ou diretamente
wrangler deploy
```

#### Verificar Deploy

```bash
# Testar endpoint de health
curl https://sua-api.exemplo.com/health

# Verificar se OAuth GitHub esta habilitado
curl https://sua-api.exemplo.com/api/auth/github-enabled

# Ver logs em tempo real
wrangler tail
```

### 3.3 Variaveis de Ambiente de Producao

#### Frontend (Vercel)
Configure no painel do Vercel:
- `NUXT_PUBLIC_API_BASE`: URL da API em producao (ex: `https://api.exemplo.com`)

#### API (Cloudflare)
Configure via `wrangler secret put`:
- `BETTER_AUTH_SECRET`: Chave secreta de autenticacao (min 32 caracteres)
- `GITHUB_CLIENT_ID`: Client ID do GitHub OAuth
- `GITHUB_CLIENT_SECRET`: Client Secret do GitHub OAuth

O `wrangler.toml` deve conter os IDs reais dos recursos Cloudflare:
- `database_id` do D1
- `id` do KV namespace

---

#### Variaveis de Ambiente no Cloudflare
```bash
# Adicionar secrets
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put JWT_SECRET

# Configurar D1 bindings no wrangler.toml
```

### 4. Verificacao Pos-Deploy

#### Frontend
```bash
# Testar URL de producao
curl https://sua-app.vercel.app

# Verificar PWA
# Acesse o site e verifique se o service worker esta ativo
# Chrome DevTools > Application > Service Workers
```

#### API
```bash
# Testar endpoint health
curl https://sua-api.exemplo.com/health

# Testar OAuth GitHub
curl https://sua-api.exemplo.com/api/auth/github-enabled
```

### 5. Troubleshooting

#### Erro: API não conecta no frontend
- Verifique se `NUXT_PUBLIC_API_BASE` esta correto
- Development: `http://localhost:8787`
- Producao: `https://sua-api.exemplo.com`

#### Erro: GitHub OAuth falha
- Verifique se `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` estao corretos
- Confirme o redirect URI no GitHub Developer Settings:
  - Development: `http://localhost:8787/api/auth/github-callback`
  - Producao: `https://sua-api.exemplo.com/api/auth/github-callback`

#### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Erro de Deploy Cloudflare
```bash
# Verificar wrangler.toml
# Confirmar database_id correto
# Verificar bindings configurados

wrangler deploy --dry-run  # Testar sem deploy
wrangler tail              # Ver logs em tempo real
```

#### Erros Comuns - Desenvolvimento Local (Cloudflare Workers)

##### Wrangler nao inicia
```bash
# Verificar versao do Wrangler
wrangler --version  # Deve ser 3.x ou superior

# Reinstalar se necessario
npm install -g wrangler@latest

# Limpar cache
rm -rf .wrangler/
wrangler dev
```

##### Erro de autenticacao
```bash
# Re-autenticar
wrangler logout
wrangler login

# Verificar conta
wrangler whoami
```

##### Erro de D1 database
```bash
# Verificar se database existe
wrangler d1 list

# Se database_id esta incorreto no wrangler.toml:
# 1. Criar novo database
wrangler d1 create pomodoro-db

# 2. Copiar o database_id gerado
# 3. Colar no wrangler.toml

# Aplicar schema localmente
wrangler d1 execute pomodoro-db --local
```

##### Erro de KV namespace
```bash
# Listar namespaces
wrangler kv:namespace list

# Se precisar criar novo:
wrangler kv:namespace create "MY_KV"

# Copiar o ID e atualizar wrangler.toml
```

##### Erro: "Module not found" na API
```bash
# Verificar se dependencias estao instaladas
cd apps/api
npm install

# Rebuild se necessario
npm run build
```

##### Erro de .dev.vars
```bash
# Verificar se arquivo existe
ls -la apps/api/.dev.vars

# Verificar permissões
chmod 600 apps/api/.dev.vars

# Verificar se esta no .gitignore
grep "\.dev\.vars" .gitignore  # Deve retornar resultado
```

##### Frontend nao conecta com API local
```bash
# 1. Verificar se API esta rodando
curl http://localhost:8787/health

# 2. Verificar NUXT_PUBLIC_API_BASE no .env
grep "NUXT_PUBLIC_API_BASE" .env
# Deve ser: NUXT_PUBLIC_API_BASE=http://localhost:8787

# 3. Reiniciar Nuxt dev server
# Ctrl+C e npm run dev:web
```

##### Erro de CORS
```bash
# Verificar se a API esta configurada para aceitar localhost
# Em apps/api/src/index.ts, verificar headers CORS:
# Access-Control-Allow-Origin: *

# Em desenvolvimento, permita todas as origens
```

---

## Seguranca

### Arquivos Ignorados

Os seguintes arquivos sao ignorados pelo Git por conterem informacoes sensiveis:

- `.env` - Variaveis de ambiente com chaves secretas
- `wrangler.toml` - IDs do Cloudflare D1 e KV namespaces
- `.dev.vars` - Variaveis locais do Cloudflare Workers
- `.wrangler/` - Cache e estado local do Wrangler
- `node_modules/` - Dependencias instaladas

### Segredos que NAO devem estar no repositorio

#### Frontend
- `VITE_VAPID_PUBLIC_KEY` - Chave publica de push notifications
- OAuth credentials (se configuradas localmente)

#### API (Cloudflare Workers)
- `BETTER_AUTH_SECRET` - Chave secreta de autenticacao (min. 32 chars)
- `GITHUB_CLIENT_SECRET` - Secret do OAuth GitHub
- `D1_DATABASE_ID` - ID do banco de dados Cloudflare D1
- `KV_NAMESPACE_ID` - ID do namespace KV
- JWT secrets
- API keys de servicos externos

### Configuracao Segura de Secrets

#### Cloudflare Workers (Recomendado)
```bash
# Adicionar secrets via Wrangler (criptografados)
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# Verificar secrets configurados
wrangler secret list
```

#### Frontend (Vercel)
```bash
# Configurar via painel do Vercel
# Settings > Environment Variables
# NUXT_PUBLIC_API_BASE
# GITHUB_CLIENT_ID (se necessario)
```

### Melhores Praticas

1. **NUNCA commite arquivos `.env`** - Use `.env.example` como template
2. **Use secrets do Cloudflare** - Nao hardcode secrets no codigo
3. **Gire chaves regularmente** - Especialmente secrets de autenticacao
4. **Revogue chaves expostas** - Se algum secret vazar, rotate imediatamente
5. **Use variaveis de ambiente** - Nao escreva secrets no codigo fonte
6. **wrangler.toml.example** - Use o template e configure localmente

### Se um Secret Vazar

1. Revogue a chave/secret imediatamente no provedor
2. Gire todas as chaves relacionadas
3. Adicione o arquivo ao `.gitignore` se ainda nao estiver
4. Use `git rm --cached` para remover do historico Git
5. Considere usar ferramentas como `git-secrets` ou `trufflehog`

```bash
# Remover arquivo sensivel do historico Git (se commitado acidentalmente)
git rm --cached apps/api/wrangler.toml
git commit -m "security: remover arquivo sensivel"
git push
```

---

## Branches

- `master` - Producao (estavel)
- `develop` - Desenvolvimento (integracao)
- `feature/*` - Features em desenvolvimento

---

## Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudancas (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request para `develop`

---

## Solucao para Problemas de Deploy da API Cloudflare

### Problema: Deploy falhando com "Missing entry-point"

**Causa:** O Vercel esta tentando executar `npx wrangler build` como parte do build do frontend, mas:
- `wrangler build` foi **deprecated** (desde wrangler 3.x)
- A API Cloudflare **nao deve ser buildada pelo Vercel** - ela precisa de deploy manual
- Cada branch esta fazendo deploy por configuracao do Vercel

### Solucao:

#### 1. Corrigir o comando de build (se necessario)

Se voce ainda quiser que o Vercel tente algo relacionado ao wrangler, use:

```bash
# Em vercel.json (opcional, nao recomendado)
"buildCommand": "cd apps/web && npm run build && echo \"API Cloudflare precisa de deploy manual\""
```

**Recomendacao**: Remover qualquer referencia ao wrangler do vercel.json - o frontend nao precisa buildar a API.

#### 2. Deploy Manual da API Cloudflare (Obrigatorio)

A API Cloudflare Workers **NAO** pode ser deployada automaticamente por build scripts porque:
- Precisa de autenticacao com o Cloudflare (wrangler login)
- Precisa de secrets configurados (wrangler secret put)
- Precisa de wrangler.toml com IDs reais (nao commitados por seguranca)

**Como deployar corretamente:**

```bash
# Terminal - API Cloudflare
cd apps/api

# 1. Autenticar (uma vez)
wrangler login

# 2. Configurar secrets (uma vez por ambiente)
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# 3. Copiar template e configurar IDs locais
cp wrangler.toml.example wrangler.toml
# Editar wrangler.toml com seus database_id e kv_namespace_id

# 4. Deploy para producao
wrangler deploy

# 5. Ver deploy
wrangler tail  # Logs em tempo real
```

#### 3. Configurar o Vercel para Deploy Apenas do Frontend

Para evitar que branches nao-mestre facem deploy:

**No painel do Vercel:**
1. Acesse seu projeto -> Settings -> Git
2. Em "Production Branches": deixe apenas `master` (ou `main`)
3. Em "Preview Branches": deixe vazio ou especifique apenas branches que voce quer preview
4. Em "Ignore Build Steps": pode deixar como esta

**Resultado:**
- Apenas pushes para `master` triggeram deploy do frontend
- Nenhum deploy automatico da API Cloudflare (porque nao ha comando de build para ela)
- Deploy da API Cloudflare sempre sera **manual** via `wrangler deploy`

---

## Autores

- **Willian** - [@Azincourt-tech](https://github.com/Azincourt-tech)
- **Morgana** - [@Morgana-Claw](https://github.com/Morgana-Claw)

---

## Licenca

MIT - Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">Feito com ❤️ usando Nuxt 3 + TailwindCSS + DaisyUI</p>
