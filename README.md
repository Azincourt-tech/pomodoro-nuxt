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

## Configuracao e Deploy

### Pre-requisitos
- Node.js 20+
- npm 10+
- Cloudflare Workers CLI (para API)
- Conta Vercel (para Frontend)

### 1. Instalacao

```bash
# Clonar repositorio
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Instalar dependencias
npm install
```

### 2. Variaveis de Ambiente

Copie `.env.example` para `.env` na raiz:

```bash
cp .env.example .env
```

#### Frontend (apps/web/.env)
```bash
# API URL
NUXT_PUBLIC_API_BASE=http://localhost:8787  # Desenvolvimento
# NUXT_PUBLIC_API_BASE=https://api.exemplo.com  # Producao

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID=seu-client-id
GITHUB_CLIENT_SECRET=seu-client-secret
```

#### API (apps/api/.env)
```bash
# GitHub OAuth
GITHUB_CLIENT_ID=seu-client-id
GITHUB_CLIENT_SECRET=seu-client-secret
GITHUB_REDIRECT_URI=http://localhost:8787/api/auth/github-callback

# JWT Secret
JWT_SECRET=sua-chave-secreta-aleatoria

# D1 Database ID
D1_DATABASE_ID=id-do-seu-database-d1
```

### 3. Desenvolvimento Local

#### Opcao A: Rodar Frontend e API juntos
```bash
# Terminal 1 - API
npm run dev:api

# Terminal 2 - Frontend
npm run dev:web
```

#### Opcao B: Rodar apenas Frontend (API mock)
```bash
npm run dev:web
```

Acesse: `http://localhost:3000`

#### Estrutura de Scripts
```bash
npm run dev           # Rodar frontend (web) em dev
npm run dev:api       # Rodar API (Cloudflare Workers) local
npm run dev:web       # Rodar apenas frontend
npm run build         # Build para producao (ambos)
npm run build:web     # Build apenas frontend
npm run build:api     # Build apenas API
npm run preview       # Preview do build frontend
npm run lint          # ESLint
npm run lint:fix      # ESLint com auto-fix
npm run format        # Prettier
npm run test          # Vitest run
npm run test:watch    # Vitest watch mode
```

---

## Deploy para Producao

### Frontend (Vercel)

#### Opcao 1: Deploy Automatico (Recomendado)
1. Conecte seu repositorio GitHub ao Vercel
2. Configure as variaveis de ambiente no painel do Vercel:
   - `NUXT_PUBLIC_API_BASE=https://sua-api.exemplo.com`
   - `GITHUB_CLIENT_ID` (se usar OAuth)
   - `GITHUB_CLIENT_SECRET`
3. Push para `master` ou `develop` dispara deploy automatico

#### Opcao 2: Deploy via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Opcao 3: Deploy Manual
```bash
cd apps/web
npm run build
vercel --prod
```

### API (Cloudflare Workers)

#### Configuracao Inicial
```bash
# Instalar Wrangler CLI
npm i -g wrangler

# Login no Cloudflare
wrangler login

# Criar D1 Database
wrangler d1 create pomodoro-db

# Anote o database_id gerado
```

#### Deploy da API
```bash
cd apps/api

# Configurar wrangler.toml com seu database_id
# [[d1_databases]]
# binding = "DB"
# database_name = "pomodoro-db"
# database_id = "seu-database-id-aqui"

# Deploy
npm run deploy
# ou
wrangler deploy
```

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

## Autores

- **Willian** - [@Azincourt-tech](https://github.com/Azincourt-tech)
- **Morgana** - [@Morgana-Claw](https://github.com/Morgana-Claw)

---

## Licenca

MIT - Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">Feito com ❤️ usando Nuxt 3 + TailwindCSS + DaisyUI</p>
