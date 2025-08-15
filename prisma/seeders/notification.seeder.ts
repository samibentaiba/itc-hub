import { PrismaClient, NotificationType } from '@prisma/client';
import notificationsData from '../mocks/notification.mock.json';

export const seedNotifications = async (prisma: PrismaClient) => {
  const notificationsToCreate = notificationsData.map(notification => ({
    ...notification,
    type: notification.type as NotificationType,
  }));

  await Promise.all(
    notificationsToCreate.map(notificationData => prisma.notification.create({ data: notificationData }))
  );

  console.log('✅ Created notifications');
};
