import { GraphQLContext } from '../context';
import { User, RefreshToken } from '../../db/index';
import { Op } from 'sequelize';
import { JWT_CONFIG, ERROR_MESSAGES } from '../../constants';
import { withAdmin, withAuth, authGuard } from '../../auth/guard';
import { GraphQLError } from 'graphql';

/**
 * User Resolvers
 * Handles user-related GraphQL operations with JWT refresh token authentication
 */

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const validateName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 50;
};

/**
 * User Resolvers
 */
export const userResolvers = {
  Query: {

    /**
     * Get user by ID (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID
     * @param context - GraphQL context with user
     * @returns User or null if not found
     */
    user: withAdmin(async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          return null;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new GraphQLError(ERROR_MESSAGES.DATABASE_ERROR, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    }),

    /**
     * Get all users with pagination (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing limit and offset
     * @param context - GraphQL context with user
     * @returns Array of users
     */
    users: withAdmin(async (_: any, { limit = 10, offset = 0 }: { limit?: number; offset?: number }, context: GraphQLContext) => {
      try {
        const users = await User.findAll({
          limit,
          offset,
          attributes: { exclude: ['password'] }, // Exclude password from response
          order: [['createdAt', 'DESC']],
        });

        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new GraphQLError(ERROR_MESSAGES.DATABASE_ERROR, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    }),

    /**
     * Get users with active session info (admin only)
     * @param _ - Parent resolver
     * @param __ - Arguments
     * @param context - GraphQL context with user
     * @returns Array of user session info
     */
    usersWithSessions: withAdmin(async (_: any, __: any, context: GraphQLContext) => {
      try {
        console.log('🔍 USERS WITH SESSIONS RESOLVER - Starting with context:', {
          hasUser: !!context.user,
          userId: context.user?.id,
          userEmail: context.user?.email,
          userRole: context.user?.role
        });
        
        // Get all users with their active token counts
        const users = await User.findAll({
          where: { isDeleted: false },
          attributes: ['id', 'email'],
        });

        const sessionInfo = await Promise.all(
          users.map(async (user) => {
            const activeTokenCount = await RefreshToken.count({
              where: {
                userId: user.id,
                isRevoked: false,
                expiresAt: {
                  [Op.gt]: new Date(),
                },
              },
            });

            return {
              userId: user.id.toString(),
              userEmail: user.email,
              activeTokens: activeTokenCount,
              maxAllowed: JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER,
              isAtLimit: activeTokenCount >= JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER,
            };
          })
        );

        return sessionInfo;
      } catch (error) {
        console.error('Error fetching users with sessions:', error);
        throw new GraphQLError(ERROR_MESSAGES.DATABASE_ERROR, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    }),
  },

  Mutation: {

    /**
     * Update user (admin or self)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID and update input
     * @param context - GraphQL context with user
     * @returns Updated user
     */
    updateUser: withAuth(async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      try {
        // Check permissions (admin or self)
        const isAdmin = context.user!.role === 'ADMIN';
        const isSelf = context.user!.id.toString() === id;

        if (!isAdmin && !isSelf) {
          throw new GraphQLError(ERROR_MESSAGES.ACCESS_DENIED, {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        // Find user to update
        const user = await User.findByPk(id);
        if (!user) {
          throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND, {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Validate email if provided
        if (input.email && !validateEmail(input.email)) {
          throw new GraphQLError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Validate names if provided
        if (input.firstName && !validateName(input.firstName)) {
          throw new GraphQLError(ERROR_MESSAGES.NAME_TOO_SHORT, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        if (input.lastName && !validateName(input.lastName)) {
          throw new GraphQLError(ERROR_MESSAGES.NAME_TOO_SHORT, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Check for email conflicts
        if (input.email) {
          const existingUser = await User.findOne({
            where: {
              [Op.and]: [
                { email: input.email },
                { id: { [Op.ne]: id } },
              ],
            },
          });

          if (existingUser) {
            throw new GraphQLError('Email already registered', {
              extensions: { code: 'BAD_USER_INPUT' },
            });
          }
        }

        // Update user
        await user.update(input);

        // Return updated user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Update user error:', error);
        throw new GraphQLError(ERROR_MESSAGES.DATABASE_ERROR, {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    }),

    /**
     * Delete user (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID
     * @param context - GraphQL context with user
     * @returns Success status
     */
    deleteUser: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        // Prevent admin from deleting themselves
        if (context.user.id.toString() === id) {
          throw new Error('Cannot delete your own account');
        }

        const user = await User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }

        await user.destroy();
        return true;
      } catch (error) {
        console.error('Delete user error:', error);
        throw error;
      }
    },
  },
};
