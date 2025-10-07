import { NextRequest } from 'next/server';
import { POST } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as EventService from '@/server/admin/events';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/events', () => ({
  approveEvent: jest.fn(),
}));

describe('POST /api/admin/events/requests/[eventId]/approve', () => {
  beforeEach(() => {
    (EventService.approveEvent as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should approve an event for an admin user', async () => {
    const approvedEvent = { id: '1', status: 'CONFIRMED' };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.approveEvent as jest.Mock).mockResolvedValue(approvedEvent);

    const req = new NextRequest('http://localhost/api/admin/events/requests/1/approve', {
      method: 'POST',
    });
    const res = await POST(req, { params: { eventId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(approvedEvent);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events/requests/1/approve', {
      method: 'POST',
    });
    const res = await POST(req, { params: { eventId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.approveEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events/requests/1/approve', {
      method: 'POST',
    });
    const res = await POST(req, { params: { eventId: '1' } });

    expect(res.status).toBe(500);
  });
});