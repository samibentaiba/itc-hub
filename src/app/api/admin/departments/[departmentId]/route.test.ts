import { NextRequest } from 'next/server';
import { PUT, DELETE } from './route';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';
import * as DepartmentService from '@/server/admin/departments';

// Mock auth-helpers
jest.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock server actions
jest.mock('@/server/admin/departments', () => ({
  updateDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
}));

describe('PUT /api/admin/departments/[departmentId]', () => {
  beforeEach(() => {
    (DepartmentService.updateDepartment as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should update a department for an admin user', async () => {
    const updatedData = { name: 'Updated Department' };
    const updatedDepartment = { id: '1', ...updatedData };
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.updateDepartment as jest.Mock).mockResolvedValue(updatedDepartment);

    const req = new NextRequest('http://localhost/api/admin/departments/1', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(updatedDepartment);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/departments/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'test' }),
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid data', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.updateDepartment as jest.Mock).mockRejectedValue(new Error('Validation error'));

    const req = new NextRequest('http://localhost/api/admin/departments/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 't' }), // Invalid name
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(500);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.updateDepartment as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/departments/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test Department' }),
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/departments/[departmentId]', () => {
  beforeEach(() => {
    (DepartmentService.deleteDepartment as jest.Mock).mockClear();
    (getAuthenticatedUser as jest.Mock).mockClear();
    (isAdmin as jest.Mock).mockClear();
  });

  it('should delete a department for an admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.deleteDepartment as jest.Mock).mockResolvedValue({ success: true });

    const req = new NextRequest('http://localhost/api/admin/departments/1');
    const res = await DELETE(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(204);
  });

  it('should return 403 for a non-admin user', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '2' } });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/admin/departments/1');
    const res = await DELETE(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 500 if the database query fails', async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (DepartmentService.deleteDepartment as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost/api/admin/departments/1');
    const res = await DELETE(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(500);
  });
});