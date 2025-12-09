const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database to initialize it
require('./database');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const taskTypesRoutes = require('./routes/taskTypes');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting server...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${PORT}`);

app.use(cors());
app.use(express.json());

// Log all requests in production for debugging
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/task-types', taskTypesRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'KanbanFlow API Server - Development Mode' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API endpoints available at /api/*`);
});

