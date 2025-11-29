# KanbanFlow Manager 📋

Sistema de gestão de tarefas Kanban desenvolvido para organização e acompanhamento de projetos.

## 🚀 Tecnologias

### Frontend
- **Vite** - Build tool moderna e rápida
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first

### Backend
- **Express.js** - Framework Node.js
- **SQLite3** - Base de dados local
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de passwords
- **CORS** - Configuração de acesso

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor backend
npm run server

# Iniciar frontend (em outro terminal)
npm run dev
```

## 🔑 Credenciais de Acesso

### Gestor
- Username: `admin`
- Password: `password123`

### Programador
- Username: `dev1`
- Password: `123`

## ✨ Funcionalidades

### Autenticação
- ✅ Login com JWT
- ✅ Passwords hasheadas com bcrypt
- ✅ Proteção de rotas por role (Manager/Developer)

### Gestão de Utilizadores (Manager)
- ✅ CRUD completo de utilizadores
- ✅ Atribuição de roles e departamentos
- ✅ Gestão de hierarquia (Gestor → Programadores)

### Gestão de Tipos de Tarefa (Manager)
- ✅ CRUD de tipos de tarefa
- ✅ Personalização de cores

### Kanban Board
- ✅ 3 colunas (To Do, Doing, Done)
- ✅ Drag & Drop de tarefas
- ✅ Busca por título/descrição
- ✅ Filtros por programador e tipo
- ✅ Indicadores visuais de atraso e progresso
- ✅ Estatísticas em tempo real
- ✅ Barra de progresso do sprint

### Regras de Negócio
- ✅ **Propriedade**: Programadores só movem suas próprias tarefas
- ✅ **Sequência**: Ordem de execução obrigatória
- ✅ **WIP Limit**: Máximo 2 tarefas em "Doing" por programador
- ✅ **Imutável**: Tarefas "Done" não podem ser alteradas

### Relatórios (Manager)
- ✅ **Tarefas Concluídas**: Tempo planejado vs real + Exportação CSV
- ✅ **Tarefas em Curso**: Tempo restante e atrasos
- ✅ **Estimador de Tempo**: Algoritmo de previsão baseado em Story Points

### Programadores
- ✅ Visualização de tarefas concluídas
- ✅ Tempo de execução por tarefa

### Project Management
- ✅ Visualização de Sprints
- ✅ Progress tracking
- ✅ Story Points totais

## 📊 Estrutura do Projeto

```
kanbanflow-manager/
├── components/           # Componentes React
│   ├── KanbanBoard.tsx
│   ├── UserManagement.tsx
│   ├── TaskTypeManagement.tsx
│   ├── CompletedTasks.tsx
│   ├── ManagerCompletedReport.tsx
│   ├── ManagerInProgressReport.tsx
│   ├── TodoEstimator.tsx
│   ├── ProjectManagement.tsx
│   ├── Login.tsx
│   ├── Layout.tsx
│   └── Button.tsx
├── context/             # Contextos React
│   └── AuthContext.tsx
├── services/            # Serviços API
│   └── apiBackend.ts
├── server/              # Backend Express
│   ├── index.js
│   ├── database.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── tasks.js
│       └── taskTypes.js
├── types/               # Definições TypeScript
│   └── index.ts
└── public/              # Assets estáticos
```

## 🎯 Como Usar

### 1. Login
Faça login com as credenciais de gestor ou programador.

### 2. Gestor
- Crie utilizadores na página "Team Management"
- Defina tipos de tarefa em "Task Types"
- Crie tarefas no "Task Board"
- Acompanhe relatórios nas páginas dedicadas

### 3. Programador
- Veja suas tarefas no "Task Board"
- Mova tarefas respeitando a ordem de execução
- Consulte suas tarefas concluídas

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia frontend em modo desenvolvimento
npm run build    # Build de produção do frontend
npm run preview  # Preview da build de produção
npm run server   # Inicia servidor backend
```

## 📝 Notas

- O banco de dados SQLite é criado automaticamente na primeira execução
- Dados de seed são inseridos se o banco estiver vazio
- Backend roda na porta **3001**
- Frontend roda na porta **5173** (Vite default)

## 🛠️ Desenvolvimento

Desenvolvido como projeto académico para gestão de tarefas em equipa utilizando metodologia Kanban.

---

**Desenvolvido por**: Guilherme Morais  
**GitHub**: [@guilherme-moraiss](https://github.com/guilherme-moraiss)
