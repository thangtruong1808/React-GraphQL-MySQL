import sequelize, { testConnection } from './db';

// Import models
import User from './models/user';
import RefreshToken from './models/refreshToken';

/**
 * Database Models Index
 * Centralizes model imports for authentication functionality
 * Associations are handled separately to avoid conflicts
 */

// Export models
export {
  User,
  RefreshToken,
};

// Export sequelize instance and database functions
export { sequelize, testConnection };

/**
 * Setup Model Associations
 * Establishes relationships between models
 * Focused on authentication functionality
 */
export const setupAssociations = (): void => {
  // User associations
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
  // RefreshToken associations are already defined in the model file
  // No need to redefine them here
};

// Don't setup associations automatically to avoid conflicts
// setupAssociations();
