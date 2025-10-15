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
 * - Expired access token: Still deletes refresh token from DB (most important)
 * 
 * FLOW: Read cookie → Find token in DB → Delete token → Clear cookie → Response
 */
export const logout = async (req: any, res: any) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies[AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME];
    
    if (refreshToken) {
      // Find and delete the specific refresh token from database
      // Improved logic: Get all active tokens and find the matching one
      const storedTokens = await RefreshToken.findAll({
        where: {
          isRevoked: false,
          expiresAt: {
            [require('sequelize').Op.gt]: new Date(),
          },
        },
        include: [{ model: require('../../../../db').User, as: 'user' }],
      });

      // Find the matching token and delete it
      let tokenFound = false;
      for (const storedToken of storedTokens) {
        try {
          const isValidHash = await verifyRefreshTokenHash(refreshToken, storedToken.tokenHash);
          if (isValidHash) {
            // Delete the specific token from database
            await storedToken.destroy();
            tokenFound = true;
            break;
          }
        } catch (hashError) {
          // Hash verification error - continue to next token
          continue;
        }
      }
    }

    // Note: Access tokens are short-lived and will expire automatically
    // No need to blacklist them in this simplified approach

    // Clear the refresh token cookie with proper options
    // Use multiple cookie clearing attempts to ensure it's removed
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
      sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
      path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
    });

    // Also try clearing with different options to ensure cookie removal
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: false, // Try without secure for localhost
      sameSite: 'lax',
      path: '/',
    });

    // Clear CSRF token
    clearCSRFToken(res);

    // Logout process completed successfully

    return {
      success: true,
      message: AUTH_OPERATIONS_CONFIG.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  } catch (error) {
    // Error during logout process
    
    // Even if there's an error, try to clear the cookie with multiple attempts
    // This ensures the user is logged out even if database operations fail
    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_OPERATIONS_CONFIG.COOKIE_SECURE,
      sameSite: AUTH_OPERATIONS_CONFIG.COOKIE_SAME_SITE,
      path: AUTH_OPERATIONS_CONFIG.COOKIE_PATH,
    });

    res.clearCookie(AUTH_OPERATIONS_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    // Clear CSRF token even on error
    clearCSRFToken(res);

    // Completed logout with error, but cookies cleared

    return {
      success: false,
      message: AUTH_OPERATIONS_CONFIG.ERROR_MESSAGES.LOGOUT_FAILED,
    };
  }
};
