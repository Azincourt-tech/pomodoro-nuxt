# Troubleshooting - Deploy da API Cloudflare

## Erro: Authentication error [code: 10000]

### Causa
O token API do Cloudflare não tem permissões suficientes para fazer deploy de Workers.

### Solução

1. **Acesse o Cloudflare Dashboard:**
   - Vá para https://dash.cloudflare.com/profile/api-tokens
   - Login: willian.developer23@gmail.com

2. **Crie um novo token API com as permissões corretas:**
   - Clique em "Create Token"
   - Use o template "Create Custom Token"
   - Configure as permissões:

   **Account:**
   - Cloudflare Workers: Edit
   - Account Settings: Read
   
   **Zone:**
   - Não necessário para Workers

3. **Atualize o secret no GitHub:**
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN -b "SEU_NOVO_TOKEN_AQUI"
   ```

4. **Verifique se o Account ID está correto:**
   - O Account ID deve ser: `8b6e50c7e3e3b0e7f3a3e7f3a3e7f3a3` (exemplo)
   - Atualize se necessário:
   ```bash
   gh secret set CLOUDFLARE_ACCOUNT_ID -b "SEU_ACCOUNT_ID_AQUI"
   ```

## Outros Secrets Necessários

Adicione os seguintes secrets no repositório:

```bash
# Database D1 ID
gh secret set D1_DATABASE_ID -b "seu-d1-database-id"

# KV Namespace ID  
gh secret set KV_NAMESPACE_ID -b "seu-kv-namespace-id"

# Better Auth Secret (gerar uma chave aleatória)
gh secret set BETTER_AUTH_SECRET -b "$(openssl rand -hex 32)"

# Better Auth URL (produção)
gh secret set BETTER_AUTH_URL -b "https://pomodoro-nuxt-ten.vercel.app"

# GitHub OAuth (opcional, para login com GitHub)
gh secret set GITHUB_CLIENT_ID -b "seu-github-client-id"
gh secret set GITHUB_CLIENT_SECRET -b "seu-github-client-secret"
```

## Verificação

Após atualizar os secrets, faça um push para triggerar o deploy:

```bash
git commit --allow-empty -m "trigger: test deploy da API"
git push origin master
```

Monitore o deploy:
```bash
gh run watch
```

## Logs do Deploy

Para ver logs detalhados:
```bash
gh run view --log
```

## Problemas Comuns

### 1. Token expirado
- Tokens API podem expirar. Regere um novo token.

### 2. Permissões insuficientes
- Certifique-se que o token tem permissão "Cloudflare Workers: Edit"

### 3. Account ID incorreto
- Verifique o Account ID no dashboard do Cloudflare

### 4. D1/KV não configurados
- Crie o D1: `npx wrangler d1 create pomodoro-db`
- Crie o KV: `npx wrangler kv:namespace create KV`
- Atualize os IDs nos secrets do GitHub
