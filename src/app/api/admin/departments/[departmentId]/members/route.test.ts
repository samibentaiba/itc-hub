import { NextRequest } from 'next/server';
import { POST } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as DepartmentService from '@/server/admin/departments';
import { MembershipRole } from '@prisma/client';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/departments', () => ({
  addDepartmentMember: jest.fn(),
}));

describe('POST /api/admin/departments/[departmentId]/members', () => {
  beforeEach(() => {
    (DepartmentService.addDepartmentMember as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should add a member to a department for an admin user', async () => {
    const newMemberData = { userId: '2', role: MembershipRole.MEMBER };
    const createdMember = { id: '1', departmentId: '1', ...newMemberData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.addDepartmentMember as jest.Mock).mockResolvedValue(createdMember);

    const req = new NextRequest('http://localhost/api/admin/departments/1/members', {
      method: 'POST',
      body: JSON.stringify(newMemberData),
    });
    // ✅ Fix: Wrap params in Promise.resolve()
    const res = await POST(req, { params: Promise.resolve({ departmentId: '1' }) });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(createdMember);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/departments/1/members', {
      method: 'POST',
      body: JSON.stringify({ userId: '2', role: MembershipRole.MEMBER }),
    });
    // ✅ Fix: Wrap params in Promise.resolve()
    const res = await POST(req, { params: Promise.resolve({ departmentId: '1' }) });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);

    const req = new NextRequest('http://localhost/api/admin/departments/1/members', {
        method: 'POST',
        body: JSON.stringify({ userId: '2' }), // Missing role
    });
    // ✅ Fix: Wrap params in Promise.resolve()
    const res = await POST(req, { params: Promise.resolve({ departmentId: '1' }) });

    expect(res.status).toBe(400);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.addDepartmentMember as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/departments/1/members', {
      method: 'POST',
      body: JSON.stringify({ userId: '2', role: MembershipRole.MEMBER }),
    });
    // ✅ Fix: Wrap params in Promise.resolve()
    const res = await POST(req, { params: Promise.resolve({ departmentId: '1' }) });

    expect(res.status).toBe(500);
  });
});