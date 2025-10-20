import { Op } from 'sequelize';
import { ProjectMember, User, Notification } from '../../db';

/**
 * Send a notification message to all active members of a project.
 * Excludes any userIds provided (e.g., the actor, owner/assignee) to prevent duplicates.
 */
export const sendNotificationsToProjectMembers = async (
  projectId: number,
  message: string,
  excludeUserIds: number[] = []
) => {
  try {
    const projectMembers = await ProjectMember.findAll({
      where: {
        projectId: projectId,
        isDeleted: false
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    const notificationPromises = projectMembers
      .filter(member => !excludeUserIds.includes(member.userId))
      .map(member =>
        Notification.create({
          userId: member.userId,
          message: message
        })
      );

    await Promise.all(notificationPromises);
  } catch (error) {
    // Intentionally swallow errors to avoid failing the main operation
  }
};

/**
 * Send a notification to a single user if they are not excluded and userId is valid.
 */
export const notifyUserIfNeeded = async (
  userId: number | null | undefined,
  message: string,
  excludeUserIds: number[] = []
) => {
  try {
    if (!userId || excludeUserIds.includes(userId)) {
      return;
    }
    await Notification.create({ userId, message });
  } catch (error) {
    // Intentionally swallow errors to avoid failing the main operation
  }
};


