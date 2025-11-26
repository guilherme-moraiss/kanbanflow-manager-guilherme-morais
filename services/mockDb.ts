import { User, UserRole, ExperienceLevel, TaskType, Task, TaskStatus } from '../types';

const USERS_KEY = 'kanban_users';
const TASK_TYPES_KEY = 'kanban_task_types';
const TASKS_KEY = 'kanban_tasks';

// Seed Data
const seedUsers: User[] = [
  {
    id: '1',
    name: 'Alice Manager',
    username: 'admin',
    password: 'password123',
    role: UserRole.MANAGER,
    experienceLevel: ExperienceLevel.SENIOR,
    department: 'Engineering',
    managerId: null
  },
  {
    id: '2',
    name: 'Bob Developer',
    username: 'dev1',
    password: '123',
    role: UserRole.DEVELOPER,
    experienceLevel: ExperienceLevel.MID,
    department: 'Frontend',
    managerId: '1'
  },
  {
    id: '3',
    name: 'Charlie Coder',
    username: 'dev2',
    password: '123',
    role: UserRole.DEVELOPER,
    experienceLevel: ExperienceLevel.JUNIOR,
    department: 'Backend',
    managerId: '1'
  }
];

const seedTaskTypes: TaskType[] = [
  { id: '1', name: 'Feature', color: '#3b82f6' }, // Blue
  { id: '2', name: 'Bug', color: '#ef4444' },     // Red
  { id: '3', name: 'Refactor', color: '#f59e0b' } // Amber
];

const seedTasks: Task[] = [
  {
    id: '101',
    title: 'Setup Project Infrastructure',
    description: 'Initialize Next.js and Express servers.',
    storyPoints: 5,
    status: TaskStatus.DONE,
    executionOrder: 1,
    managerId: '1',
    developerId: '2',
    taskTypeId: '1',
    realStartDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    realEndDate: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '102',
    title: 'Implement Authentication',
    description: 'JWT implementation for login.',
    storyPoints: 8,
    status: TaskStatus.DOING,
    executionOrder: 2,
    managerId: '1',
    developerId: '2',
    taskTypeId: '1',
    realStartDate: new Date().toISOString()
  },
  {
    id: '103',
    title: 'Fix Login CSS Issue',
    description: 'Inputs are invisible on white background.',
    storyPoints: 2,
    status: TaskStatus.TODO,
    executionOrder: 1,
    managerId: '1',
    developerId: '3',
    taskTypeId: '2'
  }
];

// Initialize DB if empty
export const initDb = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    console.log('Database seeded with users.');
  }

  const existingTaskTypes = localStorage.getItem(TASK_TYPES_KEY);
  if (!existingTaskTypes) {
    localStorage.setItem(TASK_TYPES_KEY, JSON.stringify(seedTaskTypes));
    console.log('Database seeded with task types.');
  }

  const existingTasks = localStorage.getItem(TASKS_KEY);
  if (!existingTasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(seedTasks));
    console.log('Database seeded with tasks.');
  }
};

// Database Access Methods (Simulating SQL Queries)
export const db = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByUsername: (username: string): User | undefined => {
    const users = db.getUsers();
    return users.find(u => u.username === username);
  },

  getTaskTypes: (): TaskType[] => {
    const data = localStorage.getItem(TASK_TYPES_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  deleteTask: (id: string) => {
    const data = localStorage.getItem(TASKS_KEY);
    if (data) {
        const tasks = JSON.parse(data) as Task[];
        const filtered = tasks.filter(t => t.id !== id);
        localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
    }
  }
};

// Run initialization
initDb();