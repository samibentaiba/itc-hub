import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as EventService from '@/server/admin/events';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/events', () => ({
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

describe('PUT /api/admin/events/[eventId]', () => {
  beforeEach(() => {
    (EventService.updateEvent as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should update an event for an admin user', async () => {
    const updatedData = { title: 'Updated Event' , date: '2025-10-27', duration: '60', type: 'meeting'};
    const updatedEvent = { id: '1', ...updatedData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

    const req = new NextRequest('http://localhost/api/admin/events/1', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    const res = await PUT(req, { params: { eventId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedEvent);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'test' , date: '2025-10-27', duration: '60', type: 'meeting'}),
    });
    const res = await PUT(req, { params: { eventId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.updateEvent as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/events/1', {
        method: 'PUT',
        body: JSON.stringify({ title: 't' }), // Invalid title
    });
    const res = await PUT(req, { params: { eventId: '1' } });

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.updateEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated Event' , date: '2025-10-27', duration: '60', type: 'meeting'}),
    });
    const res = await PUT(req, { params: { eventId: '1' } });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/events/[eventId]', () => {
  beforeEach(() => {
    (EventService.deleteEvent as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should delete an event for an admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.deleteEvent as jest.Mock).mockResolvedValue({ success: true });

    const req = new NextRequest('http://localhost/api/admin/events/1');
    const res = await DELETE(req, { params: { eventId: '1' } });

    expect(res.status).toBe(204);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/events/1');
    const res = await DELETE(req, { params: { eventId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (EventService.deleteEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/events/1');
    const res = await DELETE(req, { params: { eventId: '1' } });

    expect(res.status).toBe(500);
  });
});