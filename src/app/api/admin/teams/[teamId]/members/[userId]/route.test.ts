
import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as TeamService from '@/server/admin/teams';
import { MembershipRole } from '@prisma/client';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/teams', () => ({
  updateTeamMemberRole: jest.fn(),
  removeTeamMember: jest.fn(),
}));

describe('PUT /api/admin/teams/[teamId]/members/[userId]', () => {
  beforeEach(() => {
    (TeamService.updateTeamMemberRole as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should update a member role for an admin user', async () => {
    const updatedMemberData = { role: MembershipRole.MANAGER };
    const updatedMember = { id: '1', teamId: '1', userId: '2', ...updatedMemberData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.updateTeamMemberRole as jest.Mock).mockResolvedValue(updatedMember);

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2', {
      method: 'PUT',
      body: JSON.stringify(updatedMemberData),
    });
    const res = await PUT(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedMember);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2', {
      method: 'PUT',
      body: JSON.stringify({ role: MembershipRole.MANAGER }),
    });
    const res = await PUT(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2', {
        method: 'PUT',
        body: JSON.stringify({ role: 'invalid-role' }), // Invalid role
    });
    const res = await PUT(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(400);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.updateTeamMemberRole as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2', {
      method: 'PUT',
      body: JSON.stringify({ role: MembershipRole.MANAGER }),
    });
    const res = await PUT(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/teams/[teamId]/members/[userId]', () => {
  beforeEach(() => {
    (TeamService.removeTeamMember as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should remove a member from a team for an admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.removeTeamMember as jest.Mock).mockResolvedValue({ success: true });

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2');
    const res = await DELETE(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(204);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2');
    const res = await DELETE(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.removeTeamMember as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams/1/members/2');
    const res = await DELETE(req, { params: { teamId: '1', userId: '2' } });

    expect(res.status).toBe(500);
  });
});
