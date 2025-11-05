import { useQuery } from '@apollo/client';
import { GET_PROJECT_DETAILS } from '../../../../services/graphql/queries';
import { ProjectDetails } from '../types';
import { Comment } from '../../../../services/graphql/commentQueries';
import { Task } from '../../../../services/graphql/taskSubscriptions';

/**
 * Custom hook for fetching and processing project detail data
 * Handles GraphQL query and data mapping for comments and tasks
 */
export const useProjectDetailData = (projectId: string | undefined) => {
  // Fetch project details
  const { data, loading, error, refetch } = useQuery<{ project: ProjectDetails }>(GET_PROJECT_DETAILS, {
    variables: { projectId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  // Map comments from query to match Comment type structure (add missing task, isDeleted, version fields)
  const mappedComments = (data?.project?.comments || []).map((comment: any) => ({
    ...comment,
    task: comment.task || {
      id: '',
      uuid: '',
      title: '',
      project: {
        id: data?.project?.id || '',
        uuid: data?.project?.uuid || '',
        name: data?.project?.name || '',
      },
    },
    isDeleted: comment.isDeleted ?? false,
    version: comment.version ?? 1,
  })) as Comment[];

  // Map tasks from query to match Task type structure (add missing uuid, projectId, project, isDeleted, version, updatedAt, tags fields)
  const mappedTasks = (data?.project?.tasks || []).map((task: any) => ({
    ...task,
    uuid: task.uuid || '',
    projectId: task.projectId || data?.project?.id || '',
    project: task.project || {
      id: data?.project?.id || '',
      name: data?.project?.name || '',
    },
    isDeleted: task.isDeleted ?? false,
    version: task.version ?? 1,
    updatedAt: task.updatedAt || task.createdAt || new Date().toISOString(),
    assignedTo: task.assignedTo || task.assignedUser?.id || undefined,
    assignedUser: task.assignedUser
      ? {
          id: task.assignedUser.id || '',
          firstName: task.assignedUser.firstName || '',
          lastName: task.assignedUser.lastName || '',
          email: task.assignedUser.email || '',
          role: task.assignedUser.role || '',
        }
      : undefined,
    tags: task.tags || [],
  })) as Task[];

  return {
    data,
    loading,
    error,
    refetch,
    mappedComments,
    mappedTasks,
    project: data?.project,
  };
};

