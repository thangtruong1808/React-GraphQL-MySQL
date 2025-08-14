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

            await storedToken.destroy();
            break;
          }
        } catch (hashError) {
          console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Hash verification error during logout:`, hashError);
          continue;
        }
      }
    }

    // Note: Access tokens are short-lived and will expire automatically
    // No need to blacklist them in this simplified approach

    // Clear the refresh token cookie
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: false, // Must be false for localhost development
      sameSite: 'lax', // Use 'lax' for cross-port development
      path: '/', // Use root path to match the cookie setting
    });

    // Clear CSRF token
    clearCSRFToken(res);



    return {
      success: true,
      message: AUTH_OPERATIONS_CONFIG.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  } catch (error) {
    console.error(`${AUTH_OPERATIONS_CONFIG.DEBUG.LOG_PREFIXES.ERROR} Logout error:`, error);
    
    // Even if there's an error, try to clear the cookie
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: false, // Must be false for localhost development
      sameSite: 'lax', // Use 'lax' for cross-port development
      path: '/',
    });

    return {
      success: false,
      message: AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.LOGOUT_FAILED,
    };
  }
};
