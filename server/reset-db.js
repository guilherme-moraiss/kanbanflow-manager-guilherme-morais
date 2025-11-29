const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'kanban.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Database deleted successfully!');
  console.log('Now run: npm run server');
} else {
  console.log('ℹ️  Database file not found - already deleted or never created');
}

