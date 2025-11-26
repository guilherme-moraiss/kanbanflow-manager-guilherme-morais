const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const taskTypesRoutes = require('./routes/taskTypes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/task-types', taskTypesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'KanbanFlow API Server' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

