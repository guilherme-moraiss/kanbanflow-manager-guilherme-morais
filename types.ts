export enum UserRole {
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER'
}

export enum ExperienceLevel {
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR'
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Optional in frontend display, required in DB
  role: UserRole;
  experienceLevel: ExperienceLevel;
  department: string;
  managerId?: string | null;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  // Dates
  plannedStartDate?: string;
  plannedEndDate?: string;
  realStartDate?: string;
  realEndDate?: string;
  
  status: TaskStatus;
  executionOrder: number; // For prioritizing tasks for a dev
  
  // Relations (IDs)
  managerId: string;
  developerId: string | null; // Can be unassigned initially
  taskTypeId: string;
  
  // Expanded objects for UI convenience (simulating JOINs)
  managerName?: string;
  developerName?: string;
  developerAvatar?: string;
  taskTypeName?: string;
  taskTypeColor?: string;
}