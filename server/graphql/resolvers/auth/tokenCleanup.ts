import { RefreshToken } from '../../../db';
import { JWT_CONFIG } from '../../../constants';

/**
 * Token Cleanup Module
 * Handles database cleanup and token limiting operations
 * 
 * SCENARIOS:
 * - Token Cleanup: Removes expired and revoked tokens from database
 * - Token Limiting: Enforces maximum active sessions per user
 * - Performance Optimization: Efficient database operations
 * - Security Maintenance: Prevents token accumulation
 */

/**
 * Clean up expired and revoked refresh tokens
 * Performance optimization: only removes expired/revoked tokens
 * @param userId - User ID to clean tokens for
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - maintains clean token database
 * FEATURES: Removes expired tokens, removes revoked tokens, performance logging
 */
export const cleanupRefreshTokens = async (userId: number): Promise<void> => {
  try {
    // Remove expired tokens
    const expiredDeleted = await RefreshToken.destroy({
      where: {
        userId,
        expiresAt: {
          [require('sequelize').Op.lt]: new Date(),
        },
      },
    });

    // Remove revoked tokens
    const revokedDeleted = await RefreshToken.destroy({
      where: {
        userId,
        isRevoked: true,
      },
    });


  } catch (error) {
    console.error('❌ Error cleaning up refresh tokens:', error);
  }
};

/**
 * Limit refresh tokens per user for security
 * Performance optimization: only limits when necessary
 * @param userId - User ID to check
 * 
 * CALLED BY: refreshToken()
 * SCENARIOS: Token refresh - prevents excessive active sessions
 * FEATURES: Enforces token limits, deletes oldest tokens, security logging
 */
export const limitRefreshTokens = async (userId: number): Promise<void> => {
  try {
    const tokenCount = await RefreshToken.count({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });



    // Only limit if we exceed the maximum
    if (tokenCount > JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER) {
      // Find oldest tokens to delete
      const oldestTokens = await RefreshToken.findAll({
        where: {
          userId,
          isRevoked: false,
          expiresAt: {
            [require('sequelize').Op.gt]: new Date(),
          },
        },
        order: [['createdAt', 'ASC']],
        limit: tokenCount - JWT_CONFIG.MAX_REFRESH_TOKENS_PER_USER + 1,
      });

      // Actually delete the oldest tokens (not just mark as revoked)
      for (const token of oldestTokens) {
        await token.destroy();
      }
    }
  } catch (error) {
    console.error('❌ Error limiting refresh tokens:', error);
  }
}; 