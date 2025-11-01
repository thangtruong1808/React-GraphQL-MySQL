import React from 'react';

interface ProjectsLoadingRowsProps {
  pageSize: number;
}

/**
 * Projects Loading Rows Component
 * Displays skeleton loading rows while data is being fetched
 */
const ProjectsLoadingRows: React.FC<ProjectsLoadingRowsProps> = ({ pageSize }) => {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden lg:table-cell">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden md:table-cell">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-left">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left hidden sm:table-cell">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left hidden xs:table-cell">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left hidden lg:table-cell">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-left">
            <div className="flex justify-start space-x-2">
              <div className="h-6 bg-gray-200 rounded w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default ProjectsLoadingRows;

