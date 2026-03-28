# Pomodoro Move.it

Aplicacao de Pomodoro gamificada com desafios de saude, construida com Nuxt 3.

## Funcionalidades

- Timer Pomodoro de 25 minutos
- Desafios de alongamento e exercicios oculares
- Sistema de XP e levels
- Suporte a multiplos temas (DaisyUI)
- Embed do Spotify para ouvir musica enquanto trabalha
- Notificacoes quando o ciclo termina
- Progresso salvo em cookies

## Tecnologias

- **Framework:** Nuxt 3
- **State Management:** Pinia
- **Styling:** TailwindCSS 3 + DaisyUI 4
- **Linguagem:** TypeScript
- **Deploy:** Vercel

## Setup

```bash
# instalar dependencias
npm install

# iniciar servidor de desenvolvimento
npm run dev

# build para producao
npm run build

# preview do build
npm run preview
```

## Temas Disponiveis

O app suporta 10 temas do DaisyUI:
- light, dark, cupcake, dracula, synthwave
- retro, cyberpunk, valentine, aqua, lofi

Selecione o tema pelo menu dropdown no canto superior direito.

## Estrutura do Projeto

```
├── assets/          # CSS e dados dos desafios
├── components/
│   ├── atoms/       # Componentes basicos
│   ├── molecules/   # Componentes compostos
│   └── organisms/   # Componentes complexos
├── layouts/         # Layouts da aplicacao
├── pages/           # Paginas (rotas)
├── public/          # Arquivos estaticos
├── stores/          # Stores Pinia
└── utils/           # Funcoes utilitarias
```

## Autores

- [Willian](https://github.com/Azincourt-tech)
- [Morgana](https://github.com/Morgana-Claw)
