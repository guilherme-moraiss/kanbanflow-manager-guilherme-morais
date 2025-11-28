import { User, AuthResponse, Task, TaskType, TaskStatus } from '../types';

const API_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  if (response.status === 204) return;
  return response.json();
};

export const apiBackend = {
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return handleResponse(response);
    }
  },
  
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await fetch(`${API_URL}/users`);
      return handleResponse(response);
    },

    create: async (user: Omit<User, 'id'>): Promise<User> => {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return handleResponse(response);
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  tasks: {
    getTaskTypes: async (): Promise<TaskType[]> => {
      const response = await fetch(`${API_URL}/task-types`);
      return handleResponse(response);
    },

    createTaskType: async (taskType: Omit<TaskType, 'id'>): Promise<TaskType> => {
      const response = await fetch(`${API_URL}/task-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskType)
      });
      return handleResponse(response);
    },

    updateTaskType: async (id: string, updates: Partial<TaskType>): Promise<TaskType> => {
      const response = await fetch(`${API_URL}/task-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return handleResponse(response);
    },

    deleteTaskType: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/task-types/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    },

    getAll: async (currentUser: User): Promise<Task[]> => {
      const response = await fetch(
        `${API_URL}/tasks?userId=${currentUser.id}&userRole=${currentUser.role}`
      );
      const tasks = await handleResponse(response);
      
      return tasks.map((task: any) => ({
        id: task.id,
        title: task.titulo,
        description: task.descricao,
        storyPoints: task.storyPoints,
        plannedStartDate: task.dataPrevistaInicio,
        plannedEndDate: task.dataPrevistaFim,
        realStartDate: task.dataRealInicio,
        realEndDate: task.dataRealFim,
        status: task.estado as TaskStatus,
        executionOrder: task.ordemExecucao,
        managerId: task.gestorId,
        developerId: task.programadorId,
        taskTypeId: task.tipoTarefaId,
        managerName: task.gestorNome,
        developerName: task.programadorNome,
        developerAvatar: task.programadorAvatar,
        taskTypeName: task.tipoTarefaNome,
        taskTypeColor: task.tipoTarefaCor
      }));
    },

    create: async (taskData: Omit<Task, 'id'>, managerId: string): Promise<Task> => {
      const payload = {
        titulo: taskData.title,
        descricao: taskData.description,
        storyPoints: taskData.storyPoints,
        dataPrevistaInicio: taskData.plannedStartDate,
        dataPrevistaFim: taskData.plannedEndDate,
        ordemExecucao: taskData.executionOrder,
        programadorId: taskData.developerId,
        tipoTarefaId: taskData.taskTypeId,
        gestorId: managerId
      };

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const task = await handleResponse(response);
      
      return {
        id: task.id,
        title: task.titulo,
        description: task.descricao,
        storyPoints: task.storyPoints,
        plannedStartDate: task.dataPrevistaInicio,
        plannedEndDate: task.dataPrevistaFim,
        realStartDate: task.dataRealInicio,
        realEndDate: task.dataRealFim,
        status: task.estado as TaskStatus,
        executionOrder: task.ordemExecucao,
        managerId: task.gestorId,
        developerId: task.programadorId,
        taskTypeId: task.tipoTarefaId
      };
    },

    move: async (taskId: string, newStatus: TaskStatus, user: User): Promise<Task> => {
      const response = await fetch(`${API_URL}/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: newStatus,
          userId: user.id,
          userRole: user.role
        })
      });
      
      const task = await handleResponse(response);
      
      return {
        id: task.id,
        title: task.titulo,
        description: task.descricao,
        storyPoints: task.storyPoints,
        plannedStartDate: task.dataPrevistaInicio,
        plannedEndDate: task.dataPrevistaFim,
        realStartDate: task.dataRealInicio,
        realEndDate: task.dataRealFim,
        status: task.estado as TaskStatus,
        executionOrder: task.ordemExecucao,
        managerId: task.gestorId,
        developerId: task.programadorId,
        taskTypeId: task.tipoTarefaId
      };
    },

    update: async (taskId: string, taskData: Partial<Task>, userRole: string): Promise<Task> => {
      const payload: any = {
        userRole
      };

      if (taskData.title !== undefined) payload.titulo = taskData.title;
      if (taskData.description !== undefined) payload.descricao = taskData.description;
      if (taskData.storyPoints !== undefined) payload.storyPoints = taskData.storyPoints;
      if (taskData.plannedStartDate !== undefined) payload.dataPrevistaInicio = taskData.plannedStartDate;
      if (taskData.plannedEndDate !== undefined) payload.dataPrevistaFim = taskData.plannedEndDate;
      if (taskData.executionOrder !== undefined) payload.ordemExecucao = taskData.executionOrder;
      if (taskData.developerId !== undefined) payload.programadorId = taskData.developerId;
      if (taskData.taskTypeId !== undefined) payload.tipoTarefaId = taskData.taskTypeId;

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const task = await handleResponse(response);

      return {
        id: task.id,
        title: task.titulo,
        description: task.descricao,
        storyPoints: task.storyPoints,
        plannedStartDate: task.dataPrevistaInicio,
        plannedEndDate: task.dataPrevistaFim,
        executionOrder: task.ordemExecucao,
        status: task.estado,
        createdDate: task.dataCriacao,
        realStartDate: task.dataRealInicio,
        realEndDate: task.dataRealFim,
        developerId: task.programadorId,
        developerName: task.programadorNome,
        developerAvatar: task.programadorAvatar,
        managerId: task.gestorId,
        managerName: task.gestorNome,
        taskTypeName: task.tipoTarefaNome,
        taskTypeColor: task.tipoTarefaCor,
        taskTypeId: task.tipoTarefaId
      };
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  }
};

