# 🚀 Guia de Deploy - Render.com

## 📋 Pré-requisitos
- Conta no GitHub (já tens ✓)
- Conta no [Render.com](https://render.com) (grátis)

## 🔧 Passo 1: Preparar o Repositório

O projeto já está preparado para deploy! Os ficheiros necessários foram criados:
- ✅ `render.yaml` - Configuração automática do Render
- ✅ `server/index.js` - Serve o frontend em produção
- ✅ `package.json` - Scripts de build e start

## 📤 Passo 2: Fazer Push para o GitHub

```bash
git add .
git commit -m "Prepara projeto para deploy no Render"
git push origin main
```

## 🌐 Passo 3: Deploy no Render.com

### 3.1. Criar Conta no Render
1. Acede a [https://render.com](https://render.com)
2. Clica em **"Get Started for Free"**
3. Faz login com a tua conta do **GitHub**

### 3.2. Conectar o Repositório
1. No dashboard do Render, clica em **"New +"** → **"Web Service"**
2. Clica em **"Connect a repository"**
3. Autoriza o Render a aceder aos teus repositórios
4. Seleciona o repositório: `kanbanflow-manager-guilherme-morais`

### 3.3. Configurar o Serviço
Preenche os campos:

- **Name**: `kanbanflow-manager` (ou outro nome)
- **Region**: `Frankfurt (EU Central)` (mais próximo de Portugal)
- **Branch**: `main`
- **Root Directory**: (deixar vazio)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3.4. Variáveis de Ambiente
Na secção **Environment**, adiciona:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `kanbanflow-secret-2024-guilherme` |

### 3.5. Deploy
1. Clica em **"Create Web Service"**
2. Aguarda o build (5-10 minutos na primeira vez)
3. Quando terminar, verás: ✅ **"Live"**

## 🎉 Passo 4: Aceder à Aplicação

A tua aplicação estará disponível em:
```
https://kanbanflow-manager.onrender.com
```
(ou o nome que escolheste)

## 🔑 Credenciais de Teste

**Gestor:**
- Username: `admin`
- Password: `admin123`

**Programador:**
- Username: `dev1`
- Password: `dev123`

## ⚠️ Nota Importante sobre SQLite

O Render usa um sistema de ficheiros **temporário**. Isso significa:
- ✅ A base de dados funciona normalmente
- ❌ Os dados são **perdidos** quando o serviço reinicia (inatividade de 15 minutos no plano gratuito)
- 💡 Para dados persistentes, seria necessário usar PostgreSQL (também gratuito no Render)

### Alternativa: PostgreSQL (Opcional)

Se quiseres dados persistentes:
1. No Render, cria uma **"PostgreSQL"** database (grátis)
2. Substitui SQLite por PostgreSQL no código
3. Usa a variável `DATABASE_URL` fornecida pelo Render

## 🔄 Atualizações Automáticas

Cada `git push` para o GitHub faz deploy automático! 🎊

```bash
# Faz alterações no código
git add .
git commit -m "Nova funcionalidade"
git push origin main
# Deploy automático no Render! 🚀
```

## 📊 Monitorização

No dashboard do Render podes ver:
- 📈 Logs em tempo real
- 🔄 Estado do deploy
- 📉 Uso de recursos
- 🌐 URL da aplicação

## 🆘 Problemas Comuns

### Build falha
- Verifica os logs no Render
- Confirma que `npm run build` funciona localmente

### App não carrega
- Verifica se `NODE_ENV=production` está definido
- Confirma que o `dist/` foi gerado no build

### API não responde
- Verifica os logs do servidor
- Confirma que as rotas começam com `/api`

## 🎓 Para o Professor

Link da aplicação online:
```
https://kanbanflow-manager.onrender.com
```

**Nota**: O Render pode levar 30-60 segundos a acordar o serviço se estiver inativo (plano gratuito).

---

Desenvolvido com 💙 por Guilherme Morais

