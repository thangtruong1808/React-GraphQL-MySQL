/**
 * Type definitions for Detail Modal
 * Defines interfaces for member, project, and task data structures
 */

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  ownedProjects?: Project[];
  assignedTasks?: Task[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project?: Project;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
  }>;
}

export interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Member | Project | Task | null;
  type: 'member' | 'project' | 'task';
}

