import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@itc.com' },
    update: {},
    create: {
      email: 'admin@itc.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'verified', // Added status field
    },
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@itc.com' },
    update: {},
    create: {
      email: 'user@itc.com',
      name: 'Regular User',
      password: userPassword,
      role: 'MEMBER',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'verified', // Added status field
    },
  })

  // Create departments
  const developmentDept = await prisma.department.upsert({
    where: { name: 'Development' },
    update: {},
    create: {
      name: 'Development',
      description: 'Software development team',
      status: 'active',
    },
  })

  const designDept = await prisma.department.upsert({
    where: { name: 'Design' },
    update: {},
    create: {
      name: 'Design',
      description: 'UI/UX design team',
      status: 'active',
    },
  })

  // Create teams
  const frontendTeam = await prisma.team.upsert({
    where: { name: 'Frontend Team' },
    update: {},
    create: {
      name: 'Frontend Team',
      description: 'Frontend development team',
      status: 'active',
      departmentId: developmentDept.id,
    },
  })

  const backendTeam = await prisma.team.upsert({
    where: { name: 'Backend Team' },
    update: {},
    create: {
      name: 'Backend Team',
      description: 'Backend development team',
      status: 'active',
      departmentId: developmentDept.id,
    },
  })

  // Add users to departments
  await prisma.departmentMember.upsert({
    where: {
      userId_departmentId: {
        userId: admin.id,
        departmentId: developmentDept.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      departmentId: developmentDept.id,
      role: 'LEADER',
    },
  })

  await prisma.departmentMember.upsert({
    where: {
      userId_departmentId: {
        userId: user.id,
        departmentId: designDept.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      departmentId: designDept.id,
      role: 'MEMBER',
    },
  })

  // Add users to teams
  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: admin.id,
        teamId: frontendTeam.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      teamId: frontendTeam.id,
      role: 'LEADER',
    },
  })

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: backendTeam.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      teamId: backendTeam.id,
      role: 'MEMBER',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@itc.com / admin123')
  console.log('👤 Regular user: user@itc.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
