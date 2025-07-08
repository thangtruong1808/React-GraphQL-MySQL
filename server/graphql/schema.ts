import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema
 * Defines types, queries, and mutations for the application with JWT refresh token support
 */
export const typeDefs = gql`
  # User Role Enum
  enum UserRole {
    USER
    ADMIN
    MODERATOR
  }

  # User Type
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    role: UserRole!
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
    username: String!
    password: String!
    firstName: String
    lastName: String
  }

  # Refresh Token Input Type
  input RefreshTokenInput {
    refreshToken: String!
  }

  # Update User Input Type
  input UpdateUserInput {
    email: String
    username: String
    firstName: String
    lastName: String
    role: UserRole
  }

  # Query Type
  type Query {
    # Get current authenticated user
    currentUser: User
    
    # Get user by ID (admin only)
    user(id: ID!): User
    
    # Get all users with pagination (admin only)
    users(limit: Int, offset: Int): [User!]!
  }

  # Mutation Type
  type Mutation {
    # User registration with refresh token
    register(input: RegisterInput!): AuthResponse!
    
    # User login with refresh token
    login(input: LoginInput!): AuthResponse!
    
    # Refresh access token using refresh token
    refreshToken(input: RefreshTokenInput!): RefreshTokenResponse!
    
    # User logout (blacklists tokens)
    logout: Boolean!
    
    # Update user (admin or self)
    updateUser(id: ID!, input: UpdateUserInput!): User!
    
    # Delete user (admin only)
    deleteUser(id: ID!): Boolean!
  }
`;
