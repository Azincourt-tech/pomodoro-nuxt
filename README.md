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
</p>

---

## Sobre

Pomodoro Move.it e uma aplicacao que combina a tecnica Pomodoro com desafios de saude e bem-estar. A cada ciclo completado, voce recebe um desafio para alongar, descansar os olhos, se hidratar ou praticar respiracao. Agora com PWA, sync na nuvem, historico de sessoes e muito mais.

---

## Monorepo Structure

```
pomodoro-nuxt/
├── apps/
│   ├── web/                   # Nuxt 3 Frontend
│   │   ├── components/        # Vue components (atoms/molecules/organisms)
│   │   ├── composables/       # useKeyboardShortcuts, useSound, etc.
│   │   ├── stores/            # Pinia stores (countdown, challenges, profile, history, theme)
│   │   ├── pages/             # index, history
│   │   ├── layouts/           # default
│   │   ├── public/icons/      # PWA icons (192x192, 512x512)
│   │   └── tests/             # Vitest unit tests
│   └── api/                   # Hono API (Cloudflare Workers)
│       ├── src/routes/        # profile, sessions, stats
│       ├── src/db/            # D1 schema
│       └── tests/             # Vitest API tests
├── composables/
│   └── useSync.ts             # Cloud sync composable
├── packages/
│   └── types/                 # Tipos compartilhados
└── turbo.json                 # Turborepo config
```

---

## Funcionalidades

### Core
- **Timer Pomodoro** com presets (15, 25, 35, 45, 60 min) e tempo personalizado
- **27 desafios** em 7 categorias diferentes (alongamento, exercicio ocular, hidratacao, respiracao, postura, meditacao, caminhada)
- **Sistema de XP e niveis** gamificado para manter a motivacao
- **10 temas** do DaisyUI (dark, light, cupcake, dracula, etc.)
- **Spotify integrado** para ouvir musica enquanto trabalha
- **Perfil editavel** com suporte a GitHub avatar
- **Persistencia** via localStorage (progresso salvo automaticamente)
- **Notificacoes** browser quando o ciclo termina
- **Design responsivo** (desktop e mobile)

### Novas Features (v2.0)

- **PWA** — App instalavel com manifest, service worker (Workbox), e icons (192/512). Funciona offline
- **Atalhos de Teclado** — `Espaco` play/pause, `R` reset, `N` novo desafio, `F` modo foco, `?` ajuda
- **Historico de Sessoes** — Timeline completa com estatisticas (total sessoes, tempo, XP, media diaria)
- **Streak** — Contador de dias consecutivos com melhor recorde
- **Cloud Sync** — API Hono no Cloudflare Workers com D1. Sync de profile, sessoes e progresso entre dispositivos
- **Compartilhar** — ShareCard com Canvas API para gerar imagem de estatisticas e compartilhar via Web Share API
- **Sons** — Efeitos sonoros para start, pause e complete (MP3)
- **Modo Foco** — Fullscreen browser com elementos ocultos, saida via ESC

---

## Stack Tecnologica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | [Nuxt 3](https://nuxt.com/) + Vue 3 |
| **State** | [Pinia](https://pinia.vuejs.org/) |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) |
| **PWA** | [@vite-pwa/nuxt](https://vite-pwa.netlify.app/) + Workbox |
| **i18n** | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (pt-BR, en) |
| **API** | [Hono](https://hono.dev/) (Cloudflare Workers) |
| **Database** | [Cloudflare D1](https://developers.cloudflare.com/d1/) |
| **Monorepo** | [Turborepo](https://turbo.build/) |
| **Language** | [TypeScript](https://typescriptlang.org/) |
| **Testing** | [Vitest](https://vitest.dev/) + happy-dom |
| **Package Manager** | Bun |

---

## Setup Local

### Requisitos

- [Bun](https://bun.sh/) >= 1.2
- [Node.js](https://nodejs.org/) >= 18

### Instalacao

```bash
# Clonar o repositorio
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Instalar dependencias (monorepo)
bun install

# Iniciar Web (Nuxt dev server)
cd apps/web && bun run dev

# Em outro terminal, iniciar API (Cloudflare Workers)
cd apps/api && bun run dev
```

Web: `http://localhost:3000` | API: `http://localhost:8787`

### Build

```bash
# Build tudo via Turborepo
bun run build

# Ou individualmente
cd apps/web && bun run build
cd apps/api && bun run build
```

---

## Testes

```bash
# Todos os testes (Turborepo)
bun run test

# Apenas Web (64 testes)
cd apps/web && bun run test

# Apenas API (4 testes)
cd apps/api && bun run test
```

**68 testes passando** (9 arquivos: 8 web + 1 api)

---

## Deploy

### Web — Vercel

Deploy automatico via Git:

| Branch | Ambiente | URL |
|--------|----------|-----|
| `develop` | Preview | Vercel preview URL |
| `master` | Producao | [pomodoro-nuxt-ten.vercel.app](https://pomodoro-nuxt-ten.vercel.app) |

Tambem suporta Cloudflare Pages via `wrangler pages deploy .output/public`.

### API — Cloudflare Workers

```bash
cd apps/api

# Configurar D1 database
wrangler d1 migrations apply pomodoro-db --remote

# Deploy
bun run deploy
```

---

## Atalhos de Teclado

| Tecla | Acao |
|-------|------|
| `Espaco` | Iniciar / Pausar timer |
| `R` | Resetar timer |
| `N` | Proximo desafio |
| `F` | Modo Foco (fullscreen) |
| `?` | Mostrar ajuda de atalhos |

*Atalhos desabilitados quando um input esta focado.*

---

## Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Azincourt-tech">
        <img src="https://github.com/Azincourt-tech.png" width="80px" alt="Willian"/>
        <br />
        <sub><b>Willian</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Morgana-Claw">
        <img src="https://github.com/Morgana-Claw.png" width="80px" alt="Morgana"/>
        <br />
        <sub><b>Morgana</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## Licenca

MIT
