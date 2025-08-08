/**
 * Logout Operation Module
 * Handles user logout and session cleanup operations
 * Follows GraphQL and Apollo Server best practices
 */

import { RefreshToken } from '../../../../db';
import { clearCSRFToken } from '../../../../auth/csrf';
import { verifyRefreshTokenHash } from '../tokenManager';
import { AUTH_OPERATIONS_CONFIG } from './constants';

/**
 * Enhanced user logout - clears refresh token cookie and deletes from database
 * Performance optimization: efficient token lookup and deletion
 * 
 * CALLED BY: Client logout mutation
 * SCENARIOS:
 * - User logout: Finds and deletes refresh token from DB, clears cookie
 * - No refresh token: Just clears cookie (already logged out)
 * - Invalid refresh token: Just clears cookie (token already invalid)
 * 
 * FLOW: Read cookie → Find token in DB → Delete token → Clear cookie → Response
 */
export const logout = async (req: any, res: any) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies[AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME];
    
    if (refreshToken) {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.INFO} Logout: Found refresh token in cookie, attempting to delete from database`);
      
      // Find and delete the specific refresh token from database
      const storedTokens = await RefreshToken.findAll({
        where: {
          isRevoked: false,
          expiresAt: {
            [require('sequelize').Op.gt]: new Date(),
          },
        },
        include: [{ model: require('../../../../db').User, as: 'refreshTokenUser' }],
      });

      // Find the matching token and delete it
      for (const storedToken of storedTokens) {
        try {
          const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
          if (isValidHash) {
            console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.LOGOUT} Logout: Deleting refresh token ID: ${storedToken.id} for user ID: ${storedToken.userId}`);
            await storedToken.destroy();
            break;
          }
        } catch (hashError) {
          console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Hash verification error during logout:`, hashError);
          continue;
        }
      }
    } else {
      console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.INFO} Logout: No refresh token found in cookie`);
    }

    // Note: Access tokens are short-lived and will expire automatically
    // No need to blacklist them in this simplified approach

    // Clear the refresh token cookie
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
      sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
      path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH, // Use root path to match the cookie setting
    });

    // Clear CSRF token
    clearCSRFToken(res);

    console.log(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.SUCCESS} Logout successful - refresh token deleted and cookies cleared`);

    return {
      success: true,
      message: AUTH_OPERATIONS_CONFIG.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  } catch (error) {
    console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Logout error:`, error);
    
    // Even if there's an error, try to clear the cookie
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
      sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
      path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
    });

    return {
      success: false,
      message: AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.LOGOUT_FAILED,
    };
  }
};
