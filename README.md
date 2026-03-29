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
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel" />
</p>

---

## Sobre

Pomodoro Move.it e uma aplicacao que combina a tecnica Pomodoro com desafios de saude e bem-estar. A cada ciclo completado, voce recebe um desafio para alongar, descansar os olhos, se hidratar ou praticar respiracao.

### Funcionalidades

- **Timer Pomodoro** com presets (15, 25, 35, 45, 60 min) e tempo personalizado
- **27 desafios** em 7 categorias diferentes
- **Sistema de XP e niveis** para manter a motivacao
- **10 temas** do DaisyUI (dark, light, cupcake, dracula, etc.)
- **Spotify integrado** para ouvir musica enquanto trabalha
- **Perfil editavel** com suporte a GitHub avatar
- **Persistencia** via localStorage (progresso salvo automaticamente)
- **Notificacoes** quando o ciclo termina
- **Design responsivo** (desktop e mobile)

### Desafios Disponiveis

| Categoria | Quantidade | Exemplo |
|-----------|-----------|---------|
| Alongamento | 8 | Estique os bracos e pernas |
| Exercicio Ocular | 3 | Descanse os olhos por 2 min |
| Hidratacao | 2 | Beba um copo de agua |
| Respiracao | 3 | Exercicio de respiracao profunda |
| Postura | 3 | Ajuste sua postura |
| Meditacao | 3 | Meditacao rapida de 1 min |
| Caminhada | 3 | Caminhe por 1 min |

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) |
| State | [Pinia](https://pinia.vuejs.org) |
| Styling | [TailwindCSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) |
| Linguagem | [TypeScript](https://typescriptlang.org) |
| Deploy | [Vercel](https://vercel.com) |

---

## Setup Local

```bash
# Clonar o repositorio
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt

# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para producao
npm run build

# Preview do build
npm run preview
```

O app estara disponivel em `http://localhost:3000`

---

## Estrutura do Projeto

```
pomodoro-nuxt/
├── assets/
│   ├── challenges/    # Dados dos desafios
│   └── css/           # Estilos globais
├── components/
│   ├── atoms/         # Componentes basicos
│   ├── molecules/     # Componentes compostos
│   └── organisms/     # Componentes complexos
├── layouts/           # Layouts da aplicacao
├── pages/             # Paginas (rotas automaticas)
├── public/            # Arquivos estaticos
├── stores/            # Stores Pinia
│   ├── challenges.ts  # Desafios e XP
│   ├── countdown.ts   # Timer
│   ├── profile.ts     # Perfil do usuario
│   └── theme.ts       # Temas DaisyUI
├── utils/             # Funcoes utilitarias
├── nuxt.config.ts     # Configuracao do Nuxt
└── tailwind.config.js # Configuracao do Tailwind/DaisyUI
```

---

## Deploy

O projeto esta hospedado na [Vercel](https://vercel.com) com deploy automatico:

- `develop` → Preview
- `master` → Producao (https://pomodoro-nuxt-ten.vercel.app)

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
