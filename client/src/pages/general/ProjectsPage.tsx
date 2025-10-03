import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_STATUS_DISTRIBUTION } from '../../services/graphql/queries';
import { InlineError, ProjectsPageSkeleton } from '../../components/ui';
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

  // All users see traditional layout with top navbar (NavBar handled by App.tsx)
  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 pt-24">
        <PublicProjectsContent />
      </div>
    </div>
  );
};

export default ProjectsPage;
