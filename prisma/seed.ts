import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data in proper order to avoid foreign key conflicts
  await prisma.file.deleteMany()
  await prisma.message.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.departmentMember.deleteMany()
  await prisma.event.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.team.deleteMany()
  await prisma.department.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create users first (matching mock data)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'USER-001',
        email: 'sami.bentaiba@example.com',
        name: 'Sami Bentaiba',
        password: hashedPassword,
        role: 'ADMIN',
        avatar: '/avatars/sami.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-002',
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        password: hashedPassword,
        role: 'MANAGER',
        avatar: '/avatars/jane.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-003',
        email: 'john.smith@example.com',
        name: 'John Smith',
        password: hashedPassword,
        role: 'USER',
        avatar: '/avatars/john.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-004',
        email: 'peter.jones@example.com',
        name: 'Peter Jones',
        password: hashedPassword,
        role: 'MANAGER',
        avatar: '/avatars/peter.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-005',
        email: 'mary.williams@example.com',
        name: 'Mary Williams',
        password: hashedPassword,
        role: 'USER',
        avatar: '/avatars/mary.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-006',
        email: 'david.brown@example.com',
        name: 'David Brown',
        password: hashedPassword,
        role: 'MANAGER',
        avatar: '/avatars/david.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-007',
        email: 'patricia.garcia@example.com',
        name: 'Patricia Garcia',
        password: hashedPassword,
        role: 'USER',
        avatar: '/avatars/patricia.png',
        status: 'verified',
      },
    }),
    prisma.user.create({
      data: {
        id: 'USER-008',
        email: 'michael.miller@example.com',
        name: 'Michael Miller',
        password: hashedPassword,
        role: 'USER',
        avatar: '/avatars/michael.png',
        status: 'verified',
      },
    }),
  ])

  console.log('✅ Created users')

  // Create departments (matching mock data)
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        id: 'DEP-001',
        name: 'Engineering',
        description: 'Responsible for all software development and product engineering.',
        status: 'active',
        managerId: 'USER-002', // Jane Doe
        color: '#3b82f6',
      },
    }),
    prisma.department.create({
      data: {
        id: 'DEP-002',
        name: 'Support',
        description: 'Dedicated to providing world-class customer support.',
        status: 'active',
        managerId: 'USER-006', // David Brown
        color: '#10b981',
      },
    }),
    prisma.department.create({
      data: {
        id: 'DEP-003',
        name: 'Executive',
        description: 'High-level company leadership.',
        status: 'active',
        managerId: 'USER-001', // Sami Bentaiba
        color: '#8b5cf6',
      },
    }),
  ])

  console.log('✅ Created departments')

  // Create teams (matching mock data)
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        id: 'TEAM-001',
        name: 'Frontend',
        description: 'Develops and maintains the user interface.',
        status: 'active',
        departmentId: 'DEP-001', // Engineering
        leaderId: 'USER-002', // Jane Doe
      },
    }),
    prisma.team.create({
      data: {
        id: 'TEAM-002',
        name: 'Backend',
        description: 'Manages the server-side logic and database.',
        status: 'active',
        departmentId: 'DEP-001', // Engineering
        leaderId: 'USER-004', // Peter Jones
      },
    }),
    prisma.team.create({
      data: {
        id: 'TEAM-003',
        name: 'Tier 1 Support',
        description: 'First line of response for customer issues.',
        status: 'active',
        departmentId: 'DEP-002', // Support
        leaderId: 'USER-006', // David Brown
      },
    }),
    prisma.team.create({
      data: {
        id: 'TEAM-004',
        name: 'Tier 2 Support',
        description: 'Handles escalated and technical support cases.',
        status: 'active',
        departmentId: 'DEP-002', // Support
        leaderId: 'USER-006', // David Brown
      },
    }),
    prisma.team.create({
      data: {
        id: 'TEAM-005',
        name: 'Management',
        description: 'Company leadership.',
        status: 'active',
        departmentId: 'DEP-003', // Executive
        leaderId: 'USER-001', // Sami Bentaiba
      },
    }),
  ])

  console.log('✅ Created teams')

  // Create department memberships
  await Promise.all([
    // Engineering department members
    prisma.departmentMember.create({
      data: {
        userId: 'USER-002',
        departmentId: 'DEP-001',
        role: 'MANAGER',
      },
    }),
    prisma.departmentMember.create({
      data: {
        userId: 'USER-003',
        departmentId: 'DEP-001',
        role: 'USER',
      },
    }),
    prisma.departmentMember.create({
      data: {
        userId: 'USER-004',
        departmentId: 'DEP-001',
        role: 'MANAGER',
      },
    }),
    prisma.departmentMember.create({
      data: {
        userId: 'USER-005',
        departmentId: 'DEP-001',
        role: 'USER',
      },
    }),
    // Support department members
    prisma.departmentMember.create({
      data: {
        userId: 'USER-006',
        departmentId: 'DEP-002',
        role: 'MANAGER',
      },
    }),
    prisma.departmentMember.create({
      data: {
        userId: 'USER-007',
        departmentId: 'DEP-002',
        role: 'USER',
      },
    }),
    prisma.departmentMember.create({
      data: {
        userId: 'USER-008',
        departmentId: 'DEP-002',
        role: 'USER',
      },
    }),
    // Executive department members
    prisma.departmentMember.create({
      data: {
        userId: 'USER-001',
        departmentId: 'DEP-003',
        role: 'ADMIN',
      },
    }),
  ])

  console.log('✅ Created department memberships')

  // Create team memberships
  await Promise.all([
    // Frontend team
    prisma.teamMember.create({
      data: {
        userId: 'USER-002',
        teamId: 'TEAM-001',
        role: 'MANAGER',
      },
    }),
    prisma.teamMember.create({
      data: {
        userId: 'USER-003',
        teamId: 'TEAM-001',
        role: 'USER',
      },
    }),
    // Backend team
    prisma.teamMember.create({
      data: {
        userId: 'USER-004',
        teamId: 'TEAM-002',
        role: 'MANAGER',
      },
    }),
    prisma.teamMember.create({
      data: {
        userId: 'USER-005',
        teamId: 'TEAM-002',
        role: 'USER',
      },
    }),
    // Tier 1 Support
    prisma.teamMember.create({
      data: {
        userId: 'USER-006',
        teamId: 'TEAM-003',
        role: 'MANAGER',
      },
    }),
    prisma.teamMember.create({
      data: {
        userId: 'USER-007',
        teamId: 'TEAM-003',
        role: 'USER',
      },
    }),
    // Tier 2 Support
    prisma.teamMember.create({
      data: {
        userId: 'USER-008',
        teamId: 'TEAM-004',
        role: 'USER',
      },
    }),
    // Management
    prisma.teamMember.create({
      data: {
        userId: 'USER-001',
        teamId: 'TEAM-005',
        role: 'ADMIN',
      },
    }),
  ])

  console.log('✅ Created team memberships')

  // Create tickets (matching mock data)
  await Promise.all([
    prisma.ticket.create({
      data: {
        id: 'TICKET-001',
        title: 'Login button unresponsive on Firefox',
        description: 'Users on the latest Firefox version are reporting that the main login button does not trigger any action.',
        type: 'TASK',
        status: 'OPEN',
        priority: 'HIGH',
        assigneeId: 'USER-003', // John Smith
        createdById: 'USER-007', // Patricia Garcia
        departmentId: 'DEP-001', // Engineering
        teamId: 'TEAM-001', // Frontend
        createdAt: new Date('2025-08-11T10:00:00Z'),
        updatedAt: new Date('2025-08-11T11:30:00Z'),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'TICKET-002',
        title: 'API endpoint /api/users returning 500 error',
        description: 'The user list endpoint is consistently failing with an internal server error. This is blocking user management tasks.',
        type: 'TASK',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: 'USER-005', // Mary Williams
        createdById: 'USER-001', // Sami Bentaiba
        departmentId: 'DEP-001', // Engineering
        teamId: 'TEAM-002', // Backend
        createdAt: new Date('2025-08-11T09:30:00Z'),
        updatedAt: new Date('2025-08-11T14:00:00Z'),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'TICKET-003',
        title: 'Update password policy documentation',
        description: 'The internal documentation for password requirements needs to be updated to reflect the new 12-character minimum.',
        type: 'TASK',
        status: 'CLOSED',
        priority: 'LOW',
        assigneeId: 'USER-007', // Patricia Garcia
        createdById: 'USER-002', // Jane Doe
        departmentId: 'DEP-002', // Support
        teamId: 'TEAM-003', // Tier 1 Support
        createdAt: new Date('2025-08-10T15:00:00Z'),
        updatedAt: new Date('2025-08-10T16:00:00Z'),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'TICKET-004',
        title: 'Customer cannot reset their password',
        description: 'A customer (user ID: CUST-554) is unable to reset their password via the forgot password link. They are not receiving the email.',
        type: 'TASK',
        status: 'OPEN',
        priority: 'MEDIUM',
        assigneeId: 'USER-008', // Michael Miller
        createdById: 'USER-007', // Patricia Garcia
        departmentId: 'DEP-002', // Support
        teamId: 'TEAM-004', // Tier 2 Support
        createdAt: new Date('2025-08-11T18:00:00Z'),
        updatedAt: new Date('2025-08-11T18:00:00Z'),
      },
    }),
  ])

  console.log('✅ Created tickets')

  // Create ticket comments (messages)
  await Promise.all([
    prisma.message.create({
      data: {
        id: 'COMMENT-001',
        ticketId: 'TICKET-001',
        senderId: 'USER-007', // Patricia Garcia
        content: "I've replicated this on Firefox v130. It seems to be an issue with a recent update.",
        type: 'text',
        timestamp: new Date('2025-08-11T10:05:00Z'),
      },
    }),
    prisma.message.create({
      data: {
        id: 'COMMENT-002',
        ticketId: 'TICKET-001',
        senderId: 'USER-003', // John Smith
        content: "Thanks for the report. I'm looking into it now. It might be related to the new CSS changes.",
        type: 'text',
        timestamp: new Date('2025-08-11T11:35:00Z'),
      },
    }),
  ])

  console.log('✅ Created ticket comments')

  // Create sample events
  await Promise.all([
    prisma.event.create({
      data: {
        id: 'EVENT-001',
        title: 'Q3 Planning Meeting',
        description: 'Quarterly planning session for all managers.',
        date: new Date('2025-08-12T14:00:00Z'),
        time: '14:00',
        duration: 60,
        type: 'meeting',
        location: 'Conference Room A',
        organizerId: 'USER-001',
        departmentId: 'DEP-003',
      },
    }),
    prisma.event.create({
      data: {
        id: 'TE-001',
        title: 'Frontend Team Sync',
        description: 'Weekly team sync for Frontend.',
        date: new Date('2025-08-13T09:00:00Z'),
        time: '09:00',
        duration: 30,
        type: 'team-event',
        location: 'Virtual',
        organizerId: 'USER-002',
        departmentId: 'DEP-001',
      },
    }),
    prisma.event.create({
      data: {
        id: 'DE-001',
        title: 'Engineering All-Hands',
        description: 'Monthly sync for the entire engineering department.',
        date: new Date('2025-08-14T11:00:00Z'),
        time: '11:00',
        duration: 60,
        type: 'department-event',
        location: 'Main Hall',
        organizerId: 'USER-002',
        departmentId: 'DEP-001',
      },
    }),
  ])

  console.log('✅ Created events')

  // Create sample notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: 'USER-003',
        title: 'New Ticket Assigned',
        description: 'You have been assigned to ticket: Login button unresponsive on Firefox',
        type: 'ASSIGNMENT',
      },
    }),
    prisma.notification.create({
      data: {
        userId: 'USER-005',
        title: 'New Ticket Assigned',
        description: 'You have been assigned to ticket: API endpoint /api/users returning 500 error',
        type: 'ASSIGNMENT',
      },
    }),
  ])

  console.log('✅ Created notifications')

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: sami.bentaiba@example.com / password123')
  console.log('👤 Manager user: jane.doe@example.com / password123')
  console.log('👤 Regular user: john.smith@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
