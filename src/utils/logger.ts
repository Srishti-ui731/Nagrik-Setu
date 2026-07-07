/**
 * Structured Logging Utility
 * Provides standard formatting and unified logging behavior for both client and server code.
 */
export const Logger = {
  /**
   * Log standard informational messages.
   *
   * @param {string} message - Message to log
   * @param {...any[]} args - Additional arguments to log alongside the message
   */
  info: (message: string, ...args: any[]): void => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...args);
  },

  /**
   * Log warnings that do not halt execution but require attention.
   *
   * @param {string} message - Warning message to log
   * @param {...any[]} args - Additional arguments to log alongside the message
   */
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...args);
  },

  /**
   * Log errors that might affect execution.
   *
   * @param {string} message - Error description
   * @param {any} [error] - Error object or context
   * @param {...any[]} args - Additional arguments to log alongside the error
   */
  error: (message: string, error?: any, ...args: any[]): void => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error, ...args);
  }
};
