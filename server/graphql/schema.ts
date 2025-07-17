import { gql } from 'graphql-tag';

/**
 * GraphQL Schema with Basic Authorization
 * Includes @auth directive for schema-level authorization
 */

export const typeDefs = gql`
  # Authorization directive definition
  directive @auth(
    role: String
  ) on FIELD_DEFINITION

  # User Role Enum
  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
  }

  # Project Role Enum
  enum ProjectRole {
    VIEWER
    EDITOR
    OWNER
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

  # Authentication Response Type
  type AuthResponse {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  # Logout Response Type
  type LogoutResponse {
    success: Boolean!
    message: String!
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

  # Update User Role Input Type
  input UpdateUserRoleInput {
    userId: ID!
    role: UserRole!
  }

  # User Session Info Type
  type UserSessionInfo {
    userId: ID!
    userEmail: String!
    activeTokens: Int!
    maxAllowed: Int!
    isAtLimit: Boolean!
  }

  # User Update Input Type
  input UpdateUserInput {
    email: String
    firstName: String
    lastName: String
    role: UserRole
  }

  # Query Type
  type Query {
    # Authentication queries
    currentUser: User @auth
    
    # User queries (require authentication)
    user(id: ID!): User @auth(role: "ADMIN")
    users(limit: Int, offset: Int): [User!]! @auth(role: "ADMIN")
    usersWithSessions: [UserSessionInfo!]! @auth(role: "ADMIN")
  }

  # Mutation Type
  type Mutation {
    # Authentication mutations
    login(input: LoginInput!): AuthResponse!
    register(input: RegisterInput!): AuthResponse!
    logout: LogoutResponse!
    refreshToken: AuthResponse!
    
    # User mutations (require authentication)
    updateUser(id: ID!, input: UpdateUserInput!): User! @auth
    deleteUser(id: ID!): Boolean! @auth(role: "ADMIN")
    forceLogoutUser(userId: ID!): Boolean! @auth(role: "ADMIN")
    
    # Admin mutations (require admin role)
    updateUserRole(input: UpdateUserRoleInput!): User! @auth(role: "ADMIN")
  }
`;
