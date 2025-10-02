/**
 * Types for Projects Page Components
 */

// Project interface based on database schema
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  taskCount: number;
  memberCount: number;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
  };
}

// Sort options interface
export interface SortOption {
  field: 'name' | 'createdAt' | 'taskCount' | 'memberCount';
  direction: 'ASC' | 'DESC';
}

// Filter type for projects
export type FilterType = 'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';

// Project counts interface
export interface ProjectCounts {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
}
