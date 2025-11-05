/**
 * Project Detail Page Types
 * Defines interfaces for project detail data structures
 */

export interface ProjectDetails {
  id: string;
  uuid: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt: string;
    assignedUser?: {
      firstName: string;
      lastName: string;
    };
    tags: Array<{
      id: string;
      name: string;
      description: string;
      title?: string;
      type?: string;
      category?: string;
    }>;
  }>;
  members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    memberRole: string;
  }>;
  comments: Array<{
    id: string;
    uuid: string;
    content: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    isLikedByUser: boolean;
    likers?: Array<{
      id: string;
      uuid: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      isDeleted: boolean;
      version: number;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
}

