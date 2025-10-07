import React from 'react';

/**
 * Generic Skeleton Component with Enhanced Animations
 * Provides reusable skeleton loading elements with smooth transitions and shimmer effects
 */
export const SkeletonBox: React.FC<{
  className?: string;
  delay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ className = '', delay = 0, variant = 'shimmer' }) => {
  const baseClasses = 'rounded-lg transition-all duration-500 ease-out transform';
  const variantClasses = {
    default: 'bg-gray-200 animate-pulse',
    shimmer: 'skeleton-shimmer',
    pulse: 'bg-gray-200 skeleton-pulse-glow',
    wave: 'skeleton-wave',
    breathe: 'skeleton-breathe',
    slide: 'skeleton-slide'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards'
      }}
    />
  );
};

/**
 * Text Skeleton Component with Staggered Animations
 * Creates skeleton placeholders for text content with smooth loading transitions
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lineHeight?: 'sm' | 'md' | 'lg';
  staggerDelay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ lines = 1, className = '', lineHeight = 'md', staggerDelay = 150, variant = 'wave' }) => {
  const heightClass = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  }[lineHeight];

  return (
    <div className={`${className} space-y-3`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`${heightClass} ${index === lines - 1 ? 'w-3/4' : 'w-full'} transform transition-all duration-700 ease-out hover:scale-105`}
          delay={index * staggerDelay}
          variant={variant}
        />
      ))}
    </div>
  );
};

/**
 * Card Skeleton Component with Smooth Transitions
 * Creates skeleton placeholders for card layouts with enhanced animations
 */
export const SkeletonCard: React.FC<{
  className?: string;
  children?: React.ReactNode;
  delay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ className = '', children, delay = 0, variant = 'wave' }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition-all duration-700 ease-out hover:shadow-lg hover:scale-105 skeleton-fade-in ${className}`}
    style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      animationFillMode: 'forwards'
    }}
  >
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
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ size = 'md', className = '', variant = 'breathe' }) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  }[size];

  return (
    <SkeletonBox
      className={`${sizeClass} rounded-full ${className}`}
      variant={variant}
      delay={200}
    />
  );
};

/**
 * Button Skeleton Component
 * Creates skeleton placeholders for buttons
 */
export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ size = 'md', className = '', variant = 'slide' }) => {
  const sizeClass = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }[size];

  return (
    <SkeletonBox
      className={`${sizeClass} rounded-lg ${className}`}
      variant={variant}
      delay={300}
    />
  );
};

/**
 * Progress Bar Skeleton Component
 * Creates skeleton placeholders for progress bars
 */
export const SkeletonProgressBar: React.FC<{
  className?: string;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ className = '', variant = 'wave' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <SkeletonBox
      className="h-2 rounded-full w-1/3"
      variant={variant}
      delay={400}
    />
  </div>
);

/**
 * Chart Skeleton Component with Staggered Animations
 * Creates skeleton placeholders for charts with smooth loading transitions
 */
export const SkeletonChart: React.FC<{
  type?: 'bar' | 'pie' | 'line';
  className?: string;
  delay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ type = 'bar', className = '', delay = 0, variant = 'wave' }) => (
  <SkeletonCard className={className} delay={delay} variant={variant}>
    <SkeletonText lines={1} className="mb-6" staggerDelay={100} variant={variant} />
    <div className="h-48 flex items-end justify-between space-x-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`w-8 ${type === 'pie' ? 'rounded-full' : 'rounded-t'} ${index % 2 === 0 ? 'h-32' : 'h-24'} transform transition-all duration-700 ease-out hover:scale-110`}
          delay={delay + (index * 150)}
          variant={variant}
        />
      ))}
    </div>
  </SkeletonCard>
);

/**
 * Stats Card Skeleton Component with Enhanced Animations
 * Creates skeleton placeholders for statistics cards with smooth transitions
 */
export const SkeletonStatsCard: React.FC<{
  className?: string;
  delay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ className = '', delay = 0, variant = 'breathe' }) => (
  <div
    className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 skeleton-fade-in hover:shadow-lg hover:scale-105 transition-all duration-500 ${className}`}
    style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      animationFillMode: 'forwards'
    }}
  >
    <div className="flex items-center">
      <SkeletonBox className="w-12 h-12 rounded-lg mr-4" delay={delay} variant={variant} />
      <div className="flex-1">
        <SkeletonBox className="h-4 w-24 mb-2" delay={delay + 150} variant={variant} />
        <SkeletonBox className="h-6 w-16" delay={delay + 300} variant={variant} />
      </div>
    </div>
  </div>
);

/**
 * List Item Skeleton Component with Enhanced Animations
 * Creates skeleton placeholders for list items with smooth transitions
 */
export const SkeletonListItem: React.FC<{
  className?: string;
  showAvatar?: boolean;
  delay?: number;
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave' | 'breathe' | 'slide';
}> = ({ className = '', showAvatar = false, delay = 0, variant = 'slide' }) => (
  <div
    className={`p-4 bg-gray-50 rounded-lg skeleton-fade-in hover:bg-gray-100 hover:scale-102 transition-all duration-500 ${className}`}
    style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      animationFillMode: 'forwards'
    }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        {showAvatar && <SkeletonAvatar size="sm" className="mr-3" variant={variant} />}
        <div className="flex-1">
          <SkeletonBox className="h-4 w-3/4 mb-2" delay={delay + 150} variant={variant} />
          <SkeletonBox className="h-3 w-1/2" delay={delay + 300} variant={variant} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <SkeletonBox className="h-6 w-16 rounded-full" delay={delay + 450} variant={variant} />
        <SkeletonBox className="h-6 w-16 rounded-full" delay={delay + 600} variant={variant} />
      </div>
    </div>
  </div>
);
