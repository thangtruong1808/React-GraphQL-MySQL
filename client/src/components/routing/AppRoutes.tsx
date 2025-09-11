import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './index';
import { ROUTE_PATHS } from '../../constants/routingConstants';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('../../pages/home/HomePage'));
const LoginPage = React.lazy(() => import('../../pages/auth/LoginPage'));
const ProjectsPage = React.lazy(() => import('../../pages/general/ProjectsPage'));
const TeamPage = React.lazy(() => import('../../pages/general/TeamPage'));
const AboutPage = React.lazy(() => import('../../pages/general/AboutPage'));
const SearchResultsPage = React.lazy(() => import('../../pages/search/SearchResultsPage'));

/**
 * App Routes Component
 * Defines all application routes and their protection levels
 * Authentication loading is handled at component level to prevent flicker
 * 
 * CALLED BY: App component
 * SCENARIOS: All application routing scenarios
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route
        path={ROUTE_PATHS.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.PROJECTS}
        element={
          <PublicRoute>
            <ProjectsPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.TEAM}
        element={
          <PublicRoute>
            <TeamPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.ABOUT}
        element={
          <PublicRoute>
            <AboutPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.SEARCH}
        element={
          <PublicRoute>
            <SearchResultsPage />
          </PublicRoute>
        }
      />

      {/* Home route - accessible to all users */}
      <Route
        path={ROUTE_PATHS.HOME}
        element={<HomePage />}
      />

      {/* Catch-all route - redirect to HomePage first */}
      <Route
        path="*"
        element={<Navigate to={ROUTE_PATHS.HOME} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
