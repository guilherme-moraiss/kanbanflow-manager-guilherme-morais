import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import UserManagement from './components/UserManagement';
import KanbanBoard from './components/KanbanBoard';
import ProjectManagement from './components/ProjectManagement';
import CompletedTasks from './components/CompletedTasks';
import TaskTypeManagement from './components/TaskTypeManagement';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks'); // Default to Tasks for Sprint 2

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout activeTab={activeTab} onNavigate={setActiveTab}>
      {activeTab === 'users' ? (
        <UserManagement />
      ) : activeTab === 'project' ? (
        <ProjectManagement />
      ) : activeTab === 'completed' ? (
        <CompletedTasks />
      ) : activeTab === 'tasktypes' ? (
        <TaskTypeManagement />
      ) : (
        <KanbanBoard />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;