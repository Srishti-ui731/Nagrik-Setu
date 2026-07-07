import { describe, it, expect } from 'vitest';
import { formatDate, formatLocalTime } from '../src/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format a valid ISO date string correctly', () => {
      const formatted = formatDate('2026-07-02T10:15:00Z');
      expect(formatted).toBe('July 2, 2026');
    });

    it('should format a valid Date object correctly', () => {
      const date = new Date(2026, 6, 2); // Month is 0-indexed (July is 6)
      const formatted = formatDate(date);
      expect(formatted).toBe('July 2, 2026');
    });

    it('should format a timestamp correctly', () => {
      const timestamp = new Date('2026-07-02T10:15:00Z').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toBe('July 2, 2026');
    });

    it('should return empty string for empty inputs', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
    });

    it('should return empty string for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('formatLocalTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2026-07-02T10:15:00Z');
      const timeStr = formatLocalTime(date);
      expect(timeStr).toMatch(/^\d{2}:\d{2}:\d{2}/);
    });
  });
});
