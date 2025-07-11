import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema with Authorization
 * Includes @auth directive for schema-level authorization
 */

export const typeDefs = gql`
  # Authorization directive definition
  directive @auth(
    role: String
    permission: String
    resourceType: String
    resourceId: String
    projectRole: String
    projectId: String
  ) on FIELD_DEFINITION

  # User Role Enum
  enum UserRole {
    ADMIN
    MANAGER
    DEVELOPER
  }

  # Permission Enum
  enum Permission {
    READ
    WRITE
    DELETE
    ADMIN
  }

  # Permission Input Enum (for input types)
  enum PermissionInput {
    READ
    WRITE
    DELETE
    ADMIN
  }

  # Resource Type Enum
  enum ResourceType {
    PROJECT
    TASK
    COMMENT
  }

  # Resource Type Input Enum (for input types)
  enum ResourceTypeInput {
    PROJECT
    TASK
    COMMENT
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

  # Permission Type
  type Permission {
    id: ID!
    userId: ID!
    resourceType: ResourceType!
    resourceId: ID!
    permission: Permission!
    createdAt: String!
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

  # Permission Response Type
  type PermissionResponse {
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

  # Grant Permission Input Type
  input GrantPermissionInput {
    userId: ID!
    resourceType: ResourceTypeInput!
    resourceId: ID!
    permission: PermissionInput!
  }

  # Revoke Permission Input Type
  input RevokePermissionInput {
    userId: ID!
    resourceType: ResourceTypeInput!
    resourceId: ID!
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
    
    # Admin queries (require admin role)
    userPermissions(userId: ID!): [Permission!]! @auth(role: "ADMIN")
    
    # Example of permission-based queries (these would be implemented in actual resolvers)
    # project(id: ID!): Project @auth(permission: "READ", resourceType: "PROJECT", resourceId: "id")
    # task(id: ID!): Task @auth(permission: "READ", resourceType: "TASK", resourceId: "id")
    # projectMembers(projectId: ID!): [ProjectMember!]! @auth(projectRole: "VIEWER", projectId: "projectId")
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
    grantPermission(input: GrantPermissionInput!): Permission! @auth(role: "ADMIN")
    revokePermission(input: RevokePermissionInput!): PermissionResponse! @auth(role: "ADMIN")
    updateUserRole(input: UpdateUserRoleInput!): User! @auth(role: "ADMIN")
    
    # Example of permission-based mutations (these would be implemented in actual resolvers)
    # createProject(input: CreateProjectInput!): Project! @auth(role: "MANAGER")
    # updateProject(id: ID!, input: UpdateProjectInput!): Project! @auth(permission: "WRITE", resourceType: "PROJECT", resourceId: "id")
    # deleteProject(id: ID!): Boolean! @auth(permission: "DELETE", resourceType: "PROJECT", resourceId: "id")
  }
`;
