import React, { useState, useEffect, useCallback } from 'react';
import { NOTIFICATION_LIMITS, NOTIFICATION_SEARCH_DEBOUNCE_DELAY } from '../../constants/notificationManagement';

/**
 * Notification Search Input Component
 * Provides debounced search functionality for notification management
 * Features clear button and loading state indicators
 */
interface NotificationSearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const NotificationSearchInput: React.FC<NotificationSearchInputProps> = ({
  onSearch,
  placeholder = 'Search notifications...',
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Debounce search input to avoid excessive API calls
   * Updates parent component after 1 second of no typing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, NOTIFICATION_SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Handle clear search
  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5"
          style={{ color: 'var(--text-muted)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        maxLength={NOTIFICATION_LIMITS.MAX_MESSAGE_LENGTH}
        className="block w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-from)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
        disabled={loading}
      />
      {searchTerm && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {loading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--accent-from)' }}></div>
        </div>
      )}
    </div>
  );
};

export default NotificationSearchInput;
