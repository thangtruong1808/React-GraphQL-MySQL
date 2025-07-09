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

// Token Refresh Response Type
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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

// Register Input Type
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Refresh Token Input Type
export interface RefreshTokenInput {
  refreshToken: string;
}

// GraphQL Query Response Types
export interface CurrentUserQuery {
  currentUser: User | null;
}

// GraphQL Mutation Response Types
export interface LoginMutation {
  login: AuthResponse;
}

export interface RefreshTokenMutation {
  refreshToken: RefreshTokenResponse;
}

export interface LogoutMutation {
  logout: LogoutResponse;
} 