/**
 * Team Page Types and Interfaces
 * Shared types for team components
 */

// Team member interface based on database schema
export interface TeamMember {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: string;
  projectCount: number;
  taskCount: number;
  joinDate: string;
  createdAt: string;
}

// Team statistics interface for database-wide counts
export interface TeamStats {
  totalMembers: number;
  administrators: number;
  projectManagers: number;
  developers: number;
  architects: number;
  specialists: number;
  frontendDevelopers: number;
  backendDevelopers: number;
  fullStackDevelopers: number;
  softwareArchitects: number;
  devopsEngineers: number;
  databaseAdministrators: number;
  qaEngineers: number;
  qcEngineers: number;
  uxUiDesigners: number;
  businessAnalysts: number;
  technicalWriters: number;
  supportEngineers: number;
}

// Sort option interface for team member sorting
export interface SortOption {
  field: 'name' | 'role' | 'joinDate' | 'projectCount' | 'taskCount';
  direction: 'ASC' | 'DESC';
}

// Role filter type - matches GraphQL UserRole enum values exactly
export type FilterType = 'ALL' | 'ADMIN' | 'Project Manager' | 'Software Architect' | 'Frontend Developer' | 'Backend Developer' | 'Full-Stack Developer' | 'DevOps Engineer' | 'QA Engineer' | 'QC Engineer' | 'UX/UI Designer' | 'Business Analyst' | 'Database Administrator' | 'Technical Writer' | 'Support Engineer';

