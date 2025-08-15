import crypto from 'crypto';
import { CSRF_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * CSRF Protection Middleware
 * Implements CSRF token validation for GraphQL mutations
 */

/**
 * Generate a cryptographically secure CSRF token
 * @returns Random hex string token
 */
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(CSRF_CONFIG.CSRF_TOKEN_LENGTH / 2).toString('hex');
};

/**
 * Validate CSRF token from request
 * @param req - Express request object
 * @returns Boolean indicating if CSRF token is valid
 */
export const validateCSRFToken = (req: any): boolean => {
  try {
    // Get CSRF token from header
    const headerToken = req.headers[CSRF_CONFIG.CSRF_HEADER_NAME.toLowerCase()];
    
    // Get CSRF token from cookie
    const cookieToken = req.cookies?.[CSRF_CONFIG.CSRF_COOKIE_NAME];
    

    
    // Check if both tokens exist
    if (!headerToken || !cookieToken) {
      return false;
    }
    
    // Validate token format (should be hex string)
    const isValidHeaderFormat = /^[0-9a-fA-F]+$/.test(headerToken);
    const isValidCookieFormat = /^[0-9a-fA-F]+$/.test(cookieToken);
    
    if (!isValidHeaderFormat || !isValidCookieFormat) {
      return false;
    }
    
    // Compare tokens (timing-safe comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(headerToken, 'hex'),
      Buffer.from(cookieToken, 'hex')
    );
    
    return isValid;
    
  } catch (error) {
    console.error('❌ CSRF VALIDATION - Error validating CSRF token:', error);
    return false;
  }
};

/**
 * CSRF protection middleware for GraphQL mutations
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const csrfProtection = (req: any, res: any, next: any) => {
  try {
    // Only apply CSRF protection to GraphQL mutations
    if (req.body?.query) {
      const query = req.body.query;
      const isMutation = query.trim().toLowerCase().startsWith('mutation');
      
      if (isMutation) {
        // Define mutations that should be excluded from CSRF protection
        const excludedMutations = ['login', 'refreshToken', 'logout'];
        const isExcludedMutation = excludedMutations.some(mutation => 
          query.toLowerCase().includes(mutation.toLowerCase())
        );
        
        if (isExcludedMutation) {
          return next();
        }
        
        const isValidCSRF = validateCSRFToken(req);
        
        if (!isValidCSRF) {
          return res.status(403).json({
            errors: [{
              message: ERROR_MESSAGES.CSRF_TOKEN_INVALID,
              extensions: { code: 'CSRF_TOKEN_INVALID' }
            }]
          });
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ CSRF PROTECTION - Error in CSRF middleware:', error);
    return res.status(500).json({
      errors: [{
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      }]
    });
  }
};

/**
 * CSRF protection for GraphQL context
 * @param context - GraphQL context
 * @returns Boolean indicating if CSRF token is valid
 */
export const validateCSRFInContext = (context: any): boolean => {
  try {
    const { req } = context;
    
    if (!req) {
      return false;
    }
    
    return validateCSRFToken(req);
  } catch (error) {
    console.error('❌ CSRF CONTEXT - Error validating CSRF in context:', error);
    return false;
  }
};

/**
 * Generate and set CSRF token in response
 * @param res - Express response object
 * @returns Generated CSRF token
 */
export const setCSRFToken = (res: any): string => {
  try {
    const csrfToken = generateCSRFToken();
    
    // Set CSRF token as cookie
    res.cookie(CSRF_CONFIG.CSRF_COOKIE_NAME, csrfToken, CSRF_CONFIG.CSRF_COOKIE_OPTIONS);
    

    return csrfToken;
  } catch (error) {
    console.error('❌ CSRF TOKEN - Error setting CSRF token:', error);
    throw error;
  }
};

/**
 * Clear CSRF token from response
 * @param res - Express response object
 */
export const clearCSRFToken = (res: any): void => {
  try {
    res.clearCookie(CSRF_CONFIG.CSRF_COOKIE_NAME, {
      path: CSRF_CONFIG.CSRF_COOKIE_OPTIONS.path,
      secure: CSRF_CONFIG.CSRF_COOKIE_OPTIONS.secure,
      sameSite: CSRF_CONFIG.CSRF_COOKIE_OPTIONS.sameSite,
    });
    

  } catch (error) {
    console.error('❌ CSRF TOKEN - Error clearing CSRF token:', error);
  }
}; 