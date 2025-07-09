// Date formatting utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format member since date in English
 * Displays date in a user-friendly format like "January 15, 2024"
 * @param date - Date string, Date object, or timestamp number
 * @returns Formatted date string in English
 */
export const formatMemberSince = (date: string | Date | number): string => {
  if (!date) {
    return 'Invalid Date';
  }
  
  let d: Date;
  
  // Handle different date formats
  if (typeof date === 'number') {
    // Handle timestamp numbers - check if it's milliseconds or seconds
    const timestamp = date.toString();
    if (timestamp.length === 13) {
      // 13 digits = milliseconds timestamp
      d = new Date(date);
    } else if (timestamp.length === 10) {
      // 10 digits = seconds timestamp, convert to milliseconds
      d = new Date(date * 1000);
    } else {
      // Try as milliseconds first, then as seconds
      d = new Date(date);
      if (isNaN(d.getTime())) {
        d = new Date(date * 1000);
      }
    }
  } else if (typeof date === 'string') {
    // Handle string that might be a timestamp number
    if (/^\d+$/.test(date)) {
      // String contains only digits - treat as timestamp
      const numDate = parseInt(date, 10);
      const timestamp = date;
      if (timestamp.length === 13) {
        // 13 digits = milliseconds timestamp
        d = new Date(numDate);
      } else if (timestamp.length === 10) {
        // 10 digits = seconds timestamp, convert to milliseconds
        d = new Date(numDate * 1000);
      } else {
        // Try as milliseconds first, then as seconds
        d = new Date(numDate);
        if (isNaN(d.getTime())) {
          d = new Date(numDate * 1000);
        }
      }
    } else {
      // Handle ISO strings or other date strings
      d = new Date(date);
    }
  } else if (date instanceof Date) {
    // Handle Date objects
    d = date;
  } else {
    return 'Invalid Date';
  }
  
  // Check if the date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Object utilities
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj } as T;
  keys.forEach(key => {
    delete (result as Record<string, unknown>)[key as string];
  });
  return result;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Storage utilities
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// URL utilities
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

export const setQueryParams = (params: Record<string, string>) => {
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  window.history.replaceState({}, '', url.toString());
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}; 

/**
 * Session Management Utilities
 * Handles session storage, validation, and cleanup operations
 */

// Session storage keys
const SESSION_KEYS = {
  USER: 'user',
  EXPIRY: 'sessionExpiry',
} as const;

// Session duration in milliseconds (1 hour)
const SESSION_DURATION = 60 * 60 * 1000;

/**
 * Creates a new session with user data and expiry time
 * @param user - User data to store in session
 */
export const createSession = (user: Record<string, unknown> | any): void => {
  // Store user data in sessionStorage
  sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
  
  // Set session expiry to 1 hour from now
  const expiryTime = new Date().getTime() + SESSION_DURATION;
  sessionStorage.setItem(SESSION_KEYS.EXPIRY, expiryTime.toString());
};

/**
 * Validates if current session is still active
 * @returns boolean indicating if session is valid
 */
export const isSessionValid = (): boolean => {
  const expiryTime = sessionStorage.getItem(SESSION_KEYS.EXPIRY);
  if (!expiryTime) return false;
  
  const currentTime = new Date().getTime();
  const isExpired = currentTime > parseInt(expiryTime);
  
  // Clear expired session automatically
  if (isExpired) {
    clearSession();
    return false;
  }
  
  return true;
};

/**
 * Retrieves user data from session if valid
 * @returns User data or null if session is invalid
 */
export const getSessionUser = (): Record<string, unknown> | null => {
  if (!isSessionValid()) return null;
  
  const userData = sessionStorage.getItem(SESSION_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clears all session data
 */
export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEYS.USER);
  sessionStorage.removeItem(SESSION_KEYS.EXPIRY);
};

/**
 * Extends current session by resetting expiry time
 * @returns boolean indicating if session was extended
 */
export const extendSession = (): boolean => {
  if (!isSessionValid()) return false;
  
  const user = getSessionUser();
  if (!user) return false;
  
  // Recreate session with new expiry time
  createSession(user);
  return true;
}; 