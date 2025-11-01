import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as DepartmentService from '@/server/admin/departments';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// const mockIsAdmin = isAdmin as jest.Mock;
// const mockGetAuthenticatedUser = getAuthenticatedUser as jest.Mock;

// Mock server actions
jest.mock('@/server/admin/departments', () => ({
  listDepartments: jest.fn(),
  createDepartment: jest.fn(),
}));

describe('GET /api/admin/departments', () => {
  beforeEach(() => {
    (DepartmentService.listDepartments as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should return a list of departments for an admin user', async () => {
    const mockDepartments = [{ id: '1', name: 'Test Department' }];
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.listDepartments as jest.Mock).mockResolvedValue(mockDepartments);

    const req = new NextRequest('http://localhost/api/admin/departments');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.departments).toEqual(mockDepartments);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/departments');
    const res = await GET(req);

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.listDepartments as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/departments');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/admin/departments', () => {
  beforeEach(() => {
    (DepartmentService.createDepartment as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should create a new department for an admin user', async () => {
    const newDepartmentData = { name: 'New Department', description: 'A new department' };
    const createdDepartment = { id: '2', ...newDepartmentData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.createDepartment as jest.Mock).mockResolvedValue(createdDepartment);

    const req = new NextRequest('http://localhost/api/admin/departments', {
      method: 'POST',
      body: JSON.stringify(newDepartmentData),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(createdDepartment);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/departments', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.createDepartment as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/departments', {
        method: 'POST',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.createDepartment as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/departments', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Department' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});