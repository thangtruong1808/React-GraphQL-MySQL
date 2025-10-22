import { Comment, User, Project, ProjectMember, Task, CommentLike, Notification } from '../../db';
import { AuthenticationError } from 'apollo-server-express';
import { sendNotificationsToProjectMembers } from '../utils/notificationHelpers';

/**
 * Comments Resolver for Project Comments
 * Handles fetching and creating comments for projects using task-based approach
 * Since comments table only has task_id, we use the first task or create a project discussion task
 */

/**
 * Get or create a project discussion task for comments
 * This allows us to use the existing comments table structure
 */
const getProjectDiscussionTask = async (projectId: number): Promise<number | null> => {
  try {
    // First, try to find an existing task in the project
    const existingTask = await Task.findOne({
      where: {
        projectId: projectId,
        isDeleted: false
      },
      order: [['createdAt', 'ASC']] // Get the oldest task
    });

    if (existingTask) {
      return existingTask.id;
    }

    // If no tasks exist, we can't create comments for this project
    // This is a limitation of working with the existing schema
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Fetch comments for a project
 * Returns all non-deleted comments for tasks in the specified project
 */
export const getProjectComments = async (projectId: number, context?: any) => {
  try {
    // Get all tasks for this project
    const projectTasks = await Task.findAll({
      where: {
        projectId: projectId,
        isDeleted: false
      },
      attributes: ['id']
    });

    if (projectTasks.length === 0) {
      return [];
    }

    const taskIds = projectTasks.map(task => task.id);

    // Get all comments for tasks in this project
    const comments = await Comment.findAll({
      where: {
        taskId: taskIds,
        isDeleted: false
      },
      attributes: ['id', 'uuid', 'content', 'userId', 'taskId', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get likes count, user's like status, and likers for each comment
    const commentsWithLikes = await Promise.all(comments.map(async (comment: any) => {
      const likesCount = await CommentLike.count({
        where: { commentId: comment.id }
      });

      // Check if current user has liked this comment
      let isLikedByUser = false;
      if (context?.user?.id) {
        const userLike = await CommentLike.findOne({
          where: {
            userId: context.user.id,
            commentId: comment.id
          }
        });
        isLikedByUser = !!userLike;
      }

      // Get who liked this comment
      const likers = await CommentLike.findAll({
        where: { commentId: comment.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
            required: true
          }
        ],
        order: [['createdAt', 'DESC']] // Most recent likes first
      });






      const likersData = likers ? likers.map((like: any) => ({
        id: like.user.id.toString(),
        uuid: like.user.uuid,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        email: like.user.email,
        role: like.user.role,
        isDeleted: like.user.isDeleted,
        version: like.user.version,
        createdAt: like.user.createdAt,
        updatedAt: like.user.updatedAt
      })) : [];




      return {
        id: comment.id.toString(),
        uuid: comment.uuid,
        content: comment.content,
        userId: comment.userId, // Include userId for author resolver
        author: {
          id: comment.user.id.toString(),
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          email: comment.user.email,
          role: comment.user.role
        },
        projectId: projectId.toString(),
        taskId: comment.taskId?.toString() || null,
        isDeleted: comment.isDeleted,
        version: comment.version,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        likesCount: likesCount,
        isLikedByUser: isLikedByUser,
        likers: likersData
      };
    }));

    return commentsWithLikes;
  } catch (error) {
    return [];
  }
};

/**
 * Create a new comment on a project
 * Requires authentication and validates user permissions
 * Only ADMIN users or project team members can post comments
 * Uses the first task in the project as the target for the comment
 */
export const createProjectComment = async (parent: any, args: any, context: any, info: any) => {
  try {
    // Extract input from args
    const input = args.input;
    

    // Check if user is authenticated
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to create comments');
    }

    // Validate input
    if (!input.content || input.content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    if (!input.projectId) {
      throw new Error('Project ID is required for project comments');
    }

    // Verify project exists
    const project = await Project.findByPk(parseInt(input.projectId), {
      where: { isDeleted: false }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user has permission to create comments
    const userRole = context.user.role?.toLowerCase();
    const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
    
    // If not admin/manager, check if user is a team member of this project
    let isProjectMember = false;
    if (!isAdminOrManager) {
      try {
        const projectMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(input.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });
        isProjectMember = !!projectMember;
      } catch (error) {
        isProjectMember = false;
      }
    }
    
    const canCreateComment = isAdminOrManager || isProjectMember;
    if (!canCreateComment) {
      throw new AuthenticationError('Only administrators, project managers, or project team members can create comments');
    }

    // Get a task from this project to attach the comment to
    const discussionTaskId = await getProjectDiscussionTask(parseInt(input.projectId));
    
    if (!discussionTaskId) {
      throw new Error('Cannot create comments for projects without tasks. Please add a task first.');
    }

    // Create the comment attached to the first task
    const comment = await Comment.create({
      content: input.content.trim(),
      taskId: discussionTaskId,
      userId: context.user.id,
      isDeleted: false,
      version: 1
    });

    // Create notifications for comment creation
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';
      
      // Get project information for notification
      const projectInfo = await Project.findByPk(parseInt(input.projectId), {
        attributes: ['id', 'name', 'ownerId']
      });

      if (projectInfo) {
        // 1. Send notification to project owner if exists and different from commenter
        if (projectInfo.ownerId && projectInfo.ownerId !== context.user.id) {
          await Notification.create({
            userId: projectInfo.ownerId,
            message: `New comment added to project "${projectInfo.name}" by ${actorName} (${actorRole})`,
            isRead: false
          });
        }

        // 2. Send notifications to all project members (excluding commenter and owner)
        await sendNotificationsToProjectMembers(
          projectInfo.id,
          `New comment added to project "${projectInfo.name}" by ${actorName} (${actorRole})`,
          [context.user.id, projectInfo.ownerId].filter(id => id) // Exclude commenter and owner
        );
      }
    } catch (notificationError) {
      // Log notification error but don't fail the comment creation
      // Error handling without console.log for production
    }

    // Fetch the created comment with author and task information
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          required: true,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
              required: true
            }
          ]
        }
      ]
    });

    // Publish real-time subscription event for comment creation
    try {
      if (context.pubsub) {
        // Transform the comment to match GraphQL Comment type structure
        const commentPayload = {
          id: createdComment!.id.toString(),
          uuid: createdComment!.uuid,
          content: createdComment!.content,
          // Include raw database fields for Comment type resolvers
          user_id: createdComment!.userId || createdComment!.user_id,
          task_id: createdComment!.taskId || createdComment!.task_id,
          // Include populated objects for direct access
          author: createdComment!.user,
          task: createdComment!.task,
          isDeleted: createdComment!.isDeleted,
          version: createdComment!.version,
          createdAt: createdComment!.createdAt.toISOString(),
          updatedAt: createdComment!.updatedAt.toISOString(),
          likesCount: 0, // New comments have no likes
          isLikedByUser: false, // New comments are not liked by anyone initially
          likers: [] // New comments have no likers
        };
        
        // Publish real-time comment event
        await context.pubsub.publish(`COMMENT_ADDED_${input.projectId}`, commentPayload);
      }
    } catch (subscriptionError) {
      // Log subscription error but don't fail the comment creation
      // Error handling without console.log for production
    }

    return {
      id: createdComment!.id.toString(),
      uuid: createdComment!.uuid,
      content: createdComment!.content,
      userId: createdComment!.userId, // Include userId for author resolver
      author: {
        id: createdComment!.user.id.toString(),
        firstName: createdComment!.user.firstName,
        lastName: createdComment!.user.lastName,
        email: createdComment!.user.email,
        role: createdComment!.user.role
      },
      projectId: input.projectId,
      taskId: createdComment!.taskId?.toString() || null,
      isDeleted: createdComment!.isDeleted,
      version: createdComment!.version,
      createdAt: createdComment!.createdAt,
      updatedAt: createdComment!.updatedAt,
      likesCount: 0, // New comments start with 0 likes
      isLikedByUser: false // User hasn't liked their own comment yet
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle like/unlike on a comment
 * Requires authentication and validates user permissions
 * Only ADMIN users or project team members can like comments
 */
export const toggleCommentLike = async (parent: any, args: any, context: any, info: any) => {
  try {
    // Check if user is authenticated
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to like comments');
    }

    const { commentId } = args;

    if (!commentId) {
      throw new Error('Comment ID is required');
    }

    // Check if comment exists and get the associated project
    const comment = await Comment.findOne({
      where: { 
        id: parseInt(commentId),
        isDeleted: false 
      },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['projectId'],
          required: true
        }
      ]
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Get the project ID from the comment's task
    const projectId = comment.task.projectId;

    // Check if user has permission to like comments
    const userRole = context.user.role?.toLowerCase();
    const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
    
    // If not admin/manager, check if user is a team member of this project
    let isProjectMember = false;
    if (!isAdminOrManager) {
      const projectMember = await ProjectMember.findOne({
        where: {
          projectId: projectId,
          userId: context.user.id,
          isDeleted: false
        }
      });
      isProjectMember = !!projectMember;
    }
    
    const canLikeComment = isAdminOrManager || isProjectMember;
    if (!canLikeComment) {
      throw new AuthenticationError('Only administrators, project managers, or project team members can like comments');
    }

    // Check if user already liked this comment
    const existingLike = await CommentLike.findOne({
      where: {
        userId: context.user.id,
        commentId: parseInt(commentId)
      }
    });

    if (existingLike) {
      // Unlike - remove the like
      await CommentLike.destroy({
        where: {
          userId: context.user.id,
          commentId: parseInt(commentId)
        }
      });
    } else {
      // Like - create new like
      await CommentLike.create({
        userId: context.user.id,
        commentId: parseInt(commentId)
      });
    }

    // Fetch updated comment with likes count
    const updatedComment = await Comment.findOne({
      where: { id: parseInt(commentId) },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true
        }
      ]
    });

    const likesCount = await CommentLike.count({
      where: { commentId: parseInt(commentId) }
    });

    const isLikedByUser = !existingLike; // If we just liked it, user has liked it

    // Get updated likers for real-time event
    const updatedLikers = await CommentLike.findAll({
      where: { commentId: parseInt(commentId) },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
          required: true
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Publish real-time subscription event for comment like/unlike
    try {
      if (context.pubsub) {
        const likeEvent = {
          commentId: commentId,
          projectId: projectId.toString(),
          userId: context.user.id.toString(),
          action: existingLike ? 'UNLIKED' : 'LIKED',
          likesCount: likesCount,
          likers: updatedLikers ? updatedLikers.map((like: any) => ({
            id: like.user.id.toString(),
            uuid: like.user.uuid,
            firstName: like.user.firstName,
            lastName: like.user.lastName,
            email: like.user.email,
            role: like.user.role,
            isDeleted: like.user.isDeleted,
            version: like.user.version,
            createdAt: like.user.createdAt,
            updatedAt: like.user.updatedAt
          })) : [],
          timestamp: new Date().toISOString()
        };
        
        // Publish the appropriate event based on action
        if (existingLike) {
          await context.pubsub.publish(`COMMENT_UNLIKED_${projectId}`, likeEvent);
        } else {
          await context.pubsub.publish(`COMMENT_LIKED_${projectId}`, likeEvent);
        }
      }
    } catch (subscriptionError) {
      // Error handling without console.log for production
    }

    return {
      id: updatedComment!.id.toString(),
      uuid: updatedComment!.uuid,
      content: updatedComment!.content,
      author: {
        id: updatedComment!.user.id.toString(),
        firstName: updatedComment!.user.firstName,
        lastName: updatedComment!.user.lastName,
        email: updatedComment!.user.email,
        role: updatedComment!.user.role
      },
      projectId: null, // Not needed for like response
      taskId: updatedComment!.taskId?.toString() || null,
      isDeleted: updatedComment!.isDeleted,
      version: updatedComment!.version,
      createdAt: updatedComment!.createdAt,
      updatedAt: updatedComment!.updatedAt,
      likesCount: likesCount,
      isLikedByUser: isLikedByUser,
      likers: updatedLikers ? updatedLikers.map((like: any) => ({
        id: like.user.id.toString(),
        uuid: like.user.uuid,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        email: like.user.email,
        role: like.user.role,
        isDeleted: like.user.isDeleted,
        version: like.user.version,
        createdAt: like.user.createdAt,
        updatedAt: like.user.updatedAt
      })) : []
    };
  } catch (error) {
    throw error;
  }
};

export const commentsResolvers = {
  Query: {
    // Comments will be fetched through Project.comments field
  },
  Mutation: {
    createComment: createProjectComment,
    toggleCommentLike: toggleCommentLike
  }
};
