<p align="center">
  <img src="https://pomodoro-nuxt-ten.vercel.app/favicon.png" alt="Pomodoro Move.it" width="80" />
</p>

<h1 align="center">Pomodoro Move.it</h1>

<p align="center">
  Gamified Pomodoro app with health challenges, Spotify integration, and Picture-in-Picture mode
</p>

<p align="center">
  <a href="https://pomodoro-nuxt-ten.vercel.app">Live Demo</a>
  &middot;
  <a href="https://github.com/Azincourt-tech/pomodoro-nuxt/issues">Report Bug</a>
  &middot;
  <a href="https://github.com/Azincourt-tech/pomodoro-nuxt/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxtdotjs" />
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/DaisyUI-4-5A0EF8?style=flat-square" />
  <img src="https://img.shields.io/badge/Pinia-2-FBE334?style=flat-square" />
  <img src="https://img.shields.io/badge/i18n-PT%20%2F%20EN-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Tests-50%20passing-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel" />
</p>

---

## About

Pomodoro Move.it is a gamified Pomodoro application that combines the Pomodoro technique with health and wellness challenges. After each completed cycle, you receive a challenge to stretch, rest your eyes, hydrate, or practice breathing exercises.

## Features

### Core
- **Pomodoro Timer** with presets (15, 25, 35, 45, 60 min) and custom time input
- **27 challenges** across 7 categories (stretching, eye exercises, hydration, breathing, posture, meditation, walking)
- **XP and leveling system** for sustained motivation
- **10 DaisyUI themes** (dark, light, cupcake, dracula, etc.) with dark mode as default

### Integration
- **Spotify integration** - paste a playlist/album/track URL and listen while working
- **Picture-in-Picture (PiP)** - floating timer window that inherits the current DaisyUI theme
- **Browser notifications** when a cycle ends

### Internationalization
- **i18n support** with PT-BR (default) and EN locales
- Language selector in navbar
- Language preference persisted in localStorage

### UX
- **Editable profile** with GitHub avatar support
- **localStorage persistence** (progress saved automatically)
- **Responsive design** (desktop sidebar layout + mobile)
- **Modern UI** with cards, smooth shadows, and transitions

### Dev Experience
- **ESLint** with @nuxt/eslint-config (flat config)
- **Prettier** for code formatting
- **Vitest** unit tests (50 tests across stores and components)
- **Conventional Commits** for commit history

### Challenges Available

| Category | Count | Example |
|----------|-------|---------|
| Stretching | 8 | Stretch your arms and legs |
| Eye Exercises | 3 | Rest your eyes for 2 min |
| Hydration | 2 | Drink a glass of water |
| Breathing | 3 | Deep breathing exercise |
| Posture | 3 | Adjust your posture |
| Quick Meditation | 3 | 1-min meditation |
| Walking | 3 | Walk for 1 min |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) |
| State | [Pinia](https://pinia.vuejs.org) |
| Styling | [TailwindCSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org) |
| Language | [TypeScript](https://typescriptlang.org) |
| Testing | [Vitest](https://vitest.dev) + @vue/test-utils |
| Linting | [ESLint](https://eslint.org) + [Prettier](https://prettier.io) |
| Deploy | [Vercel](https://vercel.com) |

---

## Setup

```bash
# Clone the repository
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the build
npm run preview
```

The app will be available at `http://localhost:3000`

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run test         # Run Vitest unit tests
```

---

## Project Structure

```
pomodoro-nuxt/
├── assets/
│   ├── challenges/    # Challenge data (27 challenges, 7 categories)
│   └── css/           # Global styles
├── components/
│   ├── atoms/         # Basic components (CountdownDigits, ExperienceBar)
│   ├── molecules/     # Composite components
│   └── organisms/     # Complex components
├── i18n/              # Translation files (pt-BR.json, en.json)
├── layouts/           # Application layouts
├── pages/             # Pages (auto-routes)
├── public/            # Static files
├── stores/            # Pinia stores
│   ├── challenges.ts  # Challenges and XP
│   ├── countdown.ts   # Timer logic
│   ├── profile.ts     # User profile
│   └── theme.ts       # DaisyUI themes
├── utils/             # Utility functions
├── nuxt.config.ts     # Nuxt configuration
└── tailwind.config.js # Tailwind/DaisyUI configuration
```

---

## Tests

```bash
# Run all tests
npm run test

# Test coverage:
# - countdown store: 10 tests
# - challenges store: 12 tests
# - profile store: 11 tests
# - theme store: 6 tests
# - CountdownDigits component: 5 tests
# - ExperienceBar component: 6 tests
# Total: 50 tests
```

---

## Deploy

The project is hosted on [Vercel](https://vercel.com) with automatic deployment:

- `develop` -> Preview
- `master` -> Production (https://pomodoro-nuxt-ten.vercel.app)

---

## Authors

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

## License

MIT
