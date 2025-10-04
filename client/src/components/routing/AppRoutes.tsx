import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './index';
import { ROUTE_PATHS } from '../../constants/routingConstants';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('../../pages/home/HomePage'));
const LoginPage = React.lazy(() => import('../../pages/auth/LoginPage'));
const ProjectsPage = React.lazy(() => import('../../pages/general/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('../../pages/general/ProjectDetailPage'));
const TeamPage = React.lazy(() => import('../../pages/general/TeamPage'));
const AboutPage = React.lazy(() => import('../../pages/general/AboutPage'));
const SearchResultsPage = React.lazy(() => import('../../pages/search/SearchResultsPage'));

// Dashboard pages for authenticated users
const TaskFlowOverviewPage = React.lazy(() => import('../../pages/dashboard/TaskFlowOverviewPage'));
const DashboardUsersPage = React.lazy(() => import('../../pages/dashboard/UsersPage'));
const DashboardProjectsPage = React.lazy(() => import('../../pages/dashboard/ProjectsPage'));
const DashboardTasksPage = React.lazy(() => import('../../pages/dashboard/TasksPage'));
const DashboardCommentsPage = React.lazy(() => import('../../pages/dashboard/CommentsPage'));
const DashboardActivityPage = React.lazy(() => import('../../pages/dashboard/ActivityPage'));
const DashboardNotificationsPage = React.lazy(() => import('../../pages/dashboard/NotificationsPage'));
const DashboardTagsPage = React.lazy(() => import('../../pages/dashboard/TagsPage'));

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
        element={<ProjectsPage />}
      />

      <Route
        path={ROUTE_PATHS.PROJECT_DETAIL}
        element={<ProjectDetailPage />}
      />

      <Route
        path={ROUTE_PATHS.TEAM}
        element={<TeamPage />}
      />

      <Route
        path={ROUTE_PATHS.ABOUT}
        element={<AboutPage />}
      />

      <Route
        path={ROUTE_PATHS.SEARCH}
        element={<SearchResultsPage />}
      />

      {/* Home route - accessible to all users */}
      <Route
        path={ROUTE_PATHS.HOME}
        element={<HomePage />}
      />

      {/* Dashboard routes - protected routes for authenticated users */}
      <Route
        path={ROUTE_PATHS.DASHBOARD}
        element={
          <ProtectedRoute>
            <TaskFlowOverviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_USERS}
        element={
          <ProtectedRoute>
            <DashboardUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_PROJECTS}
        element={
          <ProtectedRoute>
            <DashboardProjectsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_TASKS}
        element={
          <ProtectedRoute>
            <DashboardTasksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_COMMENTS}
        element={
          <ProtectedRoute>
            <DashboardCommentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_ACTIVITY}
        element={
          <ProtectedRoute>
            <DashboardActivityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_NOTIFICATIONS}
        element={
          <ProtectedRoute>
            <DashboardNotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.DASHBOARD_TAGS}
        element={
          <ProtectedRoute>
            <DashboardTagsPage />
          </ProtectedRoute>
        }
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
