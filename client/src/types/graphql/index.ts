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
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  user: User | null;
}

// Logout Response Type
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Refresh Token Renewal Response Type
export interface RefreshTokenRenewalResponse {
  success: boolean;
  message: string;
  user: User | null;
}

// Login Input Type
export interface LoginInput {
  email: string;
  password: string;
}



// User Session Info Type
export interface UserSessionInfo {
  userId: string;
  userEmail: string;
  activeTokens: number;
  maxAllowed: number;
  isAtLimit: boolean;
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

export interface RefreshTokenRenewalMutation {
  refreshTokenRenewal: RefreshTokenRenewalResponse;
}

export interface ForceLogoutUserMutation {
  forceLogoutUser: boolean;
} 