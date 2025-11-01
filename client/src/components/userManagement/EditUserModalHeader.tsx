import React from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { User } from '../../types/userManagement';
import { USER_MODAL_CONFIG } from '../../constants/userManagement';

interface EditUserModalHeaderProps {
  user: User;
  onClose: () => void;
  loading: boolean;
}

/**
 * Edit User Modal Header Component
 * Displays header with icon, title, description, and close button
 */
const EditUserModalHeader: React.FC<EditUserModalHeaderProps> = ({ user, onClose, loading }) => {
  // Handle close click
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="px-6 py-6" style={{ backgroundColor: 'var(--accent-from)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
              <FaUser className="h-5 w-5" style={{ color: 'var(--badge-primary-text)' }} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold leading-6 text-white">
              {USER_MODAL_CONFIG.edit.title}
            </h3>
            <p className="text-white text-sm mt-1">
              Edit information for {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default EditUserModalHeader;

