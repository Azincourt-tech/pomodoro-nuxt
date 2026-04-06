# 🚀 CONFIGURAÇÃO RÁPIDA - Cloudflare API

## Opção 1: Script Automático (Recomendado)

```bash
cd /home/ubuntu/agents/dev/pomodoro-nuxt
./setup-cloudflare.sh
```

O script faz tudo automaticamente:
- ✅ Login no Cloudflare
- ✅ Cria D1 Database
- ✅ Cria KV Namespace  
- ✅ Configura wrangler.toml
- ✅ Configura secrets
- ✅ Mostra resumo completo

---

## Opção 2: Manual (Passo a Passo)

### 1. Login no Cloudflare
```bash
wrangler login
```
Um navegador será aberto. Faça login com sua conta.

---

### 2. Criar D1 Database
```bash
wrangler d1 create pomodoro-db
```

**Saída esperada:**
```
✅ Successfully created DB 'pomodoro-db' with ID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Copie o database_id!**

---

### 3. Criar KV Namespace
```bash
wrangler kv:namespace create "pomodoro-kv"
```

**Saída esperada:**
```
✅ Successfully created namespace 'pomodoro-kv' with ID xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copie o ID!**

---

### 4. Configurar wrangler.toml
```bash
cd apps/api
cp wrangler.toml.example wrangler.toml
```

Edite `wrangler.toml` e substitua:
- `SEU_DATABASE_ID_AQUI` → pelo D1 ID copiado
- `SEU_KV_ID_AQUI` → pelo KV ID copiado

---

### 5. Configurar Secrets da API

```bash
wrangler secret put BETTER_AUTH_SECRET
# Digite sua chave secreta (min 32 caracteres)

wrangler secret put GITHUB_CLIENT_ID
# Digite seu GitHub Client ID

wrangler secret put GITHUB_CLIENT_SECRET
# Digite seu GitHub Client Secret
```

---

### 6. Testar Deploy
```bash
wrangler deploy
```

Se funcionar, você verá:
```
✅ Deployment complete!
```

---

### 7. Configurar GitHub Actions Secrets

Acesse: **Settings → Secrets and variables → Actions** do repositório

Adicione:
- `CLOUDFLARE_API_TOKEN`: Gere em https://dash.cloudflare.com/profile/api-tokens (template: Edit Cloudflare Workers)
- `CLOUDFLARE_ACCOUNT_ID`: Seu Account ID (cantinho inferior direito de dash.cloudflare.com)
- `D1_DATABASE_ID`: O ID do D1 que você copiou no passo 2
- `KV_NAMESPACE_ID`: O ID do KV que você copiou no passo 3

---

## ✅ Verificação Final

Após configurar tudo, faça um teste:

```bash
# Faça uma pequena alteração na API
cd apps/api/src
echo "// test" >> index.ts

# Commit e push
cd ../..
git add .
git commit -m "test: trigger deploy"
git push origin master
```

O workflow GitHub Actions será executado automaticamente:
- Acesse: https://github.com/Azincourt-tech/pomodoro-nuxt/actions
- Verifique se "Deploy API Cloudflare" está rodando

---

## ❓ Precisa de Ajuda?

- Consulte `SETUP_SECRETS.md` para guia detalhado dos secrets
- Veja `.github/workflows/deploy-api.yml` para entender o workflow
- Execute `wrangler tail` para ver logs em tempo real da API

---

**Pronto!** Sua API Cloudflare agora faz deploy automático! 🚀
