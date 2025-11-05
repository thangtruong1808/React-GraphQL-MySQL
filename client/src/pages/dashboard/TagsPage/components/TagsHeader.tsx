import React from 'react';
import { FaPlus } from 'react-icons/fa';

/**
 * Tags Header Props
 */
export interface TagsHeaderProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

/**
 * Tags Page Header Component
 * Displays page title, description, and create button
 */
export const TagsHeader: React.FC<TagsHeaderProps> = ({ canCreate, onCreateClick }) => {
  return (
    <div className="w-full" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Tags Management
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Organize and manage tags for efficient task categorization
            </p>
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-lg text-sm font-semibold rounded-xl transition-all duration-200 w-full sm:w-auto sm:flex-shrink-0 transform hover:scale-105"
              style={{
                backgroundColor: 'var(--button-primary-bg)',
                color: 'var(--button-primary-text)',
                borderColor: 'var(--button-primary-bg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
              }}
            >
              <FaPlus className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="hidden xs:inline">Create New Tag</span>
              <span className="xs:hidden">Create Tag</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

