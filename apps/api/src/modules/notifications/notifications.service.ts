import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationDto, NotificationQueryDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        actionUrl: dto.actionUrl,
      },
    });

    return this.mapNotification(notification);
  }

  async createBulkNotifications(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    actionUrl?: string,
  ) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        title,
        message,
        actionUrl,
      })),
    });

    return { count: notifications.count };
  }

  async getNotifications(userId: string, query: NotificationQueryDto) {
    const where: any = { userId };

    if (query.type) where.type = query.type;
    if (query.unreadOnly) {
      where.read = false;
    }

    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    const offset = query.offset ? parseInt(query.offset, 10) : 0;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return {
      data: notifications.map((n) => this.mapNotification(n)),
      meta: {
        total,
        unreadCount,
        limit,
        offset,
        hasMore: offset + notifications.length < total,
      },
    };
  }

  async getNotificationById(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.mapNotification(notification);
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return this.mapNotification(updated);
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return { count: result.count };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({ where: { id: notificationId } });
  }

  async deleteAllRead(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, read: true },
    });

    return { count: result.count };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });

    return { count };
  }

  // Helper methods for creating common notification types
  async notifyTaskAssigned(userId: string, taskTitle: string, taskId: string) {
    return this.createNotification({
      userId,
      type: 'TASK_ASSIGNED',
      title: 'New Task Assigned',
      message: `You have been assigned to: ${taskTitle}`,
      actionUrl: `/tasks/${taskId}`,
    });
  }

  async notifyTaskDue(userId: string, taskTitle: string, taskId: string) {
    return this.createNotification({
      userId,
      type: 'TASK_DUE',
      title: 'Task Due Soon',
      message: `Task "${taskTitle}" is due soon`,
      actionUrl: `/tasks/${taskId}`,
    });
  }

  async notifyBillDue(userId: string, billName: string, amount: number) {
    return this.createNotification({
      userId,
      type: 'BILL_DUE',
      title: 'Bill Due Soon',
      message: `${billName} ($${amount.toFixed(2)}) is due soon`,
      actionUrl: '/finance/bills',
    });
  }

  async notifyLowStock(userId: string, itemName: string, quantity: number) {
    return this.createNotification({
      userId,
      type: 'LOW_STOCK',
      title: 'Low Stock Alert',
      message: `${itemName} is running low (${quantity} remaining)`,
      actionUrl: '/inventory',
    });
  }

  async notifyExpiringItem(
    userId: string,
    itemName: string,
    daysUntilExpiry: number,
  ) {
    return this.createNotification({
      userId,
      type: 'EXPIRING_ITEM',
      title: 'Item Expiring Soon',
      message: `${itemName} expires in ${daysUntilExpiry} day(s)`,
      actionUrl: '/inventory',
    });
  }

  async notifyUpcomingEvent(userId: string, eventTitle: string, eventId: string) {
    return this.createNotification({
      userId,
      type: 'UPCOMING_EVENT',
      title: 'Upcoming Event',
      message: `Event "${eventTitle}" is coming up`,
      actionUrl: `/calendar?event=${eventId}`,
    });
  }

  async notifyVaccinationDue(userId: string, petName: string, vaccineName: string) {
    return this.createNotification({
      userId,
      type: 'VACCINATION_DUE',
      title: 'Vaccination Due',
      message: `${petName}'s ${vaccineName} vaccination is due`,
      actionUrl: '/pets',
    });
  }

  async notifyMaintenanceDue(userId: string, vehicleName: string, maintenanceType: string) {
    return this.createNotification({
      userId,
      type: 'MAINTENANCE_DUE',
      title: 'Vehicle Maintenance Due',
      message: `${vehicleName} needs ${maintenanceType}`,
      actionUrl: '/vehicles',
    });
  }

  private mapNotification(notification: any) {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      actionUrl: notification.actionUrl,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
