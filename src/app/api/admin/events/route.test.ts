import { NextRequest } from 'next/server';
import { GET, POST } from './route';
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
  createEvent: jest.fn(),
}));

describe('GET /api/admin/events', () => {
  beforeEach(() => {
    (EventService.listEvents as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should return a list of events for an admin user', async () => {
    const mockEvents = [{ id: '1', title: 'Test Event' }];
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.listEvents as jest.Mock).mockResolvedValue(mockEvents);

    const req = new NextRequest('http://localhost/api/admin/events');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.events).toEqual(mockEvents);
    expect(EventService.listEvents).toHaveBeenCalledWith('CONFIRMED');
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events');
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.listEvents as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/admin/events', () => {
  beforeEach(() => {
    (EventService.createEvent as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should create a new event for an admin user', async () => {
    const newEventData = { title: 'New Event', date: '2025-10-27', duration: '60', type: 'meeting' };
    const createdEvent = { id: '2', ...newEventData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.createEvent as jest.Mock).mockResolvedValue(createdEvent);

    const req = new NextRequest('http://localhost/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(newEventData),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(createdEvent);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'test' , date: '2025-10-27', duration: '60', type: 'meeting'}),
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.createEvent as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({ title: 't' }), // Invalid title
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.createEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Event', date: '2025-10-27', duration: '60', type: 'meeting' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});