================================================================================
                          KANBANFLOW MANAGER
                     Sistema de Gestão de Tarefas Kanban
================================================================================

INFORMAÇÕES DO GRUPO
--------------------
Desenvolvido por:
- Nome: Guilherme Morais
- Número: 2024240
- Email: guilhermeetoogmorais@gmail.com

Turma: Diurna
Grupo: 3

================================================================================
1. REQUISITOS DO SISTEMA
================================================================================

Software Obrigatório:
- Node.js versão 18 ou superior (https://nodejs.org)
- NPM (incluído com Node.js)
- Git (https://git-scm.com)
- Navegador Web moderno (Chrome, Firefox, Edge)

Para verificar se está instalado, execute no terminal:
  node --version
  npm --version
  git --version

================================================================================
2. INSTALAÇÃO
================================================================================

2.1. Clonar o Repositório
--------------------------
git clone https://github.com/guilherme-moraiss/kanbanflow-manager-guilherme-morais.git
cd kanbanflow-manager-guilherme-morais


2.2. Instalar Dependências
---------------------------
npm install

(Aguarde 2-5 minutos até terminar)


2.3. Criar Base de Dados
-------------------------
npm run reset-db

Saída esperada: "✅ Database deleted successfully!"

================================================================================
3. EXECUÇÃO
================================================================================

3.1. Iniciar o Servidor Backend
--------------------------------
Abra um terminal e execute:

npm run server

Saída esperada:
  Seeding users with hashed passwords...
  User admin seeded with hashed password
  User dev1 seeded with hashed password
  User dev2 seeded with hashed password
  All users seeded successfully!
  Server running on http://localhost:3001

⚠️ IMPORTANTE: Mantenha este terminal aberto!


3.2. Iniciar o Frontend
------------------------
Abra um SEGUNDO terminal (nova janela/aba) e execute:

npm run dev

Saída esperada:
  VITE v5.4.21 ready in 269 ms
  ➜ Local: http://localhost:3000/

⚠️ IMPORTANTE: Mantenha este terminal também aberto!


3.3. Aceder à Aplicação
------------------------
Abra o navegador e aceda a:

http://localhost:3000

================================================================================
4. CREDENCIAIS DE ACESSO
================================================================================

A aplicação vem com utilizadores de demonstração:

GESTOR (Manager):
- Username: admin
- Password: password123

PROGRAMADOR 1:
- Username: dev1
- Password: 123

PROGRAMADOR 2:
- Username: dev2
- Password: 123

================================================================================
5. ESTRUTURA DO PROJETO
================================================================================

kanbanflow-manager-guilherme-morais/
├── components/          # Componentes React (UI)
├── context/            # Contextos (Auth, Notifications)
├── services/           # Cliente API
├── server/             # Backend Express
│   ├── routes/         # Rotas da API REST
│   ├── database.js     # Configuração SQLite
│   ├── kanban.db       # Base de dados (criado automaticamente)
│   └── reset-db.js     # Script de reset da BD
├── types/              # TypeScript types
├── public/             # Assets estáticos
├── package.json        # Dependências
├── README.md           # Documentação do projeto
└── readme.txt          # Este ficheiro

================================================================================
6. SCRIPTS DISPONÍVEIS
================================================================================

npm run dev        - Inicia o frontend (desenvolvimento)
npm run build      - Compila o frontend para produção
npm run preview    - Preview da build de produção
npm run server     - Inicia o servidor backend
npm run reset-db   - Reseta a base de dados

================================================================================
7. TECNOLOGIAS UTILIZADAS
================================================================================

Backend:
- Node.js + Express.js (servidor web)
- SQLite3 (base de dados)
- JWT (autenticação)
- bcryptjs (hash de passwords)
- CORS (configuração de acesso)

Frontend:
- Vite (build tool)
- React 18 (biblioteca UI)
- TypeScript (tipagem estática)
- Tailwind CSS (framework CSS)
- Lucide React (ícones)

================================================================================
8. RESOLUÇÃO DE PROBLEMAS
================================================================================

8.1. Erro: "Credenciais inválidas" no login
--------------------------------------------
Solução:
  npm run reset-db
  npm run server

Use as credenciais corretas: admin / password123


8.2. Erro: "address already in use"
------------------------------------
A porta 3000 ou 3001 já está a ser utilizada.

Windows:
  netstat -ano | findstr :3001
  taskkill /PID <numero_processo> /F

macOS/Linux:
  lsof -i :3001
  kill -9 <numero_processo>


8.3. Erro: "Cannot find module"
--------------------------------
Dependências não instaladas.

Solução:
  npm install


8.4. Frontend não carrega
--------------------------
1. Verifique se o backend está a correr (terminal 1)
2. Verifique se acedeu a http://localhost:3000
3. Abra a consola do navegador (F12) para ver erros

================================================================================
9. REPOSITÓRIO GIT/GITHUB
================================================================================

GitHub: https://github.com/guilherme-moraiss/kanbanflow-manager-guilherme-morais
Nome do repositório: kanbanflow-manager-guilherme-morais

Todos os commits estão disponíveis no histórico Git.
Use "git log" para ver o histórico de desenvolvimento.

================================================================================
10. SUPORTE
================================================================================

Para questões ou problemas:
Email: guilhermeetoogmorais@gmail.com
GitHub Issues: https://github.com/guilherme-moraiss/kanbanflow-manager-guilherme-morais/issues

================================================================================
11. NOTAS IMPORTANTES
================================================================================

- A base de dados SQLite é criada automaticamente na primeira execução
- Os dados de seed são inseridos se a base estiver vazia
- Backend corre na porta 3001
- Frontend corre na porta 3000 (Vite default)
- Para resetar completamente: npm run reset-db

================================================================================

Última atualização: Novembro 2025
Versão: 1.0

================================================================================

