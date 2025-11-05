import { Project, ProjectInput, ProjectUpdateInput, ProjectManagementState, ProjectMember, ProjectMemberRole, ProjectDeletionCheck } from '../../../types/projectManagement';

/**
 * Projects Page State
 * Main state for projects tab management
 */
export interface ProjectsPageState {
  projects: Project[];
  paginationInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedProject: Project | null;
  error: string | null;
}

/**
 * Members Page State
 * Main state for members tab management
 */
export interface MembersPageState {
  members: ProjectMember[];
  paginationInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  addModalOpen: boolean;
  removeModalOpen: boolean;
  updateRoleModalOpen: boolean;
  selectedMember: ProjectMember | null;
  error: string | null;
}

/**
 * Use Projects State Dependencies
 * Dependencies for projects state hook
 */
export interface UseProjectsStateDependencies {
  initialPageSize: number;
}

/**
 * Use Members State Dependencies
 * Dependencies for members state hook
 */
export interface UseMembersStateDependencies {
  initialPageSize: number;
}

/**
 * Use Projects Queries Dependencies
 * Dependencies for projects queries hook
 */
export interface UseProjectsQueriesDependencies {
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
  setState: React.Dispatch<React.SetStateAction<ProjectsPageState>>;
}

/**
 * Use Members Queries Dependencies
 * Dependencies for members queries hook
 */
export interface UseMembersQueriesDependencies {
  projectId: string | null;
  pageSize: number;
  currentPage: number;
  searchQuery: string;
  sortBy: string;
  sortOrder: string;
  isInitializing: boolean;
  hasDashboardAccess: boolean;
  isAuthDataReady: boolean;
  setState: React.Dispatch<React.SetStateAction<MembersPageState>>;
}

/**
 * Use Projects Handlers Dependencies
 * Dependencies for projects handlers hook
 */
export interface UseProjectsHandlersDependencies {
  state: ProjectsPageState;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<ProjectsPageState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  refetch: () => Promise<any>;
  createProjectMutation: any;
  updateProjectMutation: any;
  deleteProjectMutation: any;
  checkProjectDeletion: any;
  setDeletionCheck: (check: ProjectDeletionCheck | null) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

/**
 * Use Members Handlers Dependencies
 * Dependencies for members handlers hook
 */
export interface UseMembersHandlersDependencies {
  memberState: MembersPageState;
  selectedProject: Project | null;
  sortBy: string;
  sortOrder: string;
  setState: React.Dispatch<React.SetStateAction<ProjectsPageState>>;
  setMemberState: React.Dispatch<React.SetStateAction<MembersPageState>>;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setMemberSortBy: (sortBy: string) => void;
  setMemberSortOrder: (sortOrder: string) => void;
  fetchProjectMembers: (projectId: string, page: number, pageSize: number, search: string) => Promise<void>;
  fetchProjectMembersWithSort: (projectId: string, page: number, pageSize: number, search: string, sortBy: string, sortOrder: string) => Promise<void>;
  addMemberMutation: any;
  updateMemberRoleMutation: any;
  removeMemberMutation: any;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  setActiveTab: (tab: 'projects' | 'members') => void;
}

