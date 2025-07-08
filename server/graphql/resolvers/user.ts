import { GraphQLContext } from '../context';
import User from '../../db/models/user';
import { generateTokens, verifyRefreshToken, blacklistToken, extractTokenFromHeader } from '../../auth/jwt';
import { Op } from 'sequelize';

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

const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * User Resolvers
 */
export const userResolvers = {
  Query: {
    /**
     * Get current authenticated user
     * @param _ - Parent resolver
     * @param __ - Arguments
     * @param context - GraphQL context with user
     * @returns Current user or null if not authenticated
     */
    currentUser: async (_: any, __: any, context: GraphQLContext) => {
      try {
        if (!context.isAuthenticated || !context.user) {
          return null;
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = context.user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw new Error('Failed to fetch current user');
      }
    },

    /**
     * Get user by ID (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID
     * @param context - GraphQL context with user
     * @returns User or null if not found
     */
    user: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        const user = await User.findByPk(id);
        if (!user) {
          return null;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    /**
     * Get all users with pagination (admin only)
     * @param _ - Parent resolver
     * @param args - Arguments containing limit and offset
     * @param context - GraphQL context with user
     * @returns Array of users
     */
    users: async (_: any, { limit = 10, offset = 0 }: { limit?: number; offset?: number }, context: GraphQLContext) => {
      try {
        // Check authentication and admin role
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }
        
        if (context.user.role !== 'ADMIN') {
          throw new Error('Admin access required');
        }

        const users = await User.findAll({
          limit,
          offset,
          attributes: { exclude: ['password'] }, // Exclude password from response
          order: [['createdAt', 'DESC']],
        });

        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  },

  Mutation: {
    /**
     * User registration with refresh token
     * @param _ - Parent resolver
     * @param args - Arguments containing registration input
     * @returns Authentication response with access and refresh tokens
     */
    register: async (_: any, { input }: { input: any }) => {
      try {
        const { email, username, password, firstName, lastName } = input;

        // Validate input
        if (!validateEmail(email)) {
          throw new Error('Invalid email format');
        }

        if (!validateUsername(username)) {
          throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        }

        if (!validatePassword(password)) {
          throw new Error('Password must be at least 8 characters long');
        }

        // Check if user already exists
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ email }, { username }],
          },
        });

        if (existingUser) {
          if (existingUser.email === email) {
            throw new Error('Email already registered');
          }
          throw new Error('Username already taken');
        }

        // Create new user
        const user = await User.create({
          email,
          username,
          password, // Will be hashed by model hook
          firstName,
          lastName,
          role: 'USER',
        });

        // Generate both access and refresh tokens
        const tokens = generateTokens(user);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userWithoutPassword,
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },

    /**
     * User login with refresh token
     * @param _ - Parent resolver
     * @param args - Arguments containing login input
     * @returns Authentication response with access and refresh tokens
     */
    login: async (_: any, { input }: { input: any }) => {
      try {
        const { email, password } = input;

        // Validate input
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        // Generate both access and refresh tokens
        const tokens = generateTokens(user);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userWithoutPassword,
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    /**
     * Refresh access token using refresh token
     * @param _ - Parent resolver
     * @param args - Arguments containing refresh token
     * @returns New access and refresh tokens
     */
    refreshToken: async (_: any, { input }: { input: { refreshToken: string } }) => {
      try {
        const { refreshToken } = input;

        if (!refreshToken) {
          throw new Error('Refresh token is required');
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
          throw new Error('Invalid or expired refresh token');
        }

        // Find user
        const user = await User.findByPk(decoded.userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Generate new tokens (token rotation)
        const newTokens = generateTokens(user);

        // Blacklist the old refresh token
        blacklistToken(refreshToken);

        return {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        };
      } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
      }
    },

    /**
     * User logout (blacklists tokens)
     * @param _ - Parent resolver
     * @param __ - Arguments
     * @param context - GraphQL context with user and request
     * @returns Success status
     */
    logout: async (_: any, __: any, context: GraphQLContext) => {
      try {
        // Extract tokens from request headers
        const authHeader = context.req?.headers?.authorization;
        const accessToken = extractTokenFromHeader(authHeader);
        
        // Blacklist the access token if present
        if (accessToken) {
          blacklistToken(accessToken);
        }

        // Note: Refresh token should be blacklisted by the client
        // The client should send the refresh token in the request body for logout
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed');
      }
    },

    /**
     * Update user (admin or self)
     * @param _ - Parent resolver
     * @param args - Arguments containing user ID and update input
     * @param context - GraphQL context with user
     * @returns Updated user
     */
    updateUser: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      try {
        // Check authentication
        if (!context.isAuthenticated || !context.user) {
          throw new Error('Authentication required');
        }

        // Check permissions (admin or self)
        const isAdmin = context.user.role === 'ADMIN';
        const isSelf = context.user.id === id;

        if (!isAdmin && !isSelf) {
          throw new Error('Access denied');
        }

        // Find user to update
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }

        // Validate email if provided
        if (input.email && !validateEmail(input.email)) {
          throw new Error('Invalid email format');
        }

        // Validate username if provided
        if (input.username && !validateUsername(input.username)) {
          throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        }

        // Check for email/username conflicts
        if (input.email || input.username) {
          const whereClause: any = {};
          if (input.email) whereClause.email = input.email;
          if (input.username) whereClause.username = input.username;

          const existingUser = await User.findOne({
            where: {
              [Op.and]: [
                whereClause,
                { id: { [Op.ne]: id } },
              ],
            },
          });

          if (existingUser) {
            if (input.email && existingUser.email === input.email) {
              throw new Error('Email already registered');
            }
            if (input.username && existingUser.username === input.username) {
              throw new Error('Username already taken');
            }
          }
        }

        // Update user
        await user.update(input);

        // Return updated user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      } catch (error) {
        console.error('Update user error:', error);
        throw error;
      }
    },

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
        if (context.user.id === id) {
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
