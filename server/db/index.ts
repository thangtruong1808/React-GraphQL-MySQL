import sequelize, { testConnection } from './db';

// Import models for login functionality
import User from './models/user';
import RefreshToken from './models/refreshToken';

/**
 * Database Models Index
 * Centralizes model imports for login functionality
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
 * Focused on login functionality
 */
export const setupAssociations = (): void => {
  // User associations
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
  
  // RefreshToken associations
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'refreshTokenUser' });

  console.log('✅ Associations setup completed (login functionality).');
};

// Don't setup associations automatically to avoid conflicts
// setupAssociations();
