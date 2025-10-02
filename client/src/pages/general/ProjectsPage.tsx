import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_STATUS_DISTRIBUTION } from '../../services/graphql/queries';
import { InlineError, ProjectsPageSkeleton } from '../../components/ui';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import {
  ProjectsHeader,
  ProjectsSortControls,
  ProjectsSection,
  ProjectsCallToAction,
  SortOption
} from './projects';

/**
 * Projects Page Component
 * Displays all projects for public exploration
 * Allows users to browse projects without authentication
 */


const ProjectsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // State for client-side sorting only
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'createdAt', direction: 'DESC' });

  // Fetch project statistics from entire database for statistics section
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_PROJECT_STATUS_DISTRIBUTION, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });

  // Calculate total projects for header
  const totalProjects = statsData?.projectStatusDistribution ?
    (statsData.projectStatusDistribution.planning + statsData.projectStatusDistribution.inProgress + statsData.projectStatusDistribution.completed) : 0;


  // Handle sort option changes for client-side sorting
  const handleSortChange = useCallback((field: SortOption['field']) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'DESC' ? 'ASC' : 'DESC'
    }));
  }, []);

  // Handle initial loading state - show skeleton immediately on first load
  if (statsLoading) {
    return <ProjectsPageSkeleton />;
  }

  // Handle error state
  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <InlineError message={statsError.message || 'An error occurred'} />
        </div>
      </div>
    );
  }

  // Content components for different layouts
  const AuthenticatedProjectsContent = () => (
    <>
      {/* Projects Header - Edge-to-Edge for Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover {totalProjects} innovative projects managed through TaskFlow. From cutting-edge technology solutions to business-critical applications.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Sort Controls - Edge-to-Edge for Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <ProjectsSortControls
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Projects Section - Handles its own filtering and grid rendering */}
      <ProjectsSection sortOption={sortOption} />

      {/* Projects Call to Action - Edge-to-Edge for Dashboard */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-8 py-8">
          <div className="text-center rounded-2xl p-8 border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of developers and teams who trust TaskFlow to manage their projects efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Start Your Project
              </button>
              <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const PublicProjectsContent = () => (
    <>
      {/* Projects Header */}
      <ProjectsHeader totalProjects={totalProjects} />

      {/* Projects Sort Controls - Client-side sorting */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <ProjectsSortControls
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Projects Section - Handles its own filtering and grid rendering */}
      <ProjectsSection sortOption={sortOption} />

      {/* Projects Call to Action */}
      <ProjectsCallToAction />
    </>
  );

  // Conditional layout based on authentication status
  if (isAuthenticated) {
    // Authenticated users see sidebar layout with edge-to-edge content
    return (
      <DashboardLayout>
        <AuthenticatedProjectsContent />
      </DashboardLayout>
    );
  }

  // Non-authenticated users see traditional layout with top navbar
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-16">
        <PublicProjectsContent />
      </div>
    </div>
  );
};

export default ProjectsPage;
