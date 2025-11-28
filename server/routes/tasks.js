const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

router.post('/', (req, res) => {
  const {
    titulo,
    descricao,
    storyPoints,
    dataPrevistaInicio,
    dataPrevistaFim,
    ordemExecucao,
    programadorId,
    tipoTarefaId,
    gestorId
  } = req.body;

  if (!gestorId) {
    return res.status(401).json({ error: 'Gestor ID é obrigatório' });
  }

  db.get('SELECT role FROM Users WHERE id = ?', [gestorId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    if (user.role !== 'MANAGER') {
      return res.status(403).json({ error: 'Apenas gestores podem criar tarefas' });
    }

    if (programadorId && ordemExecucao) {
      db.get(
        'SELECT id FROM Tasks WHERE programadorId = ? AND ordemExecucao = ?',
        [programadorId, ordemExecucao],
        (err, existingTask) => {
          if (err) return res.status(500).json({ error: err.message });
          if (existingTask) {
            return res.status(400).json({
              error: `OrdemExecucao ${ordemExecucao} já está em uso para este programador`
            });
          }

          createTask();
        }
      );
    } else {
      createTask();
    }

    function createTask() {
      const id = uuidv4();
      const estado = 'TODO';

      db.run(
        `INSERT INTO Tasks (
          id, titulo, descricao, storyPoints, dataPrevistaInicio, dataPrevistaFim,
          dataRealInicio, dataRealFim, estado, ordemExecucao, gestorId, programadorId, tipoTarefaId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          titulo,
          descricao,
          storyPoints,
          dataPrevistaInicio || null,
          dataPrevistaFim || null,
          null,
          null,
          estado,
          ordemExecucao,
          gestorId,
          programadorId || null,
          tipoTarefaId
        ],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          db.get('SELECT * FROM Tasks WHERE id = ?', [id], (err, task) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(task);
          });
        }
      );
    }
  });
});

router.get('/', (req, res) => {
  const { userId, userRole } = req.query;

  if (!userId || !userRole) {
    return res.status(400).json({ error: 'userId e userRole são obrigatórios' });
  }

  let query = `
    SELECT 
      t.*,
      u1.name as programadorNome,
      u1.avatarUrl as programadorAvatar,
      u2.name as gestorNome,
      tt.name as tipoTarefaNome,
      tt.color as tipoTarefaCor
    FROM Tasks t
    LEFT JOIN Users u1 ON t.programadorId = u1.id
    LEFT JOIN Users u2 ON t.gestorId = u2.id
    LEFT JOIN TaskTypes tt ON t.tipoTarefaId = tt.id
  `;

  db.all(query, [], (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tasks);
  });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descricao,
    storyPoints,
    dataPrevistaInicio,
    dataPrevistaFim,
    ordemExecucao,
    programadorId,
    tipoTarefaId,
    userRole
  } = req.body;

  if (userRole !== 'MANAGER') {
    return res.status(403).json({ error: 'Apenas gestores podem editar tarefas' });
  }

  db.get('SELECT * FROM Tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    if (task.estado === 'DONE') {
      return res.status(400).json({ error: 'Tarefas concluídas não podem ser editadas' });
    }

    const updates = [];
    const values = [];

    if (titulo !== undefined) {
      updates.push('titulo = ?');
      values.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      values.push(descricao);
    }
    if (storyPoints !== undefined) {
      updates.push('storyPoints = ?');
      values.push(storyPoints);
    }
    if (dataPrevistaInicio !== undefined) {
      updates.push('dataPrevistaInicio = ?');
      values.push(dataPrevistaInicio);
    }
    if (dataPrevistaFim !== undefined) {
      updates.push('dataPrevistaFim = ?');
      values.push(dataPrevistaFim);
    }
    if (ordemExecucao !== undefined) {
      updates.push('ordemExecucao = ?');
      values.push(ordemExecucao);
    }
    if (programadorId !== undefined) {
      updates.push('programadorId = ?');
      values.push(programadorId);
    }
    if (tipoTarefaId !== undefined) {
      updates.push('tipoTarefaId = ?');
      values.push(tipoTarefaId);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    values.push(id);

    db.run(
      `UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`,
      values,
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.get(
          `SELECT
            t.*,
            u1.name as programadorNome,
            u1.avatarUrl as programadorAvatar,
            u2.name as gestorNome,
            tt.name as tipoTarefaNome,
            tt.color as tipoTarefaCor
          FROM Tasks t
          LEFT JOIN Users u1 ON t.programadorId = u1.id
          LEFT JOIN Users u2 ON t.gestorId = u2.id
          LEFT JOIN TaskTypes tt ON t.tipoTarefaId = tt.id
          WHERE t.id = ?`,
          [id],
          (err, updatedTask) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(updatedTask);
          }
        );
      }
    );
  });
});

router.patch('/:id/move', (req, res) => {
  const { id } = req.params;
  const { estado, userId, userRole } = req.body;

  if (!estado || !['TODO', 'DOING', 'DONE'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.get('SELECT * FROM Tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    if (userRole === 'DEVELOPER' && task.programadorId !== userId) {
      return res.status(403).json({ error: 'Apenas pode mover suas proprias tarefas' });
    }

    if (task.estado === 'DONE') {
      return res.status(400).json({ error: 'Tarefas concluidas nao podem ser alteradas' });
    }

    if (estado === 'DOING' || estado === 'DONE') {
      db.get(
        'SELECT COUNT(*) as count FROM Tasks WHERE programadorId = ? AND ordemExecucao < ? AND estado = ?',
        [task.programadorId, task.ordemExecucao, 'TODO'],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          
          if (result.count > 0) {
            return res.status(400).json({ error: 'Deve executar tarefas pela ordem definida' });
          }

          if (estado === 'DOING' && task.estado !== 'DOING') {
            db.get(
              'SELECT COUNT(*) as count FROM Tasks WHERE programadorId = ? AND estado = ?',
              [task.programadorId, 'DOING'],
              (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                
                if (result.count >= 2) {
                  return res.status(400).json({ error: 'Maximo de 2 tarefas em execucao simultanea' });
                }

                continueMove();
              }
            );
            return;
          }

          continueMove();
        }
      );
      return;
    }

    continueMove();

    function continueMove() {
      const now = new Date().toISOString();
      let updates = { estado };

    if (estado === 'DOING' && task.estado === 'TODO') {
      updates.dataRealInicio = now;
    }

    if (estado === 'DONE') {
      updates.dataRealFim = now;
    }

    if (task.estado === 'DONE' && estado !== 'DONE') {
      updates.dataRealFim = null;
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    db.run(`UPDATE Tasks SET ${setClause} WHERE id = ?`, values, function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get('SELECT * FROM Tasks WHERE id = ?', [id], (err, updatedTask) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updatedTask);
      });
    });
    }
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM Tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(204).send();
  });
});

module.exports = router;

