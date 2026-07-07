import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../src/utils/api';

describe('ApiClient Class', () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getComplaints should fetch and parse complaint list', async () => {
    const mockData = [{ id: 'COMP-1', title: 'Streetlight Repair' }];
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await ApiClient.getComplaints();
    expect(fetchSpy).toHaveBeenCalledWith('/api/complaints');
    expect(result).toEqual(mockData);
  });

  it('submitComplaint should send post payload and return response', async () => {
    const mockComplaint = { id: 'COMP-2', title: 'Water Leakage' };
    const payload = {
      category: 'Water',
      title: 'Water Leakage',
      description: 'Leaking pipe',
      location: 'Ward 5',
      citizenName: 'John'
    };
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockComplaint
    });

    const result = await ApiClient.submitComplaint(payload as any);
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/complaints',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload)
      })
    );
    expect(result).toEqual(mockComplaint);
  });

  it('sendChatMessage should return chat response text', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Namaste! How can I help you today?' })
    });

    const result = await ApiClient.sendChatMessage('Hello', [], 'English');
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'Hello', history: [], language: 'English' })
      })
    );
    expect(result.text).toBe('Namaste! How can I help you today?');
  });

  it('simplifyScheme should return simplified layout text', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Simplified Scheme Details' })
    });

    const result = await ApiClient.simplifyScheme('Complex policy text', 'Hindi');
    expect(result.text).toBe('Simplified Scheme Details');
  });

  it('draftLetter should return drafted legal petition text', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Formal Grievance Petition Letter' })
    });

    const result = await ApiClient.draftLetter(
      'Electricity',
      'Low voltage',
      'Zone 4',
      'Ravi Kumar',
      'English'
    );
    expect(result.text).toBe('Formal Grievance Petition Letter');
  });

  it('generateTts should return base64 audio response', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audio: 'base64audiobytes...' })
    });

    const result = await ApiClient.generateTts('Speak this text', 'Kore');
    expect(result.audio).toBe('base64audiobytes...');
  });

  it('should throw an error when API status is non-ok', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error'
    });

    await expect(ApiClient.getComplaints()).rejects.toThrow();
  });
});
