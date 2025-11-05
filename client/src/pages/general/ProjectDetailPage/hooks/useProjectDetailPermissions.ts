import { ProjectDetails } from '../types';

/**
 * Custom hook for project detail permissions
 * Handles permission checks for comments and likes
 */
export const useProjectDetailPermissions = (
  project: ProjectDetails | undefined,
  user: any,
  isAuthenticated: boolean
) => {
  /**
   * Check if user can post comments (only team members) and project is not completed
   */
  const canPostComments = () => {
    // Don't allow comments on completed projects
    if (project?.status === 'COMPLETED') return false;

    if (!isAuthenticated || !user || !project) return false;

    // Check if user is project owner
    if (project.owner && project.owner.id === user.id) return true;

    // Check if user is a team member
    const isTeamMember = project.members.some((member) => member.id === user.id);

    return isTeamMember;
  };

  /**
   * Check if user can like comments (same as posting comments - only team members)
   */
  const canLikeComments = () => {
    return canPostComments();
  };

  /**
   * Check if user can view comments (only team members)
   */
  const canViewComments = () => {
    if (!isAuthenticated || !user || !project) return false;

    // For non-completed projects, check team membership
    if (project.status !== 'COMPLETED') {
      // Check if user is project owner
      if (project.owner && project.owner.id === user.id) return true;

      // Check if user is a team member
      const isTeamMember = project.members.some((member) => member.id === user.id);
      return isTeamMember;
    }

    // For completed projects, only team members can view comments
    return false;
  };

  return {
    canPostComments,
    canLikeComments,
    canViewComments,
  };
};

