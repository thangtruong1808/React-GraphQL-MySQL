import React from 'react';
import { FaTag } from 'react-icons/fa';

/**
 * Tags Empty State Component
 * Displays message when no tags are found
 */
const TagsEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaTag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
          <p className="text-gray-500 max-w-sm">Try adjusting your search criteria or create a new tag to get started.</p>
        </div>
      </td>
    </tr>
  );
};

export default TagsEmptyState;

