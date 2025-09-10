import { gql } from 'graphql-tag';

/**
 * Cleaned GraphQL Schema for Authentication
 * Contains only the types and operations actually used by the client
 * Follows GraphQL best practices for schema design
 */

export const typeDefs = gql`
  # Custom JSON Scalar Type for flexible data structures
  scalar JSON

  # Authorization directive for schema-level security
  directive @auth(
    role: String
  ) on FIELD_DEFINITION

  # User Role Enum - matches database schema
  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
  }

  # User Type - matches database users table structure
  type User {
    id: ID!
    uuid: String!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    isDeleted: Boolean!
    version: Int!
    createdAt: String!
    updatedAt: String!
  }

  # Authentication Response Type - includes all tokens returned by login/refresh
  type AuthResponse {
    accessToken: String
    refreshToken: String
    csrfToken: String
    user: User
  }

  # Logout Response Type - simple success/error response
  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  # Refresh Token Renewal Response Type - for extending refresh token expiry
  type RefreshTokenRenewalResponse {
    success: Boolean!
    message: String!
    user: User
  }

  # Login Input Type - email and password for authentication
  input LoginInput {
    email: String!
    password: String!
  }

  # Query Type - placeholder for future queries
  type Query {
    _placeholder: String
  }

  # Mutation Type - only includes authentication mutations that are actually used
  type Mutation {
    # User login with email/password - returns tokens and user data
    login(input: LoginInput!): AuthResponse!
    
    # User logout - clears refresh token cookie and database entry
    logout: LogoutResponse!
    
    # Refresh access token using refresh token from httpOnly cookie
    # dynamicBuffer: Optional buffer time in milliseconds for cookie expiry calculation
    refreshToken(dynamicBuffer: Int): AuthResponse!
    
    # Renew refresh token to extend session - for active users
    refreshTokenRenewal: RefreshTokenRenewalResponse!
  }
`;
