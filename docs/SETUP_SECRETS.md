# Gerenciamento de Secrets

Guia genérico para configurar credenciais de forma segura.

## Regras de Segurança

1. **NUNCA** commite secrets no repositório
2. **NUNCA** exponha tokens, IDs ou credenciais em código/documentação pública
3. **SEMPRE** use `.env` files (adicionados ao `.gitignore`)
4. **SEMPRE** rotacione credenciais se expostas

---

## Variáveis de Ambiente Locais

Crie arquivos `.env` ou `.dev.vars` na raiz do projeto/app:

```env
# Exemplo genérico
API_SECRET=sua-chave-secreta-aqui
OAUTH_CLIENT_ID=seu-client-id
OAUTH_CLIENT_SECRET=seu-client-secret
```

> **Importante:** Estes arquivos devem estar no `.gitignore`.

---

## Boas Práticas

### 1. Use Placeholders em Templates

✅ `wrangler.toml.example` ou `.env.example`:
```toml
database_id = "SEU_DATABASE_ID"
```

### 2. Gere Secrets Seguros

```bash
# Usando OpenSSL
openssl rand -hex 32

# Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Proteja Arquivos de Secrets

```bash
chmod 600 .dev.vars
chmod 600 .env
```

---

## CI/CD (GitHub Actions)

Para pipelines, configure secrets em:
**GitHub → Settings → Secrets and variables → Actions**

Nomes comuns:
- `API_TOKEN` - Token de API do provedor
- `DATABASE_URL` - String de conexão
- `OAUTH_CLIENT_ID` - Credenciais OAuth
- `OAUTH_CLIENT_SECRET` - Secret OAuth

> **Dica:** Use tokens com permissões mínimas necessárias.

---

## Se um Secret Vazar

1. Rotacione a credencial imediatamente
2. Revogue o token antigo
3. Atualize todos os ambientes
4. Verifique logs de acesso suspeito

---

## Recursos

- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Setup local completo
- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
