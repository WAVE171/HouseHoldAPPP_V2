import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';
import { AuditLogQueryDto, CreateAuditLogDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // User management
  async getAllUsers(householdId: string) {
    const profiles = await this.prisma.userProfile.findMany({
      where: { householdId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            lastLoginAt: true,
            lockedUntil: true,
            failedLoginAttempts: true,
            twoFactorEnabled: true,
            createdAt: true,
          },
        },
      },
    });

    return profiles.map((profile) => ({
      id: profile.user.id,
      email: profile.user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.user.role,
      avatar: profile.avatar,
      lastLoginAt: profile.user.lastLoginAt?.toISOString(),
      isLocked: profile.user.lockedUntil
        ? new Date(profile.user.lockedUntil) > new Date()
        : false,
      lockedUntil: profile.user.lockedUntil?.toISOString(),
      failedLoginAttempts: profile.user.failedLoginAttempts,
      twoFactorEnabled: profile.user.twoFactorEnabled,
      createdAt: profile.user.createdAt.toISOString(),
    }));
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      avatar: user.profile?.avatar,
      phone: user.profile?.phone,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      isLocked: user.lockedUntil ? new Date(user.lockedUntil) > new Date() : false,
      lockedUntil: user.lockedUntil?.toISOString(),
      failedLoginAttempts: user.failedLoginAttempts,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt.toISOString(),
      recentSessions: user.sessions.map((s) => ({
        id: s.id,
        createdAt: s.createdAt.toISOString(),
        expiresAt: s.expiresAt.toISOString(),
      })),
    };
  }

  async updateUserRole(adminId: string, userId: string, newRole: Role) {
    // Prevent admin from changing their own role
    if (adminId === userId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      include: { profile: true },
    });

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      firstName: updated.profile?.firstName,
      lastName: updated.profile?.lastName,
    };
  }

  async lockUser(userId: string, lockedUntil?: Date) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: lockedUntil || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      lockedUntil: updated.lockedUntil?.toISOString(),
    };
  }

  async unlockUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      lockedUntil: null,
    };
  }

  async revokeUserSessions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.session.deleteMany({ where: { userId } });

    return { success: true, message: 'All sessions revoked' };
  }

  // Household management
  async getHouseholdInfo(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        creator: {
          select: { email: true },
        },
        members: {
          include: {
            user: {
              select: { role: true },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            events: true,
            inventoryItems: true,
            transactions: true,
            vehicles: true,
            pets: true,
            employees: true,
            recipes: true,
          },
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return {
      id: household.id,
      name: household.name,
      address: household.address,
      phone: household.phone,
      creatorEmail: household.creator.email,
      memberCount: household.members.length,
      members: household.members.map((m) => ({
        firstName: m.firstName,
        lastName: m.lastName,
        role: m.user.role,
      })),
      stats: household._count,
      createdAt: household.createdAt.toISOString(),
    };
  }

  // Audit logs
  async getAuditLogs(query: AuditLogQueryDto) {
    const where: any = {};

    if (query.userId) where.userId = query.userId;
    if (query.action) where.action = query.action;
    if (query.resource) where.resource = query.resource;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    const offset = query.offset ? parseInt(query.offset, 10) : 0;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => ({
        id: log.id,
        userId: log.userId,
        userEmail: log.userEmail,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt.toISOString(),
      })),
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + logs.length < total,
      },
    };
  }

  async createAuditLog(dto: CreateAuditLogDto) {
    const log = await this.prisma.auditLog.create({
      data: {
        userId: dto.userId,
        userEmail: dto.userEmail,
        action: dto.action,
        resource: dto.resource,
        resourceId: dto.resourceId,
        details: dto.details,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });

    return {
      id: log.id,
      action: log.action,
      resource: log.resource,
      createdAt: log.createdAt.toISOString(),
    };
  }

  // System stats (for super admin)
  async getSystemStats() {
    const [
      totalUsers,
      totalHouseholds,
      totalTasks,
      totalTransactions,
      recentLogins,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.household.count(),
      this.prisma.task.count(),
      this.prisma.transaction.count(),
      this.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalHouseholds,
      totalTasks,
      totalTransactions,
      activeUsersLast24h: recentLogins,
    };
  }
}
