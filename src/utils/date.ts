/**
 * Date Formatting Utility
 * Standardizes date formatting across the Nagrik Setu application.
 */

/**
 * Format an ISO date string or Date object into a readable date string.
 * Example: "2026-07-02T10:15:00Z" -> "July 2, 2026"
 *
 * @param dateInput - ISO string, Date object, or timestamp
 * @returns A formatted date string in "Month Day, Year" format (e.g., "July 2, 2026")
 */
export function formatDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Format a Date object into local time string format for display.
 *
 * @param date - Date object
 * @returns A localized time string
 */
export function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
