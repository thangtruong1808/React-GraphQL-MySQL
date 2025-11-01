import React from 'react';

/**
 * Technology Stack Constants
 * Contains technology information with styling
 * Used in AboutPage Technology Stack section
 */

export interface Technology {
  name: string;
  description: string;
  gradientStyle: React.CSSProperties;
}

/**
 * Technology stack data with descriptions and gradient colors using theme variables
 * Each technology includes appropriate gradient color scheme for better readability
 */
export const TECHNOLOGIES: Technology[] = [
  {
    name: 'React',
    description: 'Frontend Framework',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-react-from), var(--tech-react-to))',
    }
  },
  {
    name: 'GraphQL',
    description: 'API Technology',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-graphql-from), var(--tech-graphql-to))',
    }
  },
  {
    name: 'MySQL',
    description: 'Database System',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-mysql-from), var(--tech-mysql-to))',
    }
  },
  {
    name: 'Node.js',
    description: 'Backend Runtime',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-nodejs-from), var(--tech-nodejs-to))',
    }
  },
  {
    name: 'TypeScript',
    description: 'Type Safety',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-typescript-from), var(--tech-typescript-to))',
    }
  },
  {
    name: 'Tailwind CSS',
    description: 'Styling Framework',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-tailwind-from), var(--tech-tailwind-to))',
    }
  },
  {
    name: 'Apollo Server',
    description: 'GraphQL Server',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-apollo-from), var(--tech-apollo-to))',
    }
  },
  {
    name: 'JWT',
    description: 'Authentication',
    gradientStyle: {
      backgroundImage: 'linear-gradient(to bottom right, var(--tech-jwt-from), var(--tech-jwt-to))',
    }
  }
];
