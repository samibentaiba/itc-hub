import { NextRequest } from 'next/server';
import { GET, POST } from './route';
// import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as UserService from '@/server/admin/users';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/users', () => ({
  listUsers: jest.fn(),
  createUser: jest.fn(),
}));

describe('GET /api/admin/users', () => {
  beforeEach(() => {
    (UserService.listUsers as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should return a list of users with correct status for an admin user', async () => {
    const expectedUsers = [
        { id: '1', name: 'Test User 1', emailVerified: expect.any(Date), status: 'verified' },
        { id: '2', name: 'Test User 2', emailVerified: null, status: 'pending' },
    ];
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.listUsers as jest.Mock).mockResolvedValue(expectedUsers);

    const req = new NextRequest('http://localhost/api/admin/users');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.users).toEqual(expectedUsers);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/users');
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.listUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/users');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/admin/users', () => {
  beforeEach(() => {
    (UserService.createUser as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should create a new user for an admin user', async () => {
    const newUserData = { name: 'New User', email: 'new@user.com' };
    const createdUser = { id: '2', ...newUserData, emailVerified: new Date(), status: 'verified' };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.createUser as jest.Mock).mockResolvedValue(createdUser);

    const req = new NextRequest('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUserData),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(createdUser);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'test', email: 'test@test.com' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.createUser as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await POST(req);

    expect(res.status).toBe(500); //zod will throw an error that will be caught by the catch block and return 500
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.createUser as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'test@user.com' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});