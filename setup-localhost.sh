#!/bin/bash

# ==========================================
# SETUP LOCALHOST - Pomodoro API
# ==========================================
# Este script configura o ambiente local para desenvolvimento:
# 1. Instala dependências
# 2. Configura wrangler.toml para modo local
# 3. Inicia serviços emulados (D1, KV)
# 4. Sobe API local com wrangler dev
# ==========================================

set -e

echo "🔧 Setup Localhost - Pomodoro API"
echo "==================================="
echo ""

# Verificar node/npx
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo ""

# Passo 1: Instalar dependências
echo "📦 Passo 1: Instalando dependências..."
cd "$(dirname "$0")/.."

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências do monorepo..."
    npm install
else
    echo "   Dependências já instaladas."
fi
echo ""

# Passo 2: Instalar dependências da API
echo "📦 Passo 2: Instalando dependências da API..."
cd apps/api

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Dependências da API já instaladas."
fi
echo ""

# Passo 3: Configurar wrangler.toml local
echo "⚙️  Passo 3: Configurando wrangler.toml para localhost..."

if [ -f "wrangler.toml.example" ]; then
    cp wrangler.toml.example wrangler.toml
    echo "   wrangler.toml criado a partir do template."
elif [ ! -f "wrangler.toml" ]; then
    echo "❌ wrangler.toml.example não encontrado!"
    exit 1
fi

# Criar configuração mínima para localhost
cat > wrangler.toml.local << 'EOF'
name = "pomodoro-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1 Local (emulado)
[[d1_databases]]
binding = "DB"
database_name = "pomodoro-db"
database_id = "local-pomodoro-db"

# KV Local (emulado)
[[kv_namespaces]]
binding = "KV"
id = "local-pomodoro-kv"
EOF

echo "   wrangler.toml.local criado para modo offline/local."
echo ""

# Passo 4: Configurar variáveis de ambiente locais
echo "🔑 Passo 4: Configurando variáveis de ambiente..."

if [ ! -f ".dev.vars" ]; then
    echo "   Criando .dev.vars com valores de desenvolvimento..."
    cat > .dev.vars << 'EOF'
# Valores de desenvolvimento - NÃO usar em produção
BETTER_AUTH_SECRET=dev-secret-minimum-32-chars-long
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=dev-github-client-id
GITHUB_CLIENT_SECRET=dev-github-client-secret
NODE_ENV=development
EOF
    echo "   .dev.vars criado com valores locais seguros."
    echo ""
    echo "   ⚠️  Para OAuth real, edite .dev.vars com suas credenciais GitHub:"
    echo "      1. Acesse: https://github.com/settings/developers"
    echo "      2. Crie um OAuth App"
    echo "      3. Homepage URL: http://localhost:3000"
    echo "      4. Callback URL: http://localhost:3000/api/auth/callback/github"
    echo "      5. Copie Client ID e Secret para .dev.vars"
else
    echo "   .dev.vars já existe."
fi
echo ""

# Passo 5: Iniciar wrangler dev
echo "🚀 Passo 5: Iniciando API local..."
echo ""
echo "=========================================="
echo "✅ SETUP LOCAL CONCLUÍDO!"
echo "=========================================="
echo ""
echo "📋 Serviços locais:"
echo "   API: http://localhost:8787"
echo "   D1: Emulado localmente"
echo "   KV: Emulado localmente"
echo ""
echo "🎯 Para iniciar a API:"
echo "   cd apps/api"
echo "   npm run dev"
echo ""
echo "🎨 Para iniciar o frontend (em outro terminal):"
echo "   cd apps/web"  
echo "   npm run dev"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📝 Configurar GitHub OAuth (opcional):"
echo "   Edite apps/api/.dev.vars com credenciais reais"
echo "   ou use login por email/senha com qualquer dado"
echo ""
echo "✨ Happy coding!"
echo ""
