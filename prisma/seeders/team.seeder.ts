import { PrismaClient } from '@prisma/client';
import teamsData from '../mocks/team.mock.json';

export const seedTeams = async (prisma: PrismaClient) => {
  const teams = await Promise.all(
    teamsData.map(teamData => prisma.team.create({ data: teamData }))
  );

  console.log('✅ Created teams');
  return teams;
};