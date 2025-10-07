
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    department: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    departmentMember: {
      findFirst: jest.fn(),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/departments/[departmentId]', () => {
  beforeEach(() => {
    (prisma.department.findUnique as jest.Mock).mockClear();
    (prisma.departmentMember.findFirst as jest.Mock).mockClear();
    (getServerSession as jest.Mock).mockClear();
  });

  it('should return the department for an admin user', async () => {
    const mockDepartment = { id: '1', name: 'Test Department', members: [] };
    (prisma.department.findUnique as jest.Mock).mockResolvedValue(mockDepartment);
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Test Department');
  });

  it('should return the department for a member of the department', async () => {
    const mockDepartment = { id: '1', name: 'Test Department', members: [] };
    (prisma.department.findUnique as jest.Mock).mockResolvedValue(mockDepartment);
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '2', role: 'USER' } });
    (prisma.departmentMember.findFirst as jest.Mock).mockResolvedValue({ userId: '2', departmentId: '1' });

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
  });

  it('should return 403 if the user is not a member of the department', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '3', role: 'USER' } });
    (prisma.departmentMember.findFirst as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(403);
  });

  it('should return 404 when the department is not found', async () => {
    (prisma.department.findUnique as jest.Mock).mockResolvedValue(null);
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(404);
  });

  it('should return 401 when the user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/departments/[departmentId]', () => {
  it('should update the department when the user is an admin', async () => {
    const updatedData = { name: 'Updated Department' };
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
    (prisma.department.update as jest.Mock).mockResolvedValue({ id: '1', ...updatedData });

    const req = new NextRequest('http://localhost/api/departments/1', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Updated Department');
  });

  it('should return 403 when the user is not an admin', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'USER' } });

    const req = new NextRequest('http://localhost/api/departments/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'test' }),
    });
    const res = await PUT(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/departments/[departmentId]', () => {
  it('should delete the department when the user is an admin', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
    (prisma.department.delete as jest.Mock).mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await DELETE(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
  });

  it('should return 403 when the user is not an admin', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1', role: 'USER' } });

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await DELETE(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(403);
  });
});
