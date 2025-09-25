import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Props interface for InfiniteScrollTrigger component
 */
interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

/**
 * InfiniteScrollTrigger Component
 * Detects when user scrolls near bottom and triggers load more action
 * Uses Intersection Observer API for efficient scroll detection
 * Provides loading states and error handling for infinite scroll
 */
const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const lastCallTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const DEBOUNCE_DELAY = 500; // 500ms debounce for better responsiveness

  // Update the ref whenever onLoadMore changes
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const triggerElement = triggerRef.current;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!triggerElement || !hasMore || loading) {
      return;
    }

    // Create intersection observer to detect when trigger element is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const now = Date.now();

        // Load more when trigger element becomes visible with strict conditions
        if (
          entry.isIntersecting &&
          hasMore &&
          !loading &&
          !isProcessingRef.current &&
          (now - lastCallTimeRef.current) > DEBOUNCE_DELAY
        ) {
          lastCallTimeRef.current = now;
          isProcessingRef.current = true;

          // Call onLoadMore and reset processing flag after a delay
          onLoadMoreRef.current();
          setTimeout(() => {
            isProcessingRef.current = false;
          }, DEBOUNCE_DELAY);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    // Store observer reference
    observerRef.current = observer;

    // Start observing the trigger element
    observer.observe(triggerElement);

    // Cleanup observer on unmount or dependency change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, loading, threshold, rootMargin]);

  return (
    <div ref={triggerRef} className="w-full">
      {children}

      {/* Loading indicator when loading more projects */}
      {loading && hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-600 text-sm">Loading more projects...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && !loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="text-gray-500 text-sm">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You've reached the end of the projects list
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;
