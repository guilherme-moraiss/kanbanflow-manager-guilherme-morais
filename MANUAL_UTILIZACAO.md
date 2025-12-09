# Manual de Utilização
## KanbanFlow Manager - Sistema de Gestão de Tarefas Kanban

**Versão:** 1.0  
**Data:** Novembro 2025

---

## Informações do Grupo

**Desenvolvido por:**
- **Nome:** Guilherme Morais
- **Número:** [SEU_NUMERO_AQUI]
- **Email:** guilhermeetoogmorais@gmail.com

**Curso:** Técnico Superior Profissional em Desenvolvimento para Dispositivos Móveis  
**Unidade Curricular:** Laboratório de Desenvolvimento II  
**Turma:** Diurna  
**Grupo:** [NUMERO_DO_GRUPO]

---

## Índice

1. [Introdução](#introdução)
2. [Justificação das Escolhas Técnicas](#justificação-das-escolhas-técnicas)
3. [Acesso à Aplicação](#acesso-à-aplicação)
4. [Utilização da Aplicação](#utilização-da-aplicação)
5. [Funcionalidades por Perfil](#funcionalidades-por-perfil)
6. [Resolução de Problemas](#resolução-de-problemas)

---

## 1. Introdução

O **KanbanFlow Manager** é uma aplicação web responsiva para gestão de tarefas baseada na metodologia Kanban, desenvolvida para facilitar a organização do trabalho em equipa e análise de produtividade.

### Objetivos da Aplicação

- Gestão rigorosa de tarefas com estados bem definidos (To Do, Doing, Done)
- Controlo de permissões por perfil (Gestor/Programador)
- Análise estatística da produtividade
- Rastreamento de prazos e tempo de execução
- Exportação de dados para análise externa

### Características Principais

- ✅ Interface responsiva (funciona em desktop, tablet e smartphone)
- ✅ Autenticação segura com JWT
- ✅ Drag & Drop intuitivo
- ✅ Sistema de notificações em tempo real
- ✅ Relatórios e estatísticas avançadas
- ✅ Exportação de dados em CSV

---

## 2. Justificação das Escolhas Técnicas

### 2.1. Arquitetura da Aplicação

**Arquitetura Cliente-Servidor**

Optou-se por uma arquitetura de separação entre frontend e backend pelos seguintes motivos:

- **Escalabilidade:** Permite escalar cada componente independentemente
- **Manutenibilidade:** Facilita a manutenção e atualização do código
- **Reutilização:** O backend pode servir múltiplos clientes (web, mobile no futuro)
- **Segurança:** Lógica de negócio e validações no servidor

**[IMAGEM: Diagrama da arquitetura cliente-servidor]**

### 2.2. Tecnologias Backend

#### Express.js + Node.js

**Justificação:**
- ✅ Framework minimalista e flexível
- ✅ Grande comunidade e documentação
- ✅ Excelente performance para APIs REST
- ✅ Facilita a criação de rotas e middleware
- ✅ Lecionado nas aulas da UC

#### SQLite3

**Justificação:**
- ✅ Base de dados leve e sem necessidade de servidor separado
- ✅ Ficheiro único facilita distribuição
- ✅ Suporte nativo a transações
- ✅ Adequado para aplicações de pequena/média dimensão
- ✅ Sem dependências externas

**Alternativa considerada:** PostgreSQL (descartado por adicionar complexidade desnecessária)

#### JWT (JSON Web Tokens)

**Justificação:**
- ✅ Autenticação stateless (não requer sessões no servidor)
- ✅ Permite escalabilidade horizontal
- ✅ Tokens contêm informações do utilizador (reduz consultas à BD)
- ✅ Standard da indústria

#### bcryptjs

**Justificação:**
- ✅ Hash seguro de passwords
- ✅ Proteção contra ataques de força bruta (salt rounds)
- ✅ Compatível com Node.js puro (sem dependências nativas)

### 2.3. Tecnologias Frontend

#### React 18

**Justificação:**
- ✅ Biblioteca mais popular para interfaces web
- ✅ Component-based (reutilização de código)
- ✅ Virtual DOM (performance otimizada)
- ✅ Hooks facilitam gestão de estado
- ✅ Grande ecossistema de bibliotecas

#### Vite

**Justificação:**
- ✅ Extremamente rápido (HMR instantâneo)
- ✅ Build otimizado para produção
- ✅ Configuração mínima
- ✅ Substitui Create React App (descontinuado)

**Alternativa considerada:** Webpack (descartado por ser mais lento e complexo)

#### TypeScript

**Justificação:**
- ✅ Tipagem estática previne erros em tempo de desenvolvimento
- ✅ IntelliSense melhora produtividade
- ✅ Facilita refatoração de código
- ✅ Autodocumentação do código

#### Tailwind CSS

**Justificação:**
- ✅ Utility-first (desenvolvimento rápido)
- ✅ Design consistente
- ✅ Responsivo por padrão
- ✅ Purge CSS remove classes não utilizadas
- ✅ Personalização via configuração

**Alternativa considerada:** Bootstrap (descartado por ser menos flexível)

### 2.4. Padrões e Boas Práticas

#### Context API

**Justificação:**
- ✅ Gestão de estado global (AuthContext, NotificationContext)
- ✅ Evita prop drilling
- ✅ Nativo do React (sem dependências externas)

**Alternativa considerada:** Redux (descartado por adicionar complexidade desnecessária)

#### Componentização

**Justificação:**
- ✅ Componentes reutilizáveis (Button, Layout, Modal)
- ✅ Separação de responsabilidades
- ✅ Facilita testes unitários
- ✅ Código mais limpo e organizado

#### RESTful API

**Justificação:**
- ✅ Padrão de mercado
- ✅ Fácil de entender e documentar
- ✅ Stateless (cada request é independente)
- ✅ Utiliza métodos HTTP semânticos (GET, POST, PATCH, DELETE)

### 2.5. Segurança

**Medidas Implementadas:**

1. **Autenticação JWT** - Tokens assinados e com expiração
2. **Hash de Passwords** - bcrypt com 10 salt rounds
3. **Validação Backend** - Todas as regras de negócio validadas no servidor
4. **CORS Configurado** - Previne requisições de origens não autorizadas
5. **SQL Injection Protection** - Prepared statements no SQLite

### 2.6. Responsividade

**Abordagem Mobile-First:**

Apesar de ser uma aplicação web, foi desenvolvida com foco em responsividade:

- ✅ Tailwind CSS com breakpoints (sm, md, lg, xl)
- ✅ Componentes adaptam-se ao tamanho do ecrã
- ✅ Touch-friendly (botões e áreas clicáveis grandes)
- ✅ Testado em diferentes resoluções

**Justificação para Web vs Mobile Nativo:**

Optou-se por uma **aplicação web responsiva** em vez de mobile nativo pelos seguintes motivos:

1. **Cross-platform:** Funciona em qualquer dispositivo com browser
2. **Sem instalação:** Acesso imediato via URL
3. **Atualizações instantâneas:** Sem necessidade de publicar em app stores
4. **Desenvolvimento mais rápido:** Um único codebase
5. **Tecnologias lecionadas:** React e Express foram abordados nas aulas

**Nota:** A aplicação funciona perfeitamente em smartphones modernos através do navegador.

---

## 3. Acesso à Aplicação

### 3.1. Instalação Rápida

Para instruções detalhadas de instalação, consulte o ficheiro **readme.txt** incluído no projeto.

**Resumo:**
1. Instalar Node.js e Git
2. Clonar repositório
3. Executar `npm install`
4. Executar `npm run reset-db`
5. Iniciar backend: `npm run server`
6. Iniciar frontend: `npm run dev`
7. Aceder a `http://localhost:3000`

---

## 4. Utilização da Aplicação

### 4.1. Login

#### Credenciais de Acesso

A aplicação fornece utilizadores de demonstração:

**Gestor:**
- **Username:** `admin`
- **Password:** `password123`

**Programador 1:**
- **Username:** `dev1`
- **Password:** `123`

**Programador 2:**
- **Username:** `dev2`
- **Password:** `123`

**[IMAGEM 1: Formulário de login preenchido com credenciais admin]**

---

### 4.2. Interface Principal

Após o login bem-sucedido, será apresentado o ecrã principal:

**[IMAGEM 2: Dashboard principal mostrando o Kanban Board]**

#### Elementos da Interface

1. **Barra Lateral Esquerda** - Menu de navegação
2. **Cabeçalho Superior** - Título, notificações e configurações
3. **Área Central** - Conteúdo principal (varia conforme a secção)

**[IMAGEM 9: Interface anotada identificando cada área]**

---

## 5. Funcionalidades por Perfil

### 5.1. Funcionalidades do GESTOR

#### 5.1.1. Task Board (Quadro Kanban)

O quadro Kanban apresenta três colunas:

- **To Do** - Tarefas por iniciar
- **Doing** - Tarefas em progresso
- **Done** - Tarefas concluídas

**[IMAGEM 10: Quadro Kanban completo com tarefas nas três colunas]**

##### Criar Nova Tarefa

1. Clique no botão **"+ New Task"**
2. Preencha o formulário:
   - **Título** (obrigatório)
   - **Descrição**
   - **Tipo de Tarefa**
   - **Story Points**
   - **Programador atribuído**
   - **Ordem de Execução**
   - **Data Prevista de Início**
   - **Data Prevista de Fim**

**[IMAGEM 11: Modal de criação de tarefa com todos os campos]**

3. Clique em **"Create Task"**
4. A tarefa aparecerá na coluna "To Do"

**[IMAGEM 12: Nova tarefa criada na coluna To Do]**

##### Editar Tarefa

1. Clique numa tarefa para ver os detalhes
2. Clique no botão **"Edit"** (apenas para Gestores)
3. Altere os campos desejados
4. Clique em **"Save Changes"**

**[IMAGEM 13: Modal de edição de tarefa]**

##### Filtrar Tarefas

Utilize os filtros disponíveis:

- **Busca por texto** - Pesquisa no título e descrição
- **Filtro por Programador** - Mostra tarefas de um programador específico
- **Filtro por Tipo** - Filtra por tipo de tarefa

**[IMAGEM 14: Barra de filtros em utilização]**

##### Estatísticas do Sprint

No topo do quadro, visualize:

- **Total de Tarefas**
- **Tarefas To Do**
- **Tarefas Doing**
- **Tarefas Done**
- **Total Story Points**
- **Barra de Progresso** do Sprint

**[IMAGEM 15: Cards de estatísticas do sprint]**

---

#### 5.1.2. Gestão de Utilizadores

**Menu:** Team Management

**[IMAGEM 16: Página de gestão de utilizadores]**

##### Criar Novo Utilizador

1. Clique em **"+ Add User"**
2. Preencha os campos:
   - Nome completo
   - Username (único)
   - Password
   - Role (Gestor ou Programador)
   - Nível de Experiência
   - Departamento
   - Gestor responsável (se aplicável)

**[IMAGEM 17: Formulário de criação de utilizador]**

3. Clique em **"Create"**

##### Editar Utilizador

1. Localize o utilizador na lista
2. Clique no ícone de edição (lápis)
3. Altere os dados necessários
4. Clique em **"Save"**

**[IMAGEM 18: Formulário de edição de utilizador]**

##### Eliminar Utilizador

1. Localize o utilizador
2. Clique no ícone de eliminar (caixote do lixo)
3. Confirme a eliminação

**⚠️ Atenção:** Esta ação não pode ser revertida.

---

#### 5.1.3. Gestão de Tipos de Tarefa

**Menu:** Task Types

**[IMAGEM 19: Página de gestão de tipos de tarefa]**

##### Criar Tipo de Tarefa

1. Clique em **"+ New Type"**
2. Defina:
   - **Nome** do tipo (ex: Feature, Bug, Refactor)
   - **Cor** associada

**[IMAGEM 20: Modal de criação de tipo de tarefa com seletor de cor]**

3. Clique em **"Save"**

##### Editar/Eliminar Tipo

- **Editar:** Clique no ícone de lápis
- **Eliminar:** Clique no ícone de caixote do lixo

---

#### 5.1.4. Relatório de Tarefas Concluídas

**Menu:** Reports → Completed Tasks

**[IMAGEM 21: Relatório de tarefas concluídas]**

Este relatório apresenta:

- **Lista de todas as tarefas concluídas** criadas pelo gestor
- **Comparação:** Tempo Planeado vs Tempo Real
- **Variação** (em dias)
- **Programador** que executou
- **Indicador visual:** Verde (dentro do prazo) ou Vermelho (atrasado)

##### Exportar para CSV

1. Clique no botão **"Export CSV"**
2. O ficheiro será descarregado automaticamente
3. Abra com Excel ou similar

**[IMAGEM 22: Botão de exportar CSV e exemplo do ficheiro gerado]**

**Formato do CSV:**
```
Programador;Descricao;DataPrevistaInicio;DataPrevistaFim;TipoTarefa;DataRealInicio;DataRealFim
```

---

#### 5.1.5. Tarefas em Curso

**Menu:** Reports → Tasks In Progress

**[IMAGEM 23: Relatório de tarefas em curso]**

Apresenta todas as tarefas **não concluídas**, mostrando:

- **Estado atual** (To Do ou Doing)
- **Programador atribuído**
- **Prazo de conclusão**
- **Tempo restante** ou **Dias de atraso**

**Códigos de cor:**
- 🟢 Verde - No prazo
- 🔴 Vermelho - Atrasada

---

#### 5.1.6. Estimador de Tempo (ToDo)

**Menu:** Reports → ToDo Time Estimator

**[IMAGEM 24: Página do estimador de tempo]**

##### Como Funciona

O algoritmo calcula o tempo previsto para concluir todas as tarefas "To Do" baseado em:

1. **Histórico:** Analisa tarefas concluídas anteriormente
2. **Story Points:** Calcula a média de dias por Story Point
3. **Proximidade:** Se não houver histórico para um SP específico, usa o mais próximo

**Exemplo:**
- Tarefas concluídas com 3 SP levaram em média 2 dias
- Tarefas concluídas com 5 SP levaram em média 3.5 dias
- Uma nova tarefa de 4 SP será estimada em ~2.75 dias

##### Informações Apresentadas

- **Tempo Total Estimado** (em dias)
- **Médias por Story Point** (baseadas no histórico)
- **Breakdown por Tarefa** - Estimativa individual para cada tarefa pendente

**[IMAGEM 25: Detalhes do estimador mostrando médias e breakdown]**

---

#### 5.1.7. Gestão de Projetos

**Menu:** Project Management

**[IMAGEM 26: Página de gestão de projetos/sprints]**

Visualize:

- **Sprints do projeto** (Sprint 1, 2, 3, 4)
- **Objetivo de cada Sprint**
- **Progresso** (tarefas concluídas vs total)
- **Story Points** completados
- **Lista de tarefas** por sprint

---

### 5.2. Funcionalidades do PROGRAMADOR

#### 5.2.1. Task Board (Quadro Kanban)

Os programadores podem:

- **Visualizar** todas as tarefas
- **Mover apenas as suas próprias tarefas** entre colunas (Drag & Drop)
- **Ver detalhes** de qualquer tarefa (clique na tarefa)

**[IMAGEM 27: Quadro Kanban da perspetiva do programador]**

##### Mover Tarefas (Drag & Drop)

1. Clique e segure numa tarefa
2. Arraste para a coluna desejada (To Do → Doing → Done)
3. Solte a tarefa

**[IMAGEM 28: Demonstração visual do drag and drop]**

**⚠️ Regras de Validação:**

1. **Propriedade:** Só pode mover as suas tarefas
2. **Sequência:** Deve respeitar a ordem de execução
3. **WIP Limit:** Máximo 2 tarefas em "Doing" simultaneamente
4. **Imutável:** Tarefas em "Done" não podem ser alteradas

**[IMAGEM 29: Mensagem de erro ao violar uma regra]**

---

#### 5.2.2. Tarefas Concluídas

**Menu:** Completed Tasks

**[IMAGEM 30: Lista de tarefas concluídas do programador]**

Visualize:

- **Todas as tarefas concluídas** por si
- **Tempo de execução** (em dias)
- **Datas reais** de início e fim
- **Story Points** de cada tarefa

---

### 5.3. Funcionalidades Comuns

#### 5.3.1. Notificações

Clique no ícone do **sino** (🔔) no cabeçalho.

**[IMAGEM 31: Dropdown de notificações aberto]**

##### Tipos de Notificações

- ✅ **Sucesso** (verde) - Tarefa criada, concluída
- ℹ️ **Info** (azul) - Tarefa atribuída, iniciada
- ⚠️ **Aviso** (amarelo) - Avisos do sistema
- ❌ **Erro** (vermelho) - Erros de validação

##### Gerir Notificações

- **Mark as read** - Marcar individual como lida
- **Mark all as read** - Marcar todas como lidas
- **Delete** (X) - Eliminar notificação
- **Clear all** - Limpar todas

**[IMAGEM 32: Exemplo de várias notificações com diferentes tipos]**

---

#### 5.3.2. Configurações

Clique no ícone de **engrenagem** (⚙️) no cabeçalho.

**[IMAGEM 33: Menu de configurações aberto]**

Opções disponíveis:

- **Dark Mode** - Alternar modo escuro (em desenvolvimento)
- **Notification Sounds** - Ativar/desativar sons
- **Privacy & Security** - Definições de privacidade
- **Help & Support** - Ajuda e suporte
- **Sign Out** - Terminar sessão

---

#### 5.3.3. Detalhes de Tarefa

Clique em qualquer tarefa para ver detalhes completos.

**[IMAGEM 34: Modal de detalhes de tarefa]**

**Informações apresentadas:**

- Título e Descrição
- Tipo e Story Points
- Programador e Gestor
- Datas Planeadas (início e fim)
- Datas Reais (início e fim)
- Estado Atual
- Ordem de Execução

**Para Gestores:** Botão "Edit" disponível para editar.

---

## 6. Resolução de Problemas

### 6.1. Não consigo fazer login

**Problema:** Mensagem "Credenciais inválidas"

**Solução:**

1. Pare o servidor backend (Ctrl+C)
2. Execute:
   ```bash
   npm run reset-db
   npm run server
   ```
3. Use as credenciais corretas:
   - Gestor: `admin` / `password123`
   - Programador: `dev1` / `123`

**[IMAGEM 35: Terminal executando reset-db]**

---

### 6.2. Servidor não inicia

**Problema:** Erro "address already in use"

**Solução:**

1. Verifique se já existe um processo na porta 3001:
   
   **Windows:**
   ```bash
   netstat -ano | findstr :3001
   ```
   
   **macOS/Linux:**
   ```bash
   lsof -i :3001
   ```

2. Termine o processo existente ou use outra porta

---

### 6.3. Frontend não carrega

**Problema:** Ecrã em branco ou erro 404

**Solução:**

1. Verifique se o frontend está a correr em `http://localhost:3000`
2. Verifique a consola do browser (F12) para erros
3. Reinicie o frontend:
   ```bash
   Ctrl+C
   npm run dev
   ```

---

### 6.4. Base de dados corrompida

**Problema:** Erros estranhos ou dados inconsistentes

**Solução:**

1. Resetar completamente a base de dados:
   ```bash
   npm run reset-db
   npm run server
   ```

2. Todos os dados de teste serão recriados

---

### 6.5. Notificações não aparecem

**Problema:** Sino sem badge ou notificações não surgem

**Solução:**

1. Recarregue a página (F5)
2. Limpe a cache do browser (Ctrl+Shift+Delete)
3. Verifique se há erros na consola (F12)

---

## 7. Suporte Técnico

### Informações de Contacto

**Desenvolvedor:** Guilherme Morais  
**Email:** guilhermeetoogmorais@gmail.com  
**GitHub:** [@guilherme-moraiss](https://github.com/guilherme-moraiss)

### Reportar Problemas

Para reportar bugs ou sugerir melhorias:

1. Aceda ao repositório: [GitHub](https://github.com/guilherme-moraiss/kanbanflow-manager-guilherme-morais)
2. Clique em "Issues"
3. Clique em "New Issue"
4. Descreva o problema detalhadamente

---

## 8. Tecnologias Utilizadas

### Backend
- Node.js + Express
- SQLite3
- JWT (autenticação)
- bcrypt (segurança)

### Frontend
- Vite + React 18
- TypeScript
- Tailwind CSS
- Lucide React (ícones)

---

## Anexo A: Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + K` | Abrir busca rápida |
| `Esc` | Fechar modais |
| `F5` | Recarregar página |
| `Ctrl + Shift + Delete` | Limpar cache |

---

## Anexo B: Estrutura da Base de Dados

### Tabelas Principais

1. **Users** - Utilizadores do sistema
2. **Tasks** - Tarefas do projeto
3. **TaskTypes** - Tipos de tarefas

**[IMAGEM 36: Diagrama da base de dados]**

---

**Fim do Manual**

---

**Versão:** 1.0  
**Última Atualização:** Novembro 2025

