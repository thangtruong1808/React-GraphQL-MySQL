import React from 'react';

interface DetailModalHeaderProps {
  type: 'member' | 'project' | 'task';
  onClose: () => void;
}

/**
 * Detail Modal Header Component
 * Displays header with title and close button
 */
const DetailModalHeader: React.FC<DetailModalHeaderProps> = ({ type, onClose }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-900 capitalize">
        {type} Details
      </h1>
      <button
        onClick={handleClose}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default DetailModalHeader;

