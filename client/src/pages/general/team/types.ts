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

// Role filter type
export type FilterType = 'ALL' | 'ADMIN' | 'PROJECT_MANAGER_PM' | 'SOFTWARE_ARCHITECT' | 'FRONTEND_DEVELOPER' | 'BACKEND_DEVELOPER' | 'FULL_STACK_DEVELOPER' | 'DEVOPS_ENGINEER' | 'QA_ENGINEER' | 'QC_ENGINEER' | 'UX_UI_DESIGNER' | 'BUSINESS_ANALYST' | 'DATABASE_ADMINISTRATOR' | 'TECHNICAL_WRITER' | 'SUPPORT_ENGINEER';

// Loaded role counts interface for currently loaded data
export interface LoadedRoleCounts {
  totalMembers: number;
  administrators: number;
  projectManagers: number;
  softwareArchitects: number;
  frontendDevelopers: number;
  backendDevelopers: number;
  fullStackDevelopers: number;
  devopsEngineers: number;
  qaEngineers: number;
  qcEngineers: number;
  uxUiDesigners: number;
  businessAnalysts: number;
  databaseAdministrators: number;
  technicalWriters: number;
  supportEngineers: number;
}
