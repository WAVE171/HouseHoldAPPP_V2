import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { AuditLogQueryDto, CreateAuditLogDto, CreateHouseholdDto, AdminUpdateHouseholdDto, HouseholdsQueryDto, AdminCreateUserDto, SubscriptionsQueryDto, UpdateSubscriptionDto } from './dto/admin.dto';
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

  // System stats (for super admin) - Enhanced operational metrics
  async getSystemStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalHouseholds,
      activeHouseholds,
      suspendedHouseholds,
      activeUsersLast24h,
      newUsersLast7Days,
      newHouseholdsLast30Days,
      subscriptionStats,
    ] = await Promise.all([
      // Total users count
      this.prisma.user.count(),
      // Total households count
      this.prisma.household.count(),
      // Active households (any member logged in last 30 days)
      this.prisma.household.count({
        where: {
          OR: [
            { lastActiveAt: { gte: last30Days } },
            { members: { some: { user: { lastLoginAt: { gte: last30Days } } } } },
          ],
        },
      }),
      // Suspended households
      this.prisma.household.count({
        where: { status: 'SUSPENDED' },
      }),
      // Active users in last 24h
      this.prisma.user.count({
        where: { lastLoginAt: { gte: last24h } },
      }),
      // New users in last 7 days
      this.prisma.user.count({
        where: { createdAt: { gte: last7Days } },
      }),
      // New households in last 30 days
      this.prisma.household.count({
        where: { createdAt: { gte: last30Days } },
      }),
      // Subscription stats by plan
      this.prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true },
      }),
    ]);

    // Format subscription stats
    const subscriptionsByPlan: Record<string, number> = {
      FREE: 0,
      BASIC: 0,
      PREMIUM: 0,
      ENTERPRISE: 0,
    };
    subscriptionStats.forEach((s) => {
      subscriptionsByPlan[s.plan] = s._count.plan;
    });

    return {
      // Core metrics
      totalUsers,
      totalHouseholds,
      activeHouseholds,
      suspendedHouseholds,
      inactiveHouseholds: totalHouseholds - activeHouseholds - suspendedHouseholds,

      // Activity metrics
      activeUsersLast24h,
      newUsersLast7Days,
      newHouseholdsLast30Days,

      // Subscription metrics
      subscriptionsByPlan,

      // Note: Super Admin should NOT see detailed household data
      // Only aggregate counts for system health monitoring
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

  // Suspend household (read-only mode)
  async suspendHousehold(householdId: string, reason?: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    if (household.status === 'SUSPENDED') {
      throw new BadRequestException('Household is already suspended');
    }

    const updated = await this.prisma.household.update({
      where: { id: householdId },
      data: { status: 'SUSPENDED' },
    });

    // Log the suspension
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'SUSPEND',
      resource: 'Household',
      resourceId: householdId,
      details: { reason },
    });

    return {
      id: updated.id,
      name: updated.name,
      status: updated.status,
      message: 'Household suspended. Members can view data but cannot make changes.',
    };
  }

  // Unsuspend household
  async unsuspendHousehold(householdId: string) {
    const household = await this.prisma.household.findUnique({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    if (household.status !== 'SUSPENDED') {
      throw new BadRequestException('Household is not suspended');
    }

    const updated = await this.prisma.household.update({
      where: { id: householdId },
      data: { status: 'ACTIVE' },
    });

    // Log the unsuspension
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'UNSUSPEND',
      resource: 'Household',
      resourceId: householdId,
    });

    return {
      id: updated.id,
      name: updated.name,
      status: updated.status,
      message: 'Household reactivated. Members can now make changes.',
    };
  }

  // Reset user password (Super Admin only)
  async resetUserPassword(userId: string, newPassword?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent resetting Super Admin password via this method
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot reset Super Admin password via this method');
    }

    // Generate password if not provided
    const password = newPassword || this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Revoke all existing sessions
    await this.prisma.session.deleteMany({ where: { userId } });

    // Log the password reset
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'PASSWORD_RESET',
      resource: 'User',
      resourceId: userId,
      details: { targetEmail: user.email },
    });

    return {
      userId: user.id,
      email: user.email,
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      tempPassword: newPassword ? undefined : password, // Only return if generated
      message: 'Password reset successfully. All sessions revoked.',
    };
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

  // ============================================
  // SUPER ADMIN - User Creation
  // ============================================

  async createUser(dto: AdminCreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate householdId requirement based on role
    // SUPER_ADMIN users don't need a household
    // All other roles require a household
    if (dto.role !== 'SUPER_ADMIN' && !dto.householdId) {
      throw new BadRequestException('Household ID is required for non-Super Admin users');
    }

    // If householdId is provided, verify it exists
    if (dto.householdId) {
      const household = await this.prisma.household.findUnique({
        where: { id: dto.householdId },
      });
      if (!household) {
        throw new NotFoundException('Household not found');
      }
    }

    // Generate password if not provided
    const password = dto.password || this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
        },
      });

      // Create the user profile - always create a profile, householdId is optional for SUPER_ADMIN
      const profile = await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          householdId: dto.householdId || undefined,
        },
      });

      return { user, profile, tempPassword: dto.password ? undefined : password };
    });

    return {
      id: result.user.id,
      email: result.user.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: result.user.role,
      householdId: dto.householdId,
      tempPassword: result.tempPassword, // Only returned if generated
      createdAt: result.user.createdAt.toISOString(),
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

  // ============================================
  // SUBSCRIPTION MANAGEMENT (Super Admin)
  // ============================================

  async getSubscriptions(query: SubscriptionsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.plan) where.plan = query.plan;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.household = { name: { contains: query.search, mode: 'insensitive' } };
    }

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          household: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return {
      data: subscriptions.map((s) => ({
        id: s.id,
        householdId: s.householdId,
        householdName: s.household.name,
        plan: s.plan,
        status: s.status,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate?.toISOString(),
        trialEndsAt: s.trialEndsAt?.toISOString(),
        amount: s.amount,
        currency: s.currency,
        billingCycle: s.billingCycle,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
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

  async getSubscriptionStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      activeSubscriptions,
      trialSubscriptions,
      cancelledThisMonth,
      byPlan,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      // Active subscriptions
      this.prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      // Trial subscriptions
      this.prisma.subscription.count({
        where: { status: 'TRIAL' },
      }),
      // Cancelled this month
      this.prisma.subscription.count({
        where: {
          status: 'CANCELLED',
          updatedAt: { gte: startOfMonth },
        },
      }),
      // By plan
      this.prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true },
      }),
      // Total revenue (all time)
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      // Monthly recurring revenue (active monthly subscriptions)
      this.prisma.subscription.aggregate({
        _sum: { amount: true },
        where: {
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
        },
      }),
    ]);

    // Format by plan stats
    const byPlanStats: Record<string, number> = {
      FREE: 0,
      BASIC: 0,
      PREMIUM: 0,
      ENTERPRISE: 0,
    };
    byPlan.forEach((p) => {
      byPlanStats[p.plan] = p._count.plan;
    });

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRecurringRevenue: monthlyRevenue._sum.amount || 0,
      activeSubscriptions,
      trialSubscriptions,
      cancelledThisMonth,
      byPlan: byPlanStats,
    };
  }

  async updateSubscription(subscriptionId: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { household: { select: { name: true } } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Update the amount based on plan if plan is being changed
    let amount = subscription.amount;
    if (dto.plan && dto.plan !== subscription.plan) {
      amount = this.getPlanAmount(dto.plan);
    }

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        plan: dto.plan,
        status: dto.status,
        amount,
      },
      include: { household: { select: { id: true, name: true } } },
    });

    // Log the change
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'SUBSCRIPTION_UPDATE',
      resource: 'Subscription',
      resourceId: subscriptionId,
      details: {
        householdId: subscription.householdId,
        householdName: subscription.household.name,
        changes: dto,
      },
    });

    return {
      id: updated.id,
      householdId: updated.householdId,
      householdName: updated.household.name,
      plan: updated.plan,
      status: updated.status,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate?.toISOString(),
      trialEndsAt: updated.trialEndsAt?.toISOString(),
      amount: updated.amount,
      currency: updated.currency,
      billingCycle: updated.billingCycle,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async extendTrial(subscriptionId: string, days: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { household: { select: { name: true } } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Calculate new trial end date
    const currentTrialEnd = subscription.trialEndsAt || new Date();
    const newTrialEnd = new Date(currentTrialEnd);
    newTrialEnd.setDate(newTrialEnd.getDate() + days);

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        trialEndsAt: newTrialEnd,
        status: 'TRIAL',
      },
      include: { household: { select: { id: true, name: true } } },
    });

    // Log the extension
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'TRIAL_EXTENDED',
      resource: 'Subscription',
      resourceId: subscriptionId,
      details: {
        householdId: subscription.householdId,
        householdName: subscription.household.name,
        daysExtended: days,
        newTrialEnd: newTrialEnd.toISOString(),
      },
    });

    return {
      id: updated.id,
      householdId: updated.householdId,
      householdName: updated.household.name,
      plan: updated.plan,
      status: updated.status,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate?.toISOString(),
      trialEndsAt: updated.trialEndsAt?.toISOString(),
      amount: updated.amount,
      currency: updated.currency,
      billingCycle: updated.billingCycle,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async cancelSubscription(subscriptionId: string, reason?: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { household: { select: { name: true } } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === 'CANCELLED') {
      throw new BadRequestException('Subscription is already cancelled');
    }

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        endDate: new Date(),
      },
      include: { household: { select: { id: true, name: true } } },
    });

    // Log the cancellation
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'SUBSCRIPTION_CANCELLED',
      resource: 'Subscription',
      resourceId: subscriptionId,
      details: {
        householdId: subscription.householdId,
        householdName: subscription.household.name,
        reason,
      },
    });

    return {
      id: updated.id,
      householdId: updated.householdId,
      householdName: updated.household.name,
      plan: updated.plan,
      status: updated.status,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate?.toISOString(),
      trialEndsAt: updated.trialEndsAt?.toISOString(),
      amount: updated.amount,
      currency: updated.currency,
      billingCycle: updated.billingCycle,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  private getPlanAmount(plan: SubscriptionPlan): number {
    const amounts: Record<SubscriptionPlan, number> = {
      FREE: 0,
      BASIC: 9.99,
      PREMIUM: 19.99,
      ENTERPRISE: 49.99,
    };
    return amounts[plan];
  }

  // ============================================
  // SYSTEM SETTINGS (Super Admin)
  // ============================================

  async getSystemSettings() {
    // In a real app, these would be stored in a settings table
    // For now, return default values
    return {
      siteName: 'Household Hero',
      supportEmail: 'support@householdhero.com',
      defaultTrialDays: 14,
      maintenanceMode: false,
      registrationEnabled: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      emailNotificationsEnabled: true,
    };
  }

  async updateSystemSettings(settings: Partial<{
    siteName: string;
    supportEmail: string;
    defaultTrialDays: number;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    emailNotificationsEnabled: boolean;
  }>) {
    // In a real app, persist these to a settings table
    // For now, just return the settings as if they were saved
    // Log the settings change
    await this.createAuditLog({
      userId: 'SYSTEM',
      userEmail: 'system@householdhero.com',
      action: 'SETTINGS_UPDATE',
      resource: 'SystemSettings',
      details: { changes: settings },
    });

    return {
      siteName: settings.siteName || 'Household Hero',
      supportEmail: settings.supportEmail || 'support@householdhero.com',
      defaultTrialDays: settings.defaultTrialDays ?? 14,
      maintenanceMode: settings.maintenanceMode ?? false,
      registrationEnabled: settings.registrationEnabled ?? true,
      maxLoginAttempts: settings.maxLoginAttempts ?? 5,
      sessionTimeout: settings.sessionTimeout ?? 30,
      emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
    };
  }
}
