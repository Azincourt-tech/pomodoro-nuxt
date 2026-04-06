# 🔐 GUIA DE CONFIGURAÇÃO DOS SECRETS GITHUB

## Passos para configurar o deploy automático da API Cloudflare

### 1. Acesse as Settings do Repositório

1. Vá para: https://github.com/Azincourt-tech/pomodoro-nuxt
2. Clique em **Settings** (aba superior direita)
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

---

### 2. Crie os seguintes secrets:

#### 🔑 **CLOUDFLARE_API_TOKEN**

**Como obter:**
1. Acesse: https://dash.cloudflare.com/profile/api-tokens
2. Clique em **Create Token**
3. Escolha o template: **Edit Cloudflare Workers** (ou crie custom)
4. Permissões necessárias:
   - Account: Workers Scripts: **Edit**
   - Account: Workers KV Storage: **Edit**
   - Account: D1: **Edit**
5. Selecione sua conta (Azincourt-tech ou sua conta pessoal)
6. Clique em **Continue to summary**
7. Clique em **Create Token**
8. **Copie o token gerado** (só aparece uma vez!)
9. Cole no campo **Secret** do GitHub
10. Name: `CLOUDFLARE_API_TOKEN`

---

#### 🆔 **CLOUDFLARE_ACCOUNT_ID**

**Como obter:**
1. Acesse: https://dash.cloudflare.com
2. No canto inferior direito da página, você verá:
   ```
   Account ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Copie o Account ID**
4. Cole no campo **Secret** do GitHub
5. Name: `CLOUDFLARE_ACCOUNT_ID`

---

#### 🗄️ **D1_DATABASE_ID** (Opcional, mas recomendado)

**Como obter:**
```bash
wrangler d1 list
```

Ou acesse: https://dash.cloudflare.com → Workers & Pages → D1 SQL → pomodoro-db

O database_id será algo como: `84f5543d-e0b0-45cd-96e1-0d55f8c620bf`

1. **Copie o database_id**
2. Cole no GitHub como secret
3. Name: `D1_DATABASE_ID`

---

#### 📦 **KV_NAMESPACE_ID** (Opcional, mas recomendado)

**Como obter:**
```bash
wrangler kv:namespace list
```

Ou acesse: https://dash.cloudflare.com → Workers & Pages → KV

O ID será algo como: `a1b2c3d4e5f6789012345678901234ab`

1. **Copie o ID**
2. Cole no GitHub como secret
3. Name: `KV_NAMESPACE_ID`

---

### 3. Configurar Secrets da API (via wrangler secret put)

Estes secrets **NÃO** vão no GitHub - eles são configurados diretamente no Cloudflare:

```bash
cd apps/api
wrangler login
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

Ou configure manualmente:
1. Acesse: https://dash.cloudflare.com → Workers & Pages
2. Clique no worker `pomodoro-api`
3. Vá para **Settings** → **Variables**
4. Adicione cada variável:
   - `BETTER_AUTH_SECRET`: chave secreta (mínimo 32 caracteres)
   - `GITHUB_CLIENT_ID`: do GitHub Developer Settings
   - `GITHUB_CLIENT_SECRET`: do GitHub Developer Settings

---

### 4. Verificar Configuração

Após adicionar todos os secrets, o workflow será executado automaticamente na próxima vez que você fizer push para `master` com mudanças em `apps/api/`.

Para testar manualmente:
1. Faça uma pequena alteração em `apps/api/src/index.ts`
2. Commit e push para `master`
3. Vá para: https://github.com/Azincourt-tech/pomodoro-nuxt/actions
4. Verifique se o workflow "Deploy API Cloudflare" foi executado

---

## 🚀 Resultado Esperado

Após a configuração:
- ✅ Push para `master` → Vercel faz deploy do frontend automaticamente
- ✅ Push para `master` com mudanças em `apps/api/` → GitHub Actions faz deploy da API Cloudflare
- ✅ Zero intervenção manual necessária

---

## ❓ Troubleshooting

### Erro: "Missing CLOUDFLARE_API_TOKEN"
- Verifique se o secret foi criado corretamente (Settings > Secrets)
- O nome deve ser exatamente: `CLOUDFLARE_API_TOKEN` (maiúsculas)

### Erro: "Unauthorized"
- O token da API pode ter expirado ou não ter permissões suficientes
- Gere um novo token com permissões: Workers Scripts: Edit, KV: Edit, D1: Edit

### Erro: "Missing entry-point"
- Verifique se `wrangler.toml` existe em `apps/api/`
- Execute `cp wrangler.toml.example wrangler.toml` localmente e configure os IDs

---

## 📋 Checklist Final

- [ ] `CLOUDFLARE_API_TOKEN` configurado
- [ ] `CLOUDFLARE_ACCOUNT_ID` configurado
- [ ] `D1_DATABASE_ID` configurado (opcional)
- [ ] `KV_NAMESPACE_ID` configurado (opcional)
- [ ] `BETTER_AUTH_SECRET` configurado via wrangler (Cloudflare Dashboard)
- [ ] `GITHUB_CLIENT_ID` configurado via wrangler (Cloudflare Dashboard)
- [ ] `GITHUB_CLIENT_SECRET` configurado via wrangler (Cloudflare Dashboard)
- [ ] Testado com push para `master`

---

**Dúvidas?** Consulte o workflow em `.github/workflows/deploy-api.yml`
