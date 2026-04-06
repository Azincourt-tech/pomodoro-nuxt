# 🚀 Deploy para Cloudflare (Produção)

> ⚠️ **Este guia é para deploy em produção.** Para desenvolvimento local, veja [LOCAL_SETUP.md](LOCAL_SETUP.md).

## Pré-requisitos

- Conta Cloudflare
- wrangler CLI instalado (`npm install -g wrangler`)
- GitHub Actions configurado (opcional, para CI/CD)

---

## Setup Manual

### 1. Login no Cloudflare

```bash
wrangler login
```

### 2. Criar Recursos

```bash
# D1 Database
wrangler d1 create pomodoro-db

# KV Namespace
wrangler kv:namespace create "pomodoro-kv"
```

Copie os IDs retornados.

### 3. Configurar wrangler.toml

```bash
cd apps/api
cp wrangler.toml.example wrangler.toml
```

Edite `wrangler.toml` substituindo placeholders pelos IDs copiados.

### 4. Configurar Secrets

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

### 5. Deploy Manual

```bash
wrangler deploy
```

---

## Deploy Automático (GitHub Actions)

Configure os secrets em **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` - Token com permissão Workers:Edit
- `CLOUDFLARE_ACCOUNT_ID` - ID da conta Cloudflare

Veja [SETUP_SECRETS.md](SETUP_SECRETS.md) para guia detalhado.

---

## Troubleshooting

Consulte [API_DEPLOY_TROUBLESHOOTING.md](API_DEPLOY_TROUBLESHOOTING.md)
