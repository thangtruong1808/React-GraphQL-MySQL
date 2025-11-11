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
 * Description: Renders the public projects page with statistics, sorting, and project content.
 * Data created: Local sort option state and derived total project count.
 * Author: thangtruong
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


  /**
   * Description: Outputs the composed sections of the public projects experience.
   * Data created: None; consumes props/state from parent scope.
   * Author: thangtruong
   */
  const PublicProjectsContent = () => (
    <>
      {/* Projects Header */}
      <ProjectsHeader totalProjects={totalProjects} />

      {/* Projects Sort Controls - Client-side sorting */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
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
    <div className="w-full public-dashboard">
      <div
        className="min-h-screen pt-24"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <PublicProjectsContent />
      </div>
    </div>
  );
};

export default ProjectsPage;
