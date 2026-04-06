#!/bin/bash

# ==========================================
# SETUP CLOUDFLARE - Pomodoro API
# ==========================================
# Este script configura automaticamente:
# 1. Login no Cloudflare
# 2. Criação do D1 Database
# 3. Criação do KV Namespace
# 4. Configuração do wrangler.toml
# 5. Configuração dos secrets
# ==========================================

set -e

echo "🔐 Setup Cloudflare para Pomodoro API"
echo "======================================"
echo ""

# Passo 1: Login
echo "📝 Passo 1: Autenticando no Cloudflare..."
echo "   Um navegador será aberto. Faça login com sua conta Cloudflare."
echo ""
wrangler login

if [ $? -ne 0 ]; then
    echo "❌ Falha no login. Tente novamente."
    exit 1
fi

echo "✅ Login realizado com sucesso!"
echo ""

# Passo 2: Obter Account ID
echo "🆔 Passo 2: Obtendo Account ID..."
ACCOUNT_ID=$(wrangler whoami --json 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ACCOUNT_ID" ]; then
    echo "⚠️  Não foi possível obter Account ID automaticamente."
    echo "   Por favor, insira manualmente (encontrado em: dash.cloudflare.com, canto inferior direito):"
    read -p "Account ID: " ACCOUNT_ID
fi

echo "   Account ID: $ACCOUNT_ID"
echo ""

# Passo 3: Criar D1 Database
echo "🗄️  Passo 3: Criando D1 Database 'pomodoro-db'..."
D1_OUTPUT=$(wrangler d1 create pomodoro-db 2>&1)
echo "$D1_OUTPUT"

D1_ID=$(echo "$D1_OUTPUT" | grep -o '[0-9a-f]\{8\}-[0-9a-f]\{4\}-[0-9a-f]\{4\}-[0-9a-f]\{4\}-[0-9a-f]\{12\}' | head -1)

if [ -z "$D1_ID" ]; then
    echo "⚠️  Não foi possível obter D1 ID automaticamente."
    echo "   Execute: wrangler d1 list"
    echo "   E cole o database_id aqui:"
    read -p "D1 Database ID: " D1_ID
fi

echo "   D1 ID: $D1_ID"
echo ""

# Passo 4: Criar KV Namespace
echo "📦 Passo 4: Criando KV Namespace 'pomodoro-kv'..."
KV_OUTPUT=$(wrangler kv:namespace create "pomodoro-kv" 2>&1)
echo "$KV_OUTPUT"

KV_ID=$(echo "$KV_OUTPUT" | grep -o '[0-9a-f]\{8\}[0-9a-f]\{4\}[0-9a-f]\{4\}[0-9a-f]\{4\}[0-9a-f]\{12\}' | head -1)

if [ -z "$KV_ID" ]; then
    echo "⚠️  Não foi possível obter KV ID automaticamente."
    echo "   Execute: wrangler kv:namespace list"
    echo "   E cole o ID aqui:"
    read -p "KV Namespace ID: " KV_ID
fi

echo "   KV ID: $KV_ID"
echo ""

# Passo 5: Configurar wrangler.toml
echo "⚙️  Passo 5: Configurando wrangler.toml..."
cd apps/api
cp wrangler.toml.example wrangler.toml

# Substituir placeholders
sed -i "s/SEU_DATABASE_ID_AQUI/$D1_ID/g" wrangler.toml
sed -i "s/SEU_KV_ID_AQUI/$KV_ID/g" wrangler.toml

echo "✅ wrangler.toml configurado!"
cat wrangler.toml
echo ""

# passo 6: Configurar secrets
echo "🔑 Passo 6: Configurando secrets da API..."
echo ""

read -p "BETTER_AUTH_SECRET (min 32 chars): " BETTER_AUTH_SECRET
echo "$BETTER_AUTH_SECRET" | wrangler secret put BETTER_AUTH_SECRET

read -p "GITHUB_CLIENT_ID: " GITHUB_CLIENT_ID
echo "$GITHUB_CLIENT_ID" | wrangler secret put GITHUB_CLIENT_ID

read -s -p "GITHUB_CLIENT_SECRET: " GITHUB_CLIENT_SECRET
echo ""
echo "$GITHUB_CLIENT_SECRET" | wrangler secret put GITHUB_CLIENT_SECRET

echo ""
echo "✅ Secrets configurados!"
echo ""

# Resumo
echo "=========================================="
echo "✅ SETUP CONCLUÍDO!"
echo "=========================================="
echo ""
echo "📋 Resumo:"
echo "   Account ID: $ACCOUNT_ID"
echo "   D1 ID: $D1_ID"
echo "   KV ID: $KV_ID"
echo ""
echo "🚀 Para fazer deploy da API agora:"
echo "   cd apps/api"
echo "   wrangler deploy"
echo ""
echo "📝 Para configurar GitHub Actions secrets:"
echo "   Vá para: https://github.com/Azincourt-tech/pomodoro-nuxt/settings/secrets/actions"
echo "   Adicione:"
echo "   - CLOUDFLARE_API_TOKEN: (gere em dash.cloudflare.com/profile/api-tokens)"
echo "   - CLOUDFLARE_ACCOUNT_ID: $ACCOUNT_ID"
echo "   - D1_DATABASE_ID: $D1_ID"
echo "   - KV_NAMESPACE_ID: $KV_ID"
echo ""
echo "✨ Pronto!"
