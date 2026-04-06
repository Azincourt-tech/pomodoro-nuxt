<p align="center">
  <img src="https://pomodoro-nuxt-ten.vercel.app/favicon.png" alt="Pomodoro Move.it" width="80" />
</p>

<h1 align="center">Pomodoro Move.it</h1>

<p align="center">
  Aplicação de Pomodoro gamificada com desafios de saúde e bem-estar
</p>

<p align="center">
  <a href="https://pomodoro-nuxt-ten.vercel.app">🚀 Live Demo</a> ·
  <a href="#features">✨ Features</a> ·
  <a href="#quick-start">⚡ Quick Start</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxtdotjs" />
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/DaisyUI-4-5A0EF8?style=flat-square" />
  <img src="https://img.shields.io/badge/Pinia-2-FBE334?style=flat-square" />
  <img src="https://img.shields.io/badge/Cloudflare%20Workers-F6821F?style=flat-square&logo=cloudflare" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel" />
</p>

---

## Sobre

Pomodoro Move.it combina a técnica Pomodoro com desafios de saúde e bem-estar. A cada ciclo completado, você recebe um desafio para alongar, descansar os olhos, se hidratar ou praticar respiração.

**Versão 2.0** traz design moderno com glassmorphism, ícones Lucide, PWA, sincronização na nuvem, histórico de sessões e muito mais.

---

## Features

### 🎯 Core
- **Timer Pomodoro** configurável (5-60min) com presets
- **50+ Desafios** categorizados (alongamento, olhos, hidratação, respiração, postura, meditação)
- **Sistema de XP e Level** com progressão por níveis
- **Streaks** - Acompanhamento de sequência diária
- **PWA** - Instalável como app nativo
- **Offline** - Funciona sem internet

### 🎨 Design Moderno
- **Glassmorphism** - Efeitos de blur e transparência
- **Gradientes Vibrantes** - Cores dinâmicas adaptativas
- **Animações Suaves** - Transições fluidas
- **10+ Temas** - Light, Dark, Cyberpunk, Dracula, etc
- **Responsivo** - Mobile, tablet e desktop

### 🔐 Segurança
- **GitHub OAuth** + Email/Password
- **Password Strength** - Feedback visual de força de senha
- **Validação em Tempo Real** - Check/x instantâneo

---

## Tech Stack

- **Frontend**: Nuxt 3.15+ (Vue 3.5) + TailwindCSS + DaisyUI
- **Icons**: Lucide Icons via @iconify/vue
- **State**: Pinia 2.3
- **Backend**: Hono 4.0 (Cloudflare Workers emulado local)
- **Database**: D1 (SQLite emulado) + KV (emulado)
- **Auth**: GitHub OAuth 2.0 + Email/Password
- **Deploy**: Vercel (frontend) + Cloudflare (API, opcional)
- **Monorepo**: Turborepo

---

## Quick Start

### Desenvolvimento Local

```bash
# Clone
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Setup automatizado
./setup-localhost.sh

# Ou manual
npm install

# Terminal 1: API (wrangler dev - emulado)
cd apps/api
npm run dev

# Terminal 2: Frontend
cd apps/web
npm run dev
```

📖 **Guia completo**: [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)

---

## Estrutura

```
pomodoro-nuxt/
├── apps/
│   ├── web/          # Nuxt 3 Frontend
│   └── api/          # Hono API (Workers emulado)
├── docs/
│   ├── LOCAL_SETUP.md       # Setup local (wrangler dev)
│   └── SETUP_SECRETS.md     # Boas práticas de segurança
└── README.md
```

---

## Documentação

- 🚀 [**LOCAL_SETUP.md**](docs/LOCAL_SETUP.md) - Setup local completo
- 🔐 [**SETUP_SECRETS.md**](docs/SETUP_SECRETS.md) - Segurança

> ⚠️ **Importante**: Este repositório é público. **Nunca exponha credenciais** (tokens, IDs, secrets).

---

## Scripts

```bash
npm run dev           # Turborepo (API + Web)
npm run dev:web       # Apenas frontend
npm run dev:api       # Apenas API
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Vitest
```

---

## Contribuindo

1. Crie branch de `develop`
2. Faça mudanças
3. Abra PR para `develop`
4. Após aprovação, merge para `master`

---

## Licença

MIT - Veja [LICENSE](LICENSE).

---

<p align="center">Feito com ❤️ por <a href="https://github.com/Azincourt-tech">Azincourt-tech</a></p>
