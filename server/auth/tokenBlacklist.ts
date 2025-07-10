import crypto from 'crypto';
import { BlacklistedAccessToken } from '../db/index';

/**
 * Token Blacklist Utilities
 * Handles blacklisting of JWT access tokens for immediate invalidation
 * Used for force logout and security breach scenarios
 */

/**
 * Hash access token for storage
 * @param token - Raw JWT access token
 * @returns Hashed token string
 */
export const hashAccessToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Blacklist an access token
 * @param userId - User ID who owns the token
 * @param token - Raw JWT access token
 * @param expiresAt - Token expiration date
 * @param reason - Reason for blacklisting
 * @returns Promise<void>
 */
export const blacklistAccessToken = async (
  userId: number,
  token: string,
  expiresAt: Date,
  reason: 'FORCE_LOGOUT' | 'MANUAL_LOGOUT' | 'SECURITY_BREACH'
): Promise<void> => {
  try {
    const tokenHash = hashAccessToken(token);
    
    await BlacklistedAccessToken.create({
      userId,
      tokenHash,
      expiresAt,
      reason,
    });
    
    console.log(`🔒 Blacklisted access token for user ${userId} (reason: ${reason})`);
  } catch (error) {
    console.error('❌ Error blacklisting access token:', error);
    throw error;
  }
};

/**
 * Check if an access token is blacklisted
 * @param token - Raw JWT access token
 * @returns Promise<boolean> - True if token is blacklisted
 */
export const isAccessTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const tokenHash = hashAccessToken(token);
    
    const blacklistedToken = await BlacklistedAccessToken.findOne({
      where: {
        tokenHash,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });
    
    return !!blacklistedToken;
  } catch (error) {
    console.error('❌ Error checking token blacklist:', error);
    return false;
  }
};

/**
 * Blacklist all access tokens for a user (force logout)
 * @param userId - User ID to blacklist all tokens for
 * @returns Promise<number> - Number of tokens blacklisted
 */
export const blacklistAllUserTokens = async (userId: number): Promise<number> => {
  try {
    // Get all active refresh tokens for the user
    const { RefreshToken } = require('../db/index');
    
    const activeTokens = await RefreshToken.findAll({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });
    
    console.log(`🔍 Found ${activeTokens.length} active refresh tokens for user ${userId}`);
    
    // For each active refresh token, we need to blacklist the corresponding access token
    // Since we don't store access tokens, we'll use a different approach:
    // We'll blacklist based on user ID and current time to invalidate all current sessions
    
    // Create a blacklist entry that invalidates all current sessions for this user
    await BlacklistedAccessToken.create({
      userId,
      tokenHash: `force_logout_${userId}_${Date.now()}`, // Unique identifier for force logout
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      reason: 'FORCE_LOGOUT',
    });
    
    console.log(`🔒 Force logout blacklist entry created for user ${userId}`);
    
    return activeTokens.length;
  } catch (error) {
    console.error('❌ Error blacklisting all user tokens:', error);
    throw error;
  }
};

/**
 * Clean up expired blacklisted tokens
 * @returns Promise<number> - Number of tokens cleaned up
 */
export const cleanupExpiredBlacklistedTokens = async (): Promise<number> => {
  try {
    const deletedCount = await BlacklistedAccessToken.destroy({
      where: {
        expiresAt: {
          [require('sequelize').Op.lt]: new Date(),
        },
      },
    });
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} expired blacklisted tokens`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error('❌ Error cleaning up expired blacklisted tokens:', error);
    return 0;
  }
}; 