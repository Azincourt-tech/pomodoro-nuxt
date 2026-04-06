# Pomodoro API - Cloudflare Workers

API backend para o Pomodoro Nuxt, rodando em Cloudflare Workers com Hono.

## Variáveis de Ambiente (Cloudflare Secrets)

Estas variáveis **devem** ser configuradas no Cloudflare Dashboard ou via `wrangler secret put`:

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `GITHUB_CLIENT_ID` | Client ID do GitHub OAuth App | Sim (para login GitHub) |
| `GITHUB_CLIENT_SECRET` | Client Secret do GitHub OAuth App | Sim (para login GitHub) |
| `BETTER_AUTH_SECRET` | Secret para JWT/sessions (min 32 chars) | **Sim** |
| `BETTER_AUTH_URL` | URL base da API (ex: `https://pomodoro-api.azlab.dev.br`) | Sim |

### Configurar segredos

```bash
# Gerar BETTER_AUTH_SECRET
openssl rand -base64 48

# Definir segredos via wrangler
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put BETTER_AUTH_URL
```

### Callback URL no GitHub OAuth

O **Authorization callback URL** no GitHub OAuth App deve ser:
```
https://pomodoro-api.azlab.dev.br/api/auth/callback/github
```

## Deploy

```bash
cd apps/api
npm run deploy
```

## Variáveis de Configuração (wrangler.jsonc)

O `wrangler.jsonc` contém placeholders que são substituídos no deploy:
- `__D1_DATABASE_ID__` — ID do D1 database
- `__KV_NAMESPACE_ID__` — ID do KV namespace
- `__BETTER_AUTH_URL__` — URL base da API

Estes são gerenciados pelo pipeline de deploy, **nunca** commite valores reais.
