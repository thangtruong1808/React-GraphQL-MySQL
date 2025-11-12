import React, { useEffect } from 'react';
import { AboutPageSkeleton, InlineError } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import {
  AboutHero,
  AboutMission,
  AboutFeatures,
  AboutStatistics,
  AboutTechnologyStack,
  AboutCallToAction,
} from './AboutPage/components';
import { useAboutPageData } from './AboutPage/hooks';

/**
 * Description: Renders the public about page with mission, features, statistics, and themed CTA.
 * Data created: Utilises fetched public statistics and local authentication state only.
 * Author: thangtruong
 */
const AboutPage: React.FC = () => {
  // Get authentication state to conditionally show call-to-action section
  const { isAuthenticated } = useAuth();

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Fetch public statistics from GraphQL API
  const { stats, loading, error } = useAboutPageData();

  // Handle loading state
  if (loading) {
    return <AboutPageSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <div
          className="max-w-md mx-auto rounded-2xl shadow-lg p-8 border theme-border"
          style={{
            backgroundColor: 'var(--card-bg)',
            backgroundImage: 'var(--card-surface-overlay)',
            borderColor: 'var(--border-color)'
          }}
        >
          <InlineError message={error.message} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard">
      <div
        className="min-h-screen pt-24"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Hero Section */}
        <AboutHero />

        {/* Mission Section */}
        <AboutMission />

        {/* Features Section */}
        <AboutFeatures />

        {/* Statistics Section */}
        <AboutStatistics stats={stats} />

        {/* Technology Stack */}
        <AboutTechnologyStack />

        {/* Call to Action - Only show for non-authenticated users */}
        {!isAuthenticated && <AboutCallToAction />}
      </div>
    </div>
  );
};

export default AboutPage;
