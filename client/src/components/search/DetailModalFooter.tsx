import React from 'react';

interface DetailModalFooterProps {
  onClose: () => void;
}

/**
 * Detail Modal Footer Component
 * Displays footer with close button
 */
const DetailModalFooter: React.FC<DetailModalFooterProps> = ({ onClose }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
      <button
        onClick={handleClose}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default DetailModalFooter;

