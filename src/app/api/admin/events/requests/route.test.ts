import { NextRequest } from 'next/server';
import { GET } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as EventService from '@/server/admin/events';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/events', () => ({
  listEvents: jest.fn(),
}));

describe('GET /api/admin/events/requests', () => {
  beforeEach(() => {
    (EventService.listEvents as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should return a list of pending events for an admin user', async () => {
    const mockEvents = [{ id: '1', title: 'Pending Event', status: 'PENDING' }];
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.listEvents as jest.Mock).mockResolvedValue(mockEvents);

    const req = new NextRequest('http://localhost/api/admin/events/requests');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.events).toEqual(mockEvents);
    expect(EventService.listEvents).toHaveBeenCalledWith('PENDING');
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events/requests');
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.listEvents as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events/requests');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});