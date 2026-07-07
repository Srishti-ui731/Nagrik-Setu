import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../src/utils/logger';

describe('Logger Utility', () => {
  let logSpy: any;
  let warnSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call console.log for info severity', () => {
    Logger.info('Info message');
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toContain('[INFO]');
    expect(logSpy.mock.calls[0][0]).toContain('Info message');
  });

  it('should call console.warn for warn severity', () => {
    Logger.warn('Warning message');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('[WARN]');
    expect(warnSpy.mock.calls[0][0]).toContain('Warning message');
  });

  it('should call console.error for error severity', () => {
    Logger.error('Error message', new Error('Fail'));
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toContain('[ERROR]');
    expect(errorSpy.mock.calls[0][0]).toContain('Error message');
  });
});
