/**
 * Technology Stack Constants
 * Contains technology information with styling
 * Used in AboutPage Technology Stack section
 */

export interface Technology {
  name: string;
  description: string;
  color: string;
}

/**
 * Technology stack data with descriptions and gradient colors
 * Each technology includes appropriate gradient color scheme
 */
export const TECHNOLOGIES: Technology[] = [
  {
    name: 'React',
    description: 'Frontend Framework',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'GraphQL',
    description: 'API Technology',
    color: 'from-pink-500 to-purple-500'
  },
  {
    name: 'MySQL',
    description: 'Database System',
    color: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Node.js',
    description: 'Backend Runtime',
    color: 'from-green-600 to-green-800'
  },
  {
    name: 'TypeScript',
    description: 'Type Safety',
    color: 'from-blue-500 to-blue-700'
  },
  {
    name: 'Tailwind CSS',
    description: 'Styling Framework',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    name: 'Apollo Server',
    description: 'GraphQL Server',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'JWT',
    description: 'Authentication',
    color: 'from-orange-500 to-red-500'
  }
];
