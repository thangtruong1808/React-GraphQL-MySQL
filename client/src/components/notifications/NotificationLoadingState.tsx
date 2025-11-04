import React from 'react';

/**
 * Notification Loading State Component
 * Displays skeleton loading state while notifications are being fetched        
 */
const NotificationLoadingState: React.FC = () => {
  return (
    <div className="p-4" style={{ backgroundColor: 'var(--notification-drawer-bg)' }}>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div
                className="w-5 h-5 rounded border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                }}
              ></div>
              <div className="flex-1">
                <div
                  className="h-4 rounded w-3/4 mb-2"
                  style={{ backgroundColor: 'var(--border-light)' }}
                ></div>
                <div
                  className="h-3 rounded w-1/2"
                  style={{ backgroundColor: 'var(--border-light)' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationLoadingState;

