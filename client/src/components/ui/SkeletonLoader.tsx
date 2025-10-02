import React from 'react';

/**
 * Generic Skeleton Component
 * Provides reusable skeleton loading elements with consistent styling
 */
export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);

/**
 * Text Skeleton Component
 * Creates skeleton placeholders for text content
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lineHeight?: 'sm' | 'md' | 'lg';
}> = ({ lines = 1, className = '', lineHeight = 'md' }) => {
  const heightClass = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  }[lineHeight];

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`${heightClass} mb-2 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

/**
 * Card Skeleton Component
 * Creates skeleton placeholders for card layouts
 */
export const SkeletonCard: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

/**
 * Avatar Skeleton Component
 * Creates skeleton placeholders for user avatars
 */
export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }[size];

  return (
    <SkeletonBox className={`${sizeClass} rounded-full ${className}`} />
  );
};

/**
 * Button Skeleton Component
 * Creates skeleton placeholders for buttons
 */
export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }[size];

  return <SkeletonBox className={`${sizeClass} rounded-lg ${className}`} />;
};

/**
 * Progress Bar Skeleton Component
 * Creates skeleton placeholders for progress bars
 */
export const SkeletonProgressBar: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <SkeletonBox className="h-2 rounded-full w-1/3" />
  </div>
);

/**
 * Chart Skeleton Component
 * Creates skeleton placeholders for charts
 */
export const SkeletonChart: React.FC<{
  type?: 'bar' | 'pie' | 'line';
  className?: string;
}> = ({ type = 'bar', className = '' }) => (
  <SkeletonCard className={className}>
    <SkeletonText lines={1} className="mb-6" />
    <div className="h-48 flex items-end justify-between space-x-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`w-8 ${type === 'pie' ? 'rounded-full' : 'rounded-t'} ${index % 2 === 0 ? 'h-32' : 'h-24'
            }`}
        />
      ))}
    </div>
  </SkeletonCard>
);

/**
 * Stats Card Skeleton Component
 * Creates skeleton placeholders for statistics cards
 */
export const SkeletonStatsCard: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${className}`}>
    <div className="flex items-center">
      <SkeletonBox className="w-12 h-12 rounded-lg mr-4" />
      <div className="flex-1">
        <SkeletonBox className="h-4 w-24 mb-2" />
        <SkeletonBox className="h-6 w-16" />
      </div>
    </div>
  </div>
);

/**
 * List Item Skeleton Component
 * Creates skeleton placeholders for list items
 */
export const SkeletonListItem: React.FC<{
  className?: string;
  showAvatar?: boolean;
}> = ({ className = '', showAvatar = false }) => (
  <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        {showAvatar && <SkeletonAvatar size="sm" className="mr-3" />}
        <div className="flex-1">
          <SkeletonBox className="h-4 w-3/4 mb-2" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <SkeletonBox className="h-6 w-16 rounded-full" />
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);
