import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as UserService from '@/server/admin/users';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
      delete: jest.fn(),
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
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('PUT /api/admin/users/[userId]', () => {
  beforeEach(() => {
    (UserService.updateUser as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should update a user for an admin user', async () => {
    const updatedData = { name: 'Updated User', email: 'updated@user.com' };
    const updatedUser = { id: '1', ...updatedData, emailVerified: new Date(), status: 'verified' };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    const req = new NextRequest('http://localhost/api/admin/users/1', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    const res = await PUT(req, { params: { userId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedUser);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/users/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'test', email: 'test@test.com' }),
    });
    const res = await PUT(req, { params: { userId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.updateUser as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/users/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await PUT(req, { params: { userId: '1' } });

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.updateUser as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/users/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test User', email: 'test@user.com' }),
    });
    const res = await PUT(req, { params: { userId: '1' } });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/users/[userId]', () => {
  beforeEach(() => {
    (UserService.deleteUser as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should delete a user for an admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.deleteUser as jest.Mock).mockResolvedValue({ success: true });

    const req = new NextRequest('http://localhost/api/admin/users/1');
    const res = await DELETE(req, { params: { userId: '1' } });

    expect(res.status).toBe(204);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/users/1');
    const res = await DELETE(req, { params: { userId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (UserService.deleteUser as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/users/1');
    const res = await DELETE(req, { params: { userId: '1' } });

    expect(res.status).toBe(500);
  });
});