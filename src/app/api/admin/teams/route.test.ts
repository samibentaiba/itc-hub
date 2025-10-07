import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as TeamService from '@/server/admin/teams';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/teams', () => ({
  listTeams: jest.fn(),
  createTeam: jest.fn(),
}));

describe('GET /api/admin/teams', () => {
  beforeEach(() => {
    (TeamService.listTeams as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should return a list of teams for an admin user', async () => {
    const mockTeams = [{ id: '1', name: 'Test Team' }];
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.listTeams as jest.Mock).mockResolvedValue(mockTeams);

    const req = new NextRequest('http://localhost/api/admin/teams');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.teams).toEqual(mockTeams);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams');
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.listTeams as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/admin/teams', () => {
  beforeEach(() => {
    (TeamService.createTeam as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should create a new team for an admin user', async () => {
    const newTeamData = { name: 'New Team', departmentId: '1' };
    const createdTeam = { id: '2', ...newTeamData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.createTeam as jest.Mock).mockResolvedValue(createdTeam);

    const req = new NextRequest('http://localhost/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify(newTeamData),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(createdTeam);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify({ name: 'test', departmentId: '1' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.createTeam as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/teams', {
        method: 'POST',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (TeamService.createTeam as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Team', departmentId: '1' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});