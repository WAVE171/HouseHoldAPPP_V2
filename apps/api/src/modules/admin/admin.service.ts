import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';
import { AuditLogQueryDto, CreateAuditLogDto, CreateHouseholdDto, AdminUpdateHouseholdDto, HouseholdsQueryDto } from './dto/admin.dto';
import * as bcrypt from 'bcryptjs';

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

  // ============================================
  // SUPER ADMIN - Household Management
  // ============================================

  async getAllHouseholds(query: HouseholdsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const [households, total] = await Promise.all([
      this.prisma.household.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { email: true },
          },
          members: {
            include: {
              user: {
                select: { role: true, email: true },
              },
            },
          },
          _count: {
            select: {
              tasks: true,
              transactions: true,
              vehicles: true,
              pets: true,
              employees: true,
              children: true,
            },
          },
        },
      }),
      this.prisma.household.count({ where }),
    ]);

    return {
      data: households.map((h) => {
        // Find the admin for this household
        const admin = h.members.find(m => m.user.role === 'ADMIN');
        return {
          id: h.id,
          name: h.name,
          address: h.address,
          phone: h.phone,
          memberCount: h.members.length,
          adminEmail: admin?.user.email || h.creator.email,
          createdAt: h.createdAt.toISOString(),
          stats: h._count,
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async createHousehold(dto: CreateHouseholdDto) {
    // Check if admin email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate password if not provided
    const password = dto.adminPassword || this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create household with admin user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the admin user
      const user = await tx.user.create({
        data: {
          email: dto.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      // Create the household
      const household = await tx.household.create({
        data: {
          name: dto.name,
          address: dto.address,
          phone: dto.phone,
          creatorId: user.id,
        },
      });

      // Create the user profile linked to the household
      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
          householdId: household.id,
        },
      });

      return { household, user, tempPassword: dto.adminPassword ? undefined : password };
    });

    return {
      id: result.household.id,
      name: result.household.name,
      address: result.household.address,
      phone: result.household.phone,
      adminEmail: dto.adminEmail,
      adminName: `${dto.adminFirstName} ${dto.adminLastName}`,
      tempPassword: result.tempPassword, // Only returned if generated
      createdAt: result.household.createdAt.toISOString(),
    };
  }

  async updateHouseholdById(householdId: string, dto: AdminUpdateHouseholdDto) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const updated = await this.prisma.household.update({
      where: { id: householdId },
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      phone: updated.phone,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteHousehold(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: { members: true },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    // Delete all related data in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Delete all user profiles associated with this household
      await tx.userProfile.deleteMany({ where: { householdId } });

      // Delete the household (cascades to related data)
      await tx.household.delete({ where: { id: householdId } });
    });

    return { success: true, message: 'Household deleted successfully' };
  }

  async getHouseholdMembers(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                lastLoginAt: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return household.members.map((m) => ({
      id: m.user.id,
      email: m.user.email,
      firstName: m.firstName,
      lastName: m.lastName,
      role: m.user.role,
      avatar: m.avatar,
      lastLoginAt: m.user.lastLoginAt?.toISOString(),
      joinedAt: m.createdAt.toISOString(),
    }));
  }

  async assignHouseholdAdmin(householdId: string, userId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify user belongs to this household
    if (user.profile?.householdId !== householdId) {
      throw new ForbiddenException('User does not belong to this household');
    }

    // Update user role to ADMIN
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
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

  async getAllUsersSystemWide(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            include: {
              household: {
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        firstName: u.profile?.firstName,
        lastName: u.profile?.lastName,
        avatar: u.profile?.avatar,
        householdId: u.profile?.householdId,
        householdName: u.profile?.household?.name,
        lastLoginAt: u.lastLoginAt?.toISOString(),
        createdAt: u.createdAt.toISOString(),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
