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

## Como Rodar

### Pre-requisitos
- Node.js 20+
- npm 10+

### Instalacao

```bash
# Clonar repositorio
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Instalar dependencias
npm install

# Rodar em desenvolvimento
npm run dev

# Build para producao
npm run build

# Preview do build
npm run preview
```

### Variaveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# API URL (Cloudflare Workers)
NUXT_PUBLIC_API_BASE=http://localhost:8787

# GitHub OAuth
GITHUB_CLIENT_ID=seu-client-id
GITHUB_CLIENT_SECRET=seu-client-secret
```

---

## Scripts

```bash
npm run dev          # Rodar frontend em dev
npm run build        # Build para producao
npm run preview      # Preview do build
npm run lint         # ESLint
npm run lint:fix     # ESLint com auto-fix
npm run format       # Prettier
npm run test         # Vitest run
npm run test:watch   # Vitest watch mode
```

---

## Estrutura de Components

### Atoms
- `Icon.vue` - Wrapper para icones Lucide
- `CountdownDigits.vue` - Digitos do timer
- `TimerPresets.vue` - Presets de tempo
- `ExperienceBar.vue` - Barra de XP e level
- `ToastContainer.vue` - Notificacoes toast
- `ThemeSelector.vue` - Seletor de temas
- `LanguageSelector.vue` - Seletor de idioma

### Molecules
- `Countdown.vue` - Timer circular com progresso
- `Challenge.vue` - Card de desafio
- `Profile.vue` - Perfil do usuario
- `ShareCard.vue` - Card de compartilhamento com canvas
- `ShortcutsHelp.vue` - Modal de atalhos
- `EditProfileModal.vue` - Modal de edicao de perfil

---

## Deploy

### Frontend (Vercel)
1. Push para branch `develop` ou `master`
2. Vercel detecta automaticamente
3. Build e deploy automatico

### API (Cloudflare Workers)
```bash
cd apps/api
npm run deploy
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
