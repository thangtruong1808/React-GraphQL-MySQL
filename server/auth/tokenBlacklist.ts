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
 * Creates a comprehensive blacklist entry that invalidates all current sessions
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
    
    // Create a comprehensive blacklist entry that will invalidate all current access tokens
    // We'll use a special hash pattern that will match any access token for this user
    const forceLogoutHash = `force_logout_user_${userId}_${Date.now()}`;
    
    // Create multiple blacklist entries to ensure comprehensive coverage
    // 1. User-specific force logout entry (expires in 24 hours)
    await BlacklistedAccessToken.create({
      userId,
      tokenHash: forceLogoutHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      reason: 'FORCE_LOGOUT',
    });
    
    // 2. Create a timestamp-based blacklist entry to catch tokens issued before this moment
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timestampHash = `timestamp_blacklist_${userId}_${currentTimestamp}`;
    
    await BlacklistedAccessToken.create({
      userId,
      tokenHash: timestampHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      reason: 'FORCE_LOGOUT',
    });
    
    console.log(`🔒 Force logout blacklist entries created for user ${userId}`);
    console.log(`🔒 Force logout hash: ${forceLogoutHash}`);
    console.log(`🔒 Timestamp hash: ${timestampHash}`);
    
    return activeTokens.length;
  } catch (error) {
    console.error('❌ Error blacklisting all user tokens:', error);
    throw error;
  }
};

/**
 * Enhanced check for force logout - checks if user has been force logged out
 * This function checks if there are any active force logout entries for the user
 * @param userId - User ID to check
 * @returns Promise<boolean> - True if user has been force logged out
 */
export const isUserForceLoggedOut = async (userId: number): Promise<boolean> => {
  try {
    // Check for active force logout entries (not expired)
    const forceLogoutEntry = await BlacklistedAccessToken.findOne({
      where: {
        userId,
        reason: 'FORCE_LOGOUT',
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
      order: [['blacklistedAt', 'DESC']], // Get the most recent entry
    });
    
    if (forceLogoutEntry) {
      console.log(`🔍 Found force logout entry for user ${userId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking force logout status:', error);
    return false;
  }
};

/**
 * Check if a specific token was issued before force logout
 * @param userId - User ID
 * @param token - JWT token to check
 * @returns Promise<boolean> - True if token was issued before force logout
 */
export const isTokenIssuedBeforeForceLogout = async (userId: number, token: string): Promise<boolean> => {
  try {
    // Decode the token to get its issued time
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.iat) {
      console.log('🔍 Token has no issued time, assuming it was issued before force logout');
      return true;
    }
    
    const tokenIssuedAt = new Date(decoded.iat * 1000);
    
    // Find the most recent force logout entry
    const forceLogoutEntry = await BlacklistedAccessToken.findOne({
      where: {
        userId,
        reason: 'FORCE_LOGOUT',
        expiresAt: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
      order: [['blacklistedAt', 'DESC']],
    });
    
    if (!forceLogoutEntry) {
      console.log('🔍 No force logout entry found for user');
      return false;
    }
    
    const forceLogoutTime = new Date(forceLogoutEntry.getDataValue('blacklistedAt'));
    const wasIssuedBefore = tokenIssuedAt < forceLogoutTime;
    
    console.log(`🔍 Token issued at: ${tokenIssuedAt.toISOString()}`);
    console.log(`🔍 Force logout at: ${forceLogoutTime.toISOString()}`);
    console.log(`🔍 Token issued before force logout: ${wasIssuedBefore}`);
    
    return wasIssuedBefore;
  } catch (error) {
    console.error('❌ Error checking token issue time:', error);
    return true; // Assume token was issued before force logout if we can't determine
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