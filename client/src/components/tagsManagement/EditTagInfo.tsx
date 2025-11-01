import React from 'react';
import { FaTag, FaCheck } from 'react-icons/fa';
import { Tag } from '../../types/tagsManagement';

interface EditTagInfoProps {
  tag: Tag;
}

/**
 * Edit Tag Info Component
 * Displays tag ID and created date information
 */
const EditTagInfo: React.FC<EditTagInfoProps> = ({ tag }) => {
  return (
    <div className="px-6 py-4" style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tag ID */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-primary-bg)' }}>
            <FaTag className="h-4 w-4" style={{ color: 'var(--badge-primary-text)' }} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Tag ID</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{tag.id}</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
            <FaCheck className="h-4 w-4" style={{ color: 'var(--badge-secondary-text)' }} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Created</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{new Date(tag.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTagInfo;

