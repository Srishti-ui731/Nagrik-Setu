// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { getComplaints, submitComplaint, addComplaintUpdate } from '../server';

// Helper to create mocked response object
const createMockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Express Server Route Handlers', () => {
  describe('getComplaints', () => {
    it('returns a list of complaints in json format', () => {
      const req: any = {};
      const res = createMockResponse();

      getComplaints(req, res);

      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(Array.isArray(responseData)).toBe(true);
    });
  });

  describe('submitComplaint', () => {
    it('successfully registers a valid complaint', () => {
      const req: any = {
        body: {
          category: 'Water',
          title: 'Main pipeline leak',
          description: 'Water has been leaking for 3 days',
          location: 'Ward 24',
          citizenName: 'Amit',
          citizenEmail: 'amit@bharat.in',
          citizenPhone: '9876543210',
          pincode: '560001'
        }
      };
      const res = createMockResponse();

      submitComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const complaint = res.json.mock.calls[0][0];
      expect(complaint.id).toBeDefined();
      expect(complaint.title).toBe('Main pipeline leak');
    });

    it('rejects complaint if required fields are missing', () => {
      const req: any = {
        body: {
          category: 'Water'
          // Missing title, description, location, citizenName
        }
      };
      const res = createMockResponse();

      submitComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Missing required fields for registering complaint'
        })
      );
    });

    it('rejects complaint if title is too short', () => {
      const req: any = {
        body: {
          category: 'Water',
          title: 'Pipe', // Under 5 characters
          description: 'Water has been leaking for 3 days',
          location: 'Ward 24',
          citizenName: 'Amit'
        }
      };
      const res = createMockResponse();

      submitComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Title must be between 5 and 100 characters long.'
        })
      );
    });

    it('rejects complaint if pincode is invalid', () => {
      const req: any = {
        body: {
          category: 'Water',
          title: 'Pipeline Leakage',
          description: 'Water has been leaking for 3 days',
          location: 'Ward 24',
          citizenName: 'Amit',
          pincode: 'abc1234' // Invalid
        }
      };
      const res = createMockResponse();

      submitComplaint(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Pincode must be exactly 6 numeric digits.'
        })
      );
    });
  });

  describe('addComplaintUpdate', () => {
    it('adds an update status log note to an existing complaint', () => {
      const req: any = {
        params: { id: 'COMP-2026-001' },
        body: { text: 'Officer visiting the site tomorrow.', author: 'Supervisor' }
      };
      const res = createMockResponse();

      addComplaintUpdate(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('returns 404 if the complaint ID is not found', () => {
      const req: any = {
        params: { id: 'NON-EXISTENT-ID' },
        body: { text: 'Some status update.', author: 'Supervisor' }
      };
      const res = createMockResponse();

      addComplaintUpdate(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Complaint not found'
        })
      );
    });
  });
});
