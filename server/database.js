const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'kanban.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        experienceLevel TEXT NOT NULL,
        department TEXT,
        managerId TEXT,
        avatarUrl TEXT,
        FOREIGN KEY (managerId) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS TaskTypes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        storyPoints INTEGER,
        dataPrevistaInicio TEXT,
        dataPrevistaFim TEXT,
        dataRealInicio TEXT,
        dataRealFim TEXT,
        estado TEXT NOT NULL CHECK(estado IN ('TODO', 'DOING', 'DONE')),
        ordemExecucao INTEGER NOT NULL,
        gestorId TEXT NOT NULL,
        programadorId TEXT,
        tipoTarefaId TEXT NOT NULL,
        FOREIGN KEY (gestorId) REFERENCES Users(id),
        FOREIGN KEY (programadorId) REFERENCES Users(id),
        FOREIGN KEY (tipoTarefaId) REFERENCES TaskTypes(id),
        UNIQUE(programadorId, ordemExecucao)
      )
    `);

    const seedUsers = [
      {
        id: '1',
        name: 'Alice Manager',
        username: 'admin',
        password: 'password123',
        role: 'MANAGER',
        experienceLevel: 'SENIOR',
        department: 'Engineering',
        managerId: null
      },
      {
        id: '2',
        name: 'Bob Developer',
        username: 'dev1',
        password: '123',
        role: 'DEVELOPER',
        experienceLevel: 'MID',
        department: 'Frontend',
        managerId: '1'
      },
      {
        id: '3',
        name: 'Charlie Coder',
        username: 'dev2',
        password: '123',
        role: 'DEVELOPER',
        experienceLevel: 'JUNIOR',
        department: 'Backend',
        managerId: '1'
      }
    ];

    db.get('SELECT COUNT(*) as count FROM Users', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        seedUsers.forEach(user => {
          stmt.run(
            user.id,
            user.name,
            user.username,
            user.password,
            user.role,
            user.experienceLevel,
            user.department,
            user.managerId,
            user.avatarUrl || null
          );
        });
        stmt.finalize();
        console.log('Users seeded');
      }
    });

    const seedTaskTypes = [
      { id: '1', name: 'Feature', color: '#3b82f6' },
      { id: '2', name: 'Bug', color: '#ef4444' },
      { id: '3', name: 'Refactor', color: '#f59e0b' }
    ];

    db.get('SELECT COUNT(*) as count FROM TaskTypes', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO TaskTypes VALUES (?, ?, ?)');
        seedTaskTypes.forEach(type => {
          stmt.run(type.id, type.name, type.color);
        });
        stmt.finalize();
        console.log('TaskTypes seeded');
      }
    });

    const seedTasks = [
      {
        id: '101',
        titulo: 'Setup Project Infrastructure',
        descricao: 'Initialize Next.js and Express servers.',
        storyPoints: 5,
        estado: 'DONE',
        ordemExecucao: 1,
        gestorId: '1',
        programadorId: '2',
        tipoTarefaId: '1',
        dataRealInicio: new Date(Date.now() - 86400000 * 2).toISOString(),
        dataRealFim: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '102',
        titulo: 'Implement Authentication',
        descricao: 'JWT implementation for login.',
        storyPoints: 8,
        estado: 'DOING',
        ordemExecucao: 2,
        gestorId: '1',
        programadorId: '2',
        tipoTarefaId: '1',
        dataRealInicio: new Date().toISOString()
      },
      {
        id: '103',
        titulo: 'Fix Login CSS Issue',
        descricao: 'Inputs are invisible on white background.',
        storyPoints: 2,
        estado: 'TODO',
        ordemExecucao: 1,
        gestorId: '1',
        programadorId: '3',
        tipoTarefaId: '2'
      }
    ];

    db.get('SELECT COUNT(*) as count FROM Tasks', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO Tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        seedTasks.forEach(task => {
          stmt.run(
            task.id,
            task.titulo,
            task.descricao,
            task.storyPoints,
            task.dataPrevistaInicio || null,
            task.dataPrevistaFim || null,
            task.dataRealInicio || null,
            task.dataRealFim || null,
            task.estado,
            task.ordemExecucao,
            task.gestorId,
            task.programadorId,
            task.tipoTarefaId
          );
        });
        stmt.finalize();
        console.log('Tasks seeded');
      }
    });
  });
};

initializeDatabase();

module.exports = db;

