import React, { useEffect } from 'react';
import { PublicDashboard } from '../../components/shared';

/**
 * HomePage Component
 * Always shows public dashboard content regardless of authentication state
 * Authenticated users can access dashboard via navbar navigation
 */
const HomePage: React.FC = () => {
  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Always show public dashboard - authenticated users access dashboard via navbar
  return <PublicDashboard />;
};

export default HomePage; 