import { PrismaClient, MembershipRole } from '@prisma/client';
import teamMembersData from '../mocks/teamMember.mock.json';

export const seedTeamMembers = async (prisma: PrismaClient) => {
  const membersToCreate = teamMembersData.map(member => ({
    ...member,
    role: member.role as MembershipRole,
  }));

  await Promise.all(
    membersToCreate.map(memberData => prisma.teamMember.create({ data: memberData }))
  );

  console.log('✅ Created team memberships');
};
