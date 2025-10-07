import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as TeamService from '@/server/admin/teams';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/teams', () => ({
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
}));

describe('PUT /api/admin/teams/[teamId]', () => {
  beforeEach(() => {
    (TeamService.updateTeam as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should update a team for an admin user', async () => {
    const updatedData = { name: 'Updated Team', departmentId: '1' };
    const updatedTeam = { id: '1', ...updatedData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.updateTeam as jest.Mock).mockResolvedValue(updatedTeam);

    const req = new NextRequest('http://localhost/api/admin/teams/1', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    const res = await PUT(req, { params: { teamId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedTeam);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'test', departmentId: '1' }),
    });
    const res = await PUT(req, { params: { teamId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.updateTeam as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/teams/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await PUT(req, { params: { teamId: '1' } });

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.updateTeam as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test Team', departmentId: '1' }),
    });
    const res = await PUT(req, { params: { teamId: '1' } });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/teams/[teamId]', () => {
  beforeEach(() => {
    (TeamService.deleteTeam as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should delete a team for an admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.deleteTeam as jest.Mock).mockResolvedValue({ success: true });

    const req = new NextRequest('http://localhost/api/admin/teams/1');
    const res = await DELETE(req, { params: { teamId: '1' } });

    expect(res.status).toBe(204);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams/1');
    const res = await DELETE(req, { params: { teamId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.deleteTeam as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams/1');
    const res = await DELETE(req, { params: { teamId: '1' } });

    expect(res.status).toBe(500);
  });
});