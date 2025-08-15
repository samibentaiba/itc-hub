import { PrismaClient, MembershipRole } from '@prisma/client';
import departmentMembersData from '../mocks/departmentMember.mock.json';

export const seedDepartmentMembers = async (prisma: PrismaClient) => {
  const membersToCreate = departmentMembersData.map(member => ({
    ...member,
    role: member.role as MembershipRole,
  }));

  await Promise.all(
    membersToCreate.map(memberData => prisma.departmentMember.create({ data: memberData }))
  );

  console.log('✅ Created department memberships');
};
