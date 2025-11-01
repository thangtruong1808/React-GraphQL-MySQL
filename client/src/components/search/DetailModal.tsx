import React from 'react';
import { DetailModalProps, Member, Project, Task } from './detailModalTypes';
import DetailModalHeader from './DetailModalHeader';
import DetailModalFooter from './DetailModalFooter';
import MemberDetails from './MemberDetails';
import ProjectDetails from './ProjectDetails';
import TaskDetails from './TaskDetails';

/**
 * DetailModal Component
 * Renders detailed information in a modal overlay
 * Supports members, projects, and tasks
 */
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type }) => {
  // Don't render if modal is closed or no data
  if (!isOpen || !data) return null;

  // Handle modal close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listener for escape key
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup when unmounting
    return () => {
      // Cleanup event listener
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Determine which content component to render
  const renderContent = () => {
    switch (type) {
      case 'member':
        return <MemberDetails member={data as Member} />;
      case 'project':
        return <ProjectDetails project={data as Project} />;
      case 'task':
        return <TaskDetails task={data as Task} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col">
        <DetailModalHeader type={type} onClose={onClose} />

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </div>

        <DetailModalFooter onClose={onClose} />
      </div>
    </div>
  );
};

export default DetailModal;
