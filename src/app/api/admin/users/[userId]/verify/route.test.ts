
import { NextRequest } from 'next/server';
import { POST } from './route';
// import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as UserService from '@/server/admin/users';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
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
  verifyUser: jest.fn(),
}));

describe('POST /api/admin/users/[userId]/verify', () => {
  beforeEach(() => {
    (UserService.verifyUser as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should verify a user for an admin user', async () => {
    const updatedUser = { id: '1', name: 'Verified User', email: 'verified@user.com', emailVerified: new Date(), status: 'verified' };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.verifyUser as jest.Mock).mockResolvedValue(updatedUser);

    const req = new NextRequest('http://localhost/api/admin/users/1/verify', {
      method: 'POST',
    });
    const res = await POST(req, { params: { userId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedUser);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/users/1/verify', {
      method: 'POST',
    });
    const res = await POST(req, { params: { userId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.verifyUser as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/users/1/verify', {
      method: 'POST',
    });
    const res = await POST(req, { params: { userId: '1' } });

    expect(res.status).toBe(500);
  });
});
