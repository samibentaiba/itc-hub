import { PrismaClient } from '@prisma/client';
import departmentsData from '../mocks/department.mock.json';

export const seedDepartments = async (prisma: PrismaClient) => {
  const departments = await Promise.all(
    departmentsData.map(departmentData => prisma.department.create({ data: departmentData }))
  );

  console.log('✅ Created departments');
  return departments;
};