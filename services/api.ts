import { User, AuthResponse, UserRole, ExperienceLevel, Task, TaskType, TaskStatus } from '../types';
import { db } from './mockDb';

const DELAY_MS = 400;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      await delay(DELAY_MS);
      const user = db.findUserByUsername(username);
      
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Return user without password
      const { password: _, ...safeUser } = user;
      return {
        token: 'fake-jwt-token-' + Date.now(),
        user: safeUser as User
      };
    }
  },
  
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(DELAY_MS);
      return db.getUsers().map(({ password, ...u }) => u as User);
    },

    create: async (user: Omit<User, 'id'>): Promise<User> => {
      await delay(DELAY_MS);
      const users = db.getUsers();
      
      if (users.some(u => u.username === user.username)) {
        throw new Error('Username already exists');
      }

      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      users.push(newUser);
      db.saveUsers(users);
      
      const { password: _, ...safeUser } = newUser;
      return safeUser as User;
    },

    update: async (id: string, updates: Partial<User>): Promise<User> => {
      await delay(DELAY_MS);
      const users = db.getUsers();
      const index = users.findIndex(u => u.id === id);
      
      if (index === -1) throw new Error('User not found');
      
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      db.saveUsers(users);

      const { password: _, ...safeUser } = updatedUser;
      return safeUser as User;
    },

    delete: async (id: string): Promise<void> => {
      await delay(DELAY_MS);
      const users = db.getUsers();
      const filtered = users.filter(u => u.id !== id);
      db.saveUsers(filtered);
    }
  },

  tasks: {
    getTaskTypes: async (): Promise<TaskType[]> => {
      await delay(DELAY_MS);
      return db.getTaskTypes();
    },

    getAll: async (currentUser: User): Promise<Task[]> => {
      await delay(DELAY_MS);
      const tasks = db.getTasks();
      const users = db.getUsers();
      const types = db.getTaskTypes();

      // Filter Logic based on requirements:
      // Programador: Return All (or assigned to him - prompt said 'retorne todas')
      // Gestor: Return created by him.
      let filteredTasks = tasks;
      if (currentUser.role === UserRole.MANAGER) {
         filteredTasks = tasks.filter(t => t.managerId === currentUser.id);
      }

      // Simulate SQL JOINs to enrich data for frontend
      return filteredTasks.map(task => {
        const dev = users.find(u => u.id === task.developerId);
        const manager = users.find(u => u.id === task.managerId);
        const type = types.find(t => t.id === task.taskTypeId);
        
        return {
          ...task,
          developerName: dev ? dev.name : 'Unassigned',
          developerAvatar: dev ? dev.avatarUrl : undefined,
          managerName: manager ? manager.name : 'Unknown',
          taskTypeName: type ? type.name : 'General',
          taskTypeColor: type ? type.color : '#cbd5e1'
        };
      });
    },

    create: async (taskData: Omit<Task, 'id'>, managerId: string): Promise<Task> => {
      await delay(DELAY_MS);
      const tasks = db.getTasks();

      // Validation: Uniqueness of Execution Order per Developer
      if (taskData.developerId) {
        const conflict = tasks.find(t => 
          t.developerId === taskData.developerId && 
          t.executionOrder === taskData.executionOrder &&
          t.status !== TaskStatus.DONE // Assuming order matters for active tasks
        );
        if (conflict) {
          throw new Error(`Execution Order ${taskData.executionOrder} is already taken for this developer.`);
        }
      }

      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        managerId: managerId,
        status: TaskStatus.TODO, // Default starting status
        realStartDate: undefined,
        realEndDate: undefined
      };

      tasks.push(newTask);
      db.saveTasks(tasks);
      return newTask;
    },

    move: async (taskId: string, newStatus: TaskStatus): Promise<Task> => {
      await delay(DELAY_MS);
      const tasks = db.getTasks();
      const index = tasks.findIndex(t => t.id === taskId);
      
      if (index === -1) throw new Error('Task not found');
      
      const task = tasks[index];
      const updates: Partial<Task> = { status: newStatus };

      // Business Logic: Auto-update dates
      const now = new Date().toISOString();

      if (newStatus === TaskStatus.DOING && task.status === TaskStatus.TODO) {
        updates.realStartDate = now;
      }
      
      if (newStatus === TaskStatus.DONE) {
        updates.realEndDate = now;
      }
      
      // If moving back from Done to Doing/Todo, clear end date? 
      // Prompt doesn't specify, but let's keep it simple. 
      if (task.status === TaskStatus.DONE && newStatus !== TaskStatus.DONE) {
         updates.realEndDate = undefined;
      }

      const updatedTask = { ...task, ...updates };
      tasks[index] = updatedTask;
      db.saveTasks(tasks);
      return updatedTask;
    },

    delete: async (id: string): Promise<void> => {
      await delay(DELAY_MS);
      db.deleteTask(id);
    }
  }
};