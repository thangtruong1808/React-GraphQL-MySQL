/**
 * Debug Logger Utility
 * Stores debug information in memory instead of using console.log
 * Can be accessed by debug components to display information
 */

interface DebugLogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  context?: string;
}

interface DebugState {
  logs: DebugLogEntry[];
  sessionModalTriggered: boolean;
  lastActivityUpdate: number | null;
  lastTokenCheck: number | null;
  modalShowAttempts: number;
}

// In-memory debug state
let debugState: DebugState = {
  logs: [],
  sessionModalTriggered: false,
  lastActivityUpdate: null,
  lastTokenCheck: null,
  modalShowAttempts: 0,
};

/**
 * Debug Logger Class
 * Manages debug logging without console output
 */
export class DebugLogger {
  /**
   * Add a debug log entry
   */
  static log(level: DebugLogEntry['level'], message: string, data?: any, context?: string): void {
    const entry: DebugLogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
      context,
    };

    // Keep only last 100 logs to prevent memory issues
    if (debugState.logs.length >= 100) {
      debugState.logs = debugState.logs.slice(-50);
    }

    debugState.logs.push(entry);
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any, context?: string): void {
    this.log('info', message, data, context);
  }

  /**
   * Log warning message
   */
  static warn(message: string, data?: any, context?: string): void {
    this.log('warn', message, data, context);
  }

  /**
   * Log error message
   */
  static error(message: string, data?: any, context?: string): void {
    this.log('error', message, data, context);
  }

  /**
   * Log debug message
   */
  static debug(message: string, data?: any, context?: string): void {
    this.log('debug', message, data, context);
  }

  /**
   * Mark session modal as triggered
   */
  static markSessionModalTriggered(): void {
    debugState.sessionModalTriggered = true;
    this.info('Session modal triggered', null, 'SessionManager');
  }

  /**
   * Update last activity timestamp
   */
  static updateLastActivity(): void {
    debugState.lastActivityUpdate = Date.now();
    this.debug('Activity updated', { timestamp: debugState.lastActivityUpdate }, 'ActivityTracker');
  }

  /**
   * Update last token check timestamp
   */
  static updateLastTokenCheck(): void {
    debugState.lastTokenCheck = Date.now();
    this.debug('Token check performed', { timestamp: debugState.lastTokenCheck }, 'SessionManager');
  }

  /**
   * Increment modal show attempts
   */
  static incrementModalShowAttempts(): void {
    debugState.modalShowAttempts++;
    this.info('Modal show attempt', { attempts: debugState.modalShowAttempts }, 'SessionManager');
  }

  /**
   * Get current debug state
   */
  static getDebugState(): DebugState {
    return { ...debugState };
  }

  /**
   * Get recent logs
   */
  static getRecentLogs(count: number = 20): DebugLogEntry[] {
    return debugState.logs.slice(-count);
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: DebugLogEntry['level']): DebugLogEntry[] {
    return debugState.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by context
   */
  static getLogsByContext(context: string): DebugLogEntry[] {
    return debugState.logs.filter(log => log.context === context);
  }

  /**
   * Clear all debug data
   */
  static clear(): void {
    debugState = {
      logs: [],
      sessionModalTriggered: false,
      lastActivityUpdate: null,
      lastTokenCheck: null,
      modalShowAttempts: 0,
    };
  }

  /**
   * Get debug statistics
   */
  static getStats(): {
    totalLogs: number;
    logsByLevel: Record<string, number>;
    sessionModalTriggered: boolean;
    modalShowAttempts: number;
    lastActivityUpdate: number | null;
    lastTokenCheck: number | null;
  } {
    const logsByLevel = debugState.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: debugState.logs.length,
      logsByLevel,
      sessionModalTriggered: debugState.sessionModalTriggered,
      modalShowAttempts: debugState.modalShowAttempts,
      lastActivityUpdate: debugState.lastActivityUpdate,
      lastTokenCheck: debugState.lastTokenCheck,
    };
  }
}
