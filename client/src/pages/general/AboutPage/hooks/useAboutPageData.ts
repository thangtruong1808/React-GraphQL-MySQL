import { useQuery } from '@apollo/client';
import { GET_PUBLIC_STATS } from '../../../../services/graphql/queries';

/**
 * Custom hook for fetching about page data
 * Handles GraphQL query for public statistics
 */
export const useAboutPageData = () => {
  const { data, loading, error } = useQuery(GET_PUBLIC_STATS);

  return {
    stats: data?.publicStats,
    loading,
    error,
  };
};

