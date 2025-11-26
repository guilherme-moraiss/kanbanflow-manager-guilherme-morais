import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'done' | 'in-progress' | 'todo';
  storyPoints: number;
  sprint: number;
}

const ProjectManagement: React.FC = () => {
  const [selectedSprint, setSelectedSprint] = useState<number>(1);

  const tasks: Task[] = [
    { id: 'KAN-1', title: 'Criar estrutura de pastas do projeto', status: 'done', storyPoints: 2, sprint: 1 },
    { id: 'KAN-2', title: 'Configurar servidor Express', status: 'done', storyPoints: 3, sprint: 1 },
    { id: 'KAN-3', title: 'Criar conexão SQLite', status: 'done', storyPoints: 2, sprint: 1 },
    { id: 'KAN-4', title: 'Criar tabela Users', status: 'done', storyPoints: 2, sprint: 1 },
    { id: 'KAN-5', title: 'Criar tabela TaskTypes', status: 'done', storyPoints: 1, sprint: 1 },
    { id: 'KAN-6', title: 'Implementar seed data', status: 'done', storyPoints: 2, sprint: 1 },
    { id: 'KAN-7', title: 'Criar rota POST /auth/login', status: 'done', storyPoints: 3, sprint: 1 },
    { id: 'KAN-8', title: 'Implementar AuthContext no frontend', status: 'done', storyPoints: 2, sprint: 1 },
    { id: 'KAN-9', title: 'Criar componente Login', status: 'done', storyPoints: 3, sprint: 1 },
    { id: 'KAN-10', title: 'Criar rotas CRUD de Users', status: 'done', storyPoints: 5, sprint: 1 },
    { id: 'KAN-11', title: 'Criar componente UserManagement', status: 'done', storyPoints: 5, sprint: 1 },
    { id: 'KAN-12', title: 'Criar componente Layout com sidebar', status: 'done', storyPoints: 3, sprint: 1 },
    { id: 'KAN-13', title: 'Integrar frontend com backend', status: 'done', storyPoints: 2, sprint: 1 },
    
    { id: 'KAN-14', title: 'Criar tabela Tasks no SQLite', status: 'done', storyPoints: 3, sprint: 2 },
    { id: 'KAN-15', title: 'Criar rota POST /tasks', status: 'done', storyPoints: 3, sprint: 2 },
    { id: 'KAN-16', title: 'Criar rota GET /tasks', status: 'done', storyPoints: 3, sprint: 2 },
    { id: 'KAN-17', title: 'Criar rota PATCH /tasks/:id/move', status: 'done', storyPoints: 3, sprint: 2 },
    { id: 'KAN-18', title: 'Criar rota DELETE /tasks/:id', status: 'done', storyPoints: 2, sprint: 2 },
    { id: 'KAN-19', title: 'Criar serviço apiBackend.ts', status: 'done', storyPoints: 3, sprint: 2 },
    { id: 'KAN-20', title: 'Criar componente KanbanBoard', status: 'done', storyPoints: 5, sprint: 2 },
    { id: 'KAN-21', title: 'Implementar 3 colunas', status: 'done', storyPoints: 2, sprint: 2 },
    { id: 'KAN-22', title: 'Implementar Drag & Drop', status: 'done', storyPoints: 5, sprint: 2 },
    { id: 'KAN-23', title: 'Criar modal de criação de tarefa', status: 'done', storyPoints: 5, sprint: 2 },
    
    { id: 'KAN-27', title: 'Validar propriedade de tarefa', status: 'done', storyPoints: 3, sprint: 3 },
    { id: 'KAN-28', title: 'Bloquear alteração de tarefas concluídas', status: 'done', storyPoints: 2, sprint: 3 },
    { id: 'KAN-29', title: 'Implementar limite WIP', status: 'done', storyPoints: 3, sprint: 3 },
    { id: 'KAN-30', title: 'Validar ordem de execução', status: 'done', storyPoints: 5, sprint: 3 },
    
    { id: 'KAN-32', title: 'Implementar JWT real', status: 'todo', storyPoints: 5, sprint: 4 },
    { id: 'KAN-33', title: 'Adicionar bcrypt para passwords', status: 'todo', storyPoints: 3, sprint: 4 },
    { id: 'KAN-34', title: 'Relatório tarefas concluídas (Dev)', status: 'todo', storyPoints: 5, sprint: 4 },
    { id: 'KAN-35', title: 'Relatório tarefas concluídas (Gestor)', status: 'todo', storyPoints: 8, sprint: 4 },
  ];

  const sprintTasks = tasks.filter(t => t.sprint === selectedSprint);
  const totalPoints = sprintTasks.reduce((acc, t) => acc + t.storyPoints, 0);
  const donePoints = sprintTasks.filter(t => t.status === 'done').reduce((acc, t) => acc + t.storyPoints, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done': return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Done</span>;
      case 'in-progress': return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">In Progress</span>;
      default: return <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">To Do</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map(sprint => (
          <button
            key={sprint}
            onClick={() => setSelectedSprint(sprint)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSprint === sprint
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Sprint {sprint}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Sprint {selectedSprint}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {donePoints} / {totalPoints} Story Points
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Progresso</div>
            <div className="text-2xl font-bold text-indigo-600">
              {totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all" 
            style={{ width: `${totalPoints > 0 ? (donePoints / totalPoints) * 100 : 0}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {sprintTasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors">
              {getStatusIcon(task.status)}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-500">{task.id}</span>
                  <span className="text-sm font-medium text-slate-800">{task.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 font-mono">{task.storyPoints} SP</span>
                {getStatusBadge(task.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;

