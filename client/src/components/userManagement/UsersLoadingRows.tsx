import React from 'react';

interface UsersLoadingRowsProps {
  pageSize: number;
}

/**
 * Users Loading Rows Component
 * Displays skeleton loading rows while data is being fetched
 */
const UsersLoadingRows: React.FC<UsersLoadingRowsProps> = ({ pageSize }) => {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-8" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-24" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-28" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-40" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-left">
            <div className="h-6 bg-gray-200 rounded-full w-24" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-20" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left">
            <div className="h-4 bg-gray-200 rounded w-20" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-left">
            <div className="flex justify-start space-x-2">
              <div className="h-6 bg-gray-200 rounded w-12" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
              <div className="h-6 bg-gray-200 rounded w-16" style={{ backgroundColor: 'var(--table-row-bg)' }}></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default UsersLoadingRows;

