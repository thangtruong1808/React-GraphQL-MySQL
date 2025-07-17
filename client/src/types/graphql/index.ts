/**
 * GraphQL Types for Login Feature
 * Defines TypeScript interfaces for GraphQL operations
 */

// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
}

// User Type
export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Authentication Response Type
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Logout Response Type
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Login Input Type
export interface LoginInput {
  email: string;
  password: string;
}



// GraphQL Query Response Types
export interface CurrentUserQuery {
  currentUser: User | null;
}

// User Session Info Type
export interface UserSessionInfo {
  userId: string;
  userEmail: string;
  activeTokens: number;
  maxAllowed: number;
  isAtLimit: boolean;
}

// GraphQL Query Response Types
export interface CurrentUserQuery {
  currentUser: User | null;
}

export interface UsersWithSessionsQuery {
  usersWithSessions: UserSessionInfo[];
}

// GraphQL Mutation Response Types
export interface LoginMutation {
  login: AuthResponse;
}

export interface LogoutMutation {
  logout: LogoutResponse;
}

export interface ForceLogoutUserMutation {
  forceLogoutUser: boolean;
} 