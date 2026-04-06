# Setup Local - Pomodoro Move.it

## Pré-requisitos

- Node.js 20+
- npm/pnpm
- Wrangler CLI (`npm install -g wrangler`)

## Configuração Inicial

### 1. Instalar dependências

```bash
cd pomodoro-nuxt
npm install
```

### 2. Configurar variáveis de ambiente da API

Crie o arquivo `apps/api/.dev.vars` (já está no .gitignore):

```env
GH_OAUTH_CLIENT_ID=Ov23liAjsqHMDGEt4G0k
GH_OAUTH_CLIENT_SECRET=acbd4a4f53353a78fbde80f1897847673c813cac
BETTER_AUTH_SECRET=c81350fc1fc9b62b803971444fe074bbfc412b1067907cd578579de8dbd70fee
BETTER_AUTH_URL=http://localhost:8787
```

> **Nota:** As credenciais reais estão no `pass` sob `morgana/github-oauth` e `morgana/better-auth-secret`.

### 3. Configurar GitHub OAuth para localhost

No GitHub OAuth App settings, adicione esta callback URL:
```
http://localhost:8787/api/auth/callback/github
```

## Rodando Localmente

### Terminal 1: API (Cloudflare Worker)

```bash
cd apps/api
npx wrangler dev
```

A API estará disponível em `http://localhost:8787`

O Wrangler cria automaticamente um D1 database local em `.wrangler/state/`. As tabelas são criadas automaticamente na primeira requisição.

### Terminal 2: Frontend (Nuxt)

```bash
cd apps/web
NUXT_PUBLIC_API_BASE=http://localhost:8787 npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Testando OAuth Local

1. Acesse `http://localhost:3000/login`
2. Clique em "Login com GitHub"
3. Autorize no GitHub
4. Será redirectado de volta para o frontend

## Endpoints Úteis

- `GET http://localhost:8787/api/auth/github-enabled` - Verifica se OAuth está configurado
- `GET http://localhost:8787/api/health` - Health check da API
- `POST http://localhost:8787/api/auth/ensure-profile` - Cria perfil pomodoro para usuário logado

## Troubleshooting

### "Invalid callbackURL"
Verifique se a callback URL `http://localhost:8787/api/auth/callback/github` está configurada no GitHub OAuth App.

### "Social provider github is missing clientId"
Verifique se o arquivo `.dev.vars` existe e tem `GH_OAUTH_CLIENT_ID` e `GH_OAUTH_CLIENT_SECRET`.

### D1 erros
Delete `.wrangler/state/` e rode `npx wrangler dev` novamente para recriar o database local.

## Estrutura de Arquivos Relevantes

```
apps/api/
├── .dev.vars              # Variáveis de ambiente locais (não versionado)
├── wrangler.toml          # Configuração do Cloudflare Worker
├── src/
│   ├── index.ts           # Entry point da API
│   ├── services/auth.ts   # Configuração do Better Auth
│   ├── routes/auth.ts     # Rotas de auth customizadas
│   └── db/
│       ├── schema.ts      # Schema SQL para migrações
│       └── drizzle-schema.ts  # Schema Drizzle tipado

apps/web/
├── lib/auth-client.ts     # Cliente Better Auth
├── composables/useAuth.ts # Composable Vue para auth
└── nuxt.config.ts         # Configuração do Nuxt
```

## Branchs

- `master` - Produção (deploy automático)
- `develop` - Desenvolvimento
- `feature/*` - Features em desenvolvimento

Para testar uma feature branch localmente, faça checkout da branch e rode os comandos acima.
