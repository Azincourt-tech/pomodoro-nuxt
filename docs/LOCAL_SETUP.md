# Setup Local - Desenvolvimento

Guia completo para rodar o Pomodoro Move.it localmente com `wrangler dev` (emulação de D1 + KV).

## Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Git

## Setup Rápido

### Opção 1: Script Automático (Recomendado)

```bash
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt
./setup-localhost.sh
```

O script:
- ✅ Instala todas as dependências
- ✅ Configura wrangler.toml para modo local
- ✅ Cria `.dev.vars` com valores de desenvolvimento
- ✅ Mostra instruções para iniciar frontend e API

---

### Opção 2: Manual

#### 1. Clone e instale dependências

```bash
git clone https://github.com/Azincourt-tech/pomodoro-nuxt.git
cd pomodoro-nuxt
npm install
```

#### 2. Setup da API

```bash
cd apps/api
npm install
```

#### 3. Configurar wrangler para localhost

Crie `apps/api/.dev.vars`:

```env
# Desenvolvimento local
BETTER_AUTH_SECRET=dev-secret-minimum-32-chars-long
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=dev-github-client-id
GITHUB_CLIENT_SECRET=dev-github-client-secret
NODE_ENV=development
```

> **Nota:** Para login real com GitHub, crie um OAuth App em [GitHub Developer Settings](https://github.com/settings/developers):
> - Homepage URL: `http://localhost:3000`
> - Callback URL: `http://localhost:3000/api/auth/callback/github`

#### 4. Configurar wrangler.toml

Copie o template se existir:

```bash
cp wrangler.toml.example wrangler.toml
```

Ou crie manualmente:

```toml
name = "pomodoro-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "pomodoro-db"
database_id = "local-pomodoro-db"

[[kv_namespaces]]
binding = "KV"
id = "local-pomodoro-kv"
```

---

## Rodando Localmente

### API (Cloudflare Workers emulado)

```bash
cd apps/api
npm run dev
```

A API estará em: **http://localhost:8787**

O `wrangler dev` emula automaticamente:
- **D1 Database** - SQLite local
- **KV Namespace** - Armazenamento chave-valor em memória
- **Workers Runtime** - Ambiente Cloudflare local

### Frontend (Nuxt 3)

Em outro terminal:

```bash
cd apps/web
npm run dev
```

O frontend estará em: **http://localhost:3000**

---

## Testando

### Verificar API

```bash
curl http://localhost:8787/health
```

### Testar Auth Local

1. Acesse `http://localhost:3000/register`
2. Crie uma conta com email/senha
3. Use qualquer email válido (não envia email real em dev)

### GitHub OAuth (Opcional)

Se configurou OAuth real em `.dev.vars`:
1. Clique em "Login with GitHub"
2. Autorize o app
3. Será redirecionado de volta

---

## Comandos Úteis

### Ver logs da API em tempo real

```bash
cd apps/api
npm run dev
# Logs aparecem no terminal
```

### Limpar dados locais

```bash
cd apps/api
rm -rf .wrangler
```

> Isso reseta D1 e KV locais. Útil para limpar estado de teste.

### Rodar migrations D1 local

```bash
cd apps/api
npx wrangler d1 migrations apply pomodoro-db --local
```

---

## Estrutura Local

```
pomodoro-nuxt/
├── apps/
│   ├── web/          # Nuxt 3 → http://localhost:3000
│   └── api/          # Workers emulado → http://localhost:8787
│       ├── .dev.vars # Variáveis de ambiente locais
│       ├── wrangler.toml
│       └── src/
└── package.json
```

---

## Diferenças: Local vs Produção

| Recurso | Local (`wrangler dev`) | Produção (Cloudflare) |
|---------|------------------------|----------------------|
| D1 | SQLite emulado | D1 real (edge) |
| KV | Em memória | KV global |
| Secrets | `.dev.vars` | `wrangler secret put` |
| URL | localhost:8787 | workers.dev |
| Auth | Qualquer credencial | GitHub OAuth real |

---

## Troubleshooting

### Erro: "Port 8787 already in use"

```bash
# Matar processo existente
lsof -ti:8787 | xargs kill

# Ou rodar em porta diferente
cd apps/api
npx wrangler dev --port 8788
```

### Erro: "Module not found"

```bash
cd apps/api
npm install
```

### Auth não funciona

Verifique `.dev.vars`:
- `BETTER_AUTH_SECRET` deve ter pelo menos 32 caracteres
- URLs devem apontar para `localhost:3000`

### Dados não persistem entre restarts

Isso é esperado no modo `--local` do wrangler. Para persistência:

```bash
# Remover flag --local (usa D1/KV real)
npx wrangler dev
```

Ou use binding local com persistência:

```bash
npx wrangler dev --persist-to=./.wrangler/state
```

---

## Próximos Passos

- [SETUP_SECRETS.md](SETUP_SECRETS.md) - Configurar secrets para produção
- [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) - Guia de deploy
- [API_DEPLOY_TROUBLESHOOTING.md](API_DEPLOY_TROUBLESHOOTING.md) - Troubleshooting
