import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema
 * Defines types, queries, and mutations for login functionality
 */
export const typeDefs = gql`
  # User Role Enum
  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
  }

  # User Type
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

  # Authentication Response Type with refresh token
  type AuthResponse {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  # Token Refresh Response Type
  type RefreshTokenResponse {
    accessToken: String!
    refreshToken: String!
  }

  # Login Input Type
  input LoginInput {
    email: String!
    password: String!
  }

  # Register Input Type
  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  # Refresh Token Input Type
  input RefreshTokenInput {
    refreshToken: String!
  }

  # Logout Response Type
  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  # Query Type
  type Query {
    # Get current authenticated user
    currentUser: User
  }

  # Mutation Type
  type Mutation {
    # User registration with refresh token
    register(input: RegisterInput!): AuthResponse!
    
    # User login with refresh token
    login(input: LoginInput!): AuthResponse!
    
    # Refresh access token using refresh token
    refreshToken(input: RefreshTokenInput!): RefreshTokenResponse!
    
    # User logout (revokes tokens)
    logout: LogoutResponse!
  }
`;
