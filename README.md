<p align="center">
  <img src="https://pomodoro-nuxt-ten.vercel.app/favicon.png" alt="Pomodoro Move.it" width="80" />
</p>

<h1 align="center">Pomodoro Move.it</h1>

<p align="center">
  Aplicação de Pomodoro gamificada com desafios de saúde e bem-estar
</p>

<p align="center">
  <a href="https://pomodoro-nuxt-ten.vercel.app">🚀 Live Demo</a>
  ·
  <a href="#features">✨ Features</a>
  ·
  <a href="docs/QUICK_SETUP.md">⚡ Quick Start</a>
  ·
  <a href="docs/SETUP_SECRETS.md">🔐 Secrets Setup</a>
  ·
  <a href="docs/API_DEPLOY_TROUBLESHOOTING.md">🛠️ API Deploy Guide</a>
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
- **Backend**: Hono 4.0 (Cloudflare Workers)
- **Database**: D1 (SQLite) + KV
- **Auth**: GitHub OAuth 2.0 + Email/Password
- **Deploy**: Vercel (frontend) + Cloudflare (API)
- **Monorepo**: Turborepo

---

## Quick Start

```bash
# Clone e instale
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt
npm install

# Frontend (localhost)
npm run dev

# API (Cloudflare Workers)
cd apps/api
npm run dev
```

📖 **Guia completo**: [docs/QUICK_SETUP.md](docs/QUICK_SETUP.md)

---

## Estrutura do Projeto

```
pomodoro-nuxt/
├── apps/
│   ├── web/          # Nuxt 3 Frontend
│   └── api/          # Hono API (Cloudflare Workers)
├── docs/             # Documentação
│   ├── QUICK_SETUP.md
│   ├── SETUP_SECRETS.md
│   └── API_DEPLOY_TROUBLESHOOTING.md
└── README.md
```

---

## Documentação

- 🚀 [Quick Setup Guide](docs/QUICK_SETUP.md) - Setup local e produção
- 🔐 [Secrets Configuration](docs/SETUP_SECRETS.md) - Configurar secrets GitHub/Cloudflare
- 🛠️ [API Deploy Guide](docs/API_DEPLOY_TROUBLESHOOTING.md) - Troubleshooting deploy API

---

## Contribuindo

1. Crie uma branch a partir de `develop`
2. Faça suas mudanças
3. Abra um PR para `develop`
4. Após aprovação, merge para `master` triggera o deploy

---

## Licença

MIT - Veja [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/Azincourt-tech">Azincourt-tech</a>
</p>
