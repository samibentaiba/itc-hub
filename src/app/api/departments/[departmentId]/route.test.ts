
import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    department: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/departments/[departmentId]', () => {
  it('should return the department when found', async () => {
    const mockDepartment = {
      id: '1',
      name: 'Test Department',
      description: 'Test Description',
      managers: [],
      members: [],
      teams: [],
      tickets: [],
      events: [],
    };

    (prisma.department.findUnique as jest.Mock).mockResolvedValue(mockDepartment);
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });

    const req = new NextRequest('http://localhost/api/departments/1');
    const res = await GET(req, { params: { departmentId: '1' } });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Test Department');
  });

  it('should return 404 when the department is not found', async () => {
    (prisma.department.findUnique as jest.Mock).mockResolvedValue(null);
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });

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
