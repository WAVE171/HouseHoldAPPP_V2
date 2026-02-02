import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

/**
 * Impersonation Service
 *
 * Allows Super Admins to temporarily act as another user for support purposes.
 * All impersonation sessions are logged for audit compliance.
 *
 * Key features:
 * - Time-limited sessions (30 minutes max)
 * - Full audit trail
 * - Clear indicator in JWT that user is impersonated
 */
@Injectable()
export class ImpersonationService {
  private readonly logger = new Logger(ImpersonationService.name);
  private readonly IMPERSONATION_DURATION_MINUTES = 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Start impersonating a user.
   * Returns a token that allows the Super Admin to act as the target user.
   */
  async startImpersonation(superAdminId: string, targetUserId: string) {
    // Verify the super admin exists and has SUPER_ADMIN role
    const superAdmin = await this.prisma.user.findUnique({
      where: { id: superAdminId },
      select: { id: true, email: true, role: true },
    });

    if (!superAdmin || superAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admins can impersonate users');
    }

    // Get the target user with their profile and household
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: {
          include: {
            household: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Cannot impersonate another Super Admin
    if (targetUser.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot impersonate other Super Admins');
    }

    // Create impersonation log entry
    const impersonationLog = await this.prisma.impersonationLog.create({
      data: {
        superAdminId,
        targetUserId,
        targetHouseholdId: targetUser.profile?.householdId,
      },
    });

    // Generate a special impersonation token
    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      householdId: targetUser.profile?.householdId,
      householdStatus: targetUser.profile?.household?.status || 'ACTIVE',
      // Special impersonation fields
      isImpersonating: true,
      impersonatedBy: superAdminId,
      impersonationLogId: impersonationLog.id,
    };

    const impersonationToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'fallback-secret',
      expiresIn: this.IMPERSONATION_DURATION_MINUTES * 60, // 30 minutes in seconds
    });

    this.logger.warn(
      `Impersonation started: Super Admin ${superAdmin.email} is impersonating ${targetUser.email}`,
    );

    return {
      impersonationToken,
      expiresIn: this.IMPERSONATION_DURATION_MINUTES * 60,
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        firstName: targetUser.profile?.firstName || '',
        lastName: targetUser.profile?.lastName || '',
        householdId: targetUser.profile?.householdId || undefined,
        householdName: targetUser.profile?.household?.name || undefined,
      },
      impersonationLogId: impersonationLog.id,
    };
  }

  /**
   * End an impersonation session.
   */
  async endImpersonation(impersonationLogId: string, superAdminId: string) {
    // Verify the impersonation log exists and belongs to this super admin
    const log = await this.prisma.impersonationLog.findUnique({
      where: { id: impersonationLogId },
    });

    if (!log) {
      throw new NotFoundException('Impersonation session not found');
    }

    if (log.superAdminId !== superAdminId) {
      throw new ForbiddenException('Cannot end another admin\'s impersonation session');
    }

    if (log.endedAt) {
      return { message: 'Impersonation session already ended' };
    }

    // Update the log to mark session as ended
    await this.prisma.impersonationLog.update({
      where: { id: impersonationLogId },
      data: {
        endedAt: new Date(),
      },
    });

    this.logger.warn(
      `Impersonation ended: Session ${impersonationLogId}`,
    );

    return { message: 'Impersonation session ended successfully' };
  }

  /**
   * Log an action performed during impersonation.
   */
  async logAction(impersonationLogId: string) {
    await this.prisma.impersonationLog.update({
      where: { id: impersonationLogId },
      data: {
        actionsCount: { increment: 1 },
      },
    });
  }

  /**
   * Get active impersonation sessions for a super admin.
   */
  async getActiveSessions(superAdminId: string) {
    const sessions = await this.prisma.impersonationLog.findMany({
      where: {
        superAdminId,
        endedAt: null,
        startedAt: {
          gte: new Date(Date.now() - this.IMPERSONATION_DURATION_MINUTES * 60 * 1000),
        },
      },
      include: {
        targetUser: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      targetUser: {
        id: session.targetUser.id,
        email: session.targetUser.email,
        role: session.targetUser.role,
        name: session.targetUser.profile
          ? `${session.targetUser.profile.firstName} ${session.targetUser.profile.lastName}`
          : session.targetUser.email,
      },
      startedAt: session.startedAt,
      actionsCount: session.actionsCount,
    }));
  }

  /**
   * Get impersonation history for audit purposes.
   */
  async getImpersonationHistory(query: {
    superAdminId?: string;
    targetUserId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: {
      superAdminId?: string;
      targetUserId?: string;
      startedAt?: { gte?: Date; lte?: Date };
    } = {};

    if (query.superAdminId) {
      where.superAdminId = query.superAdminId;
    }
    if (query.targetUserId) {
      where.targetUserId = query.targetUserId;
    }
    if (query.startDate || query.endDate) {
      where.startedAt = {};
      if (query.startDate) where.startedAt.gte = query.startDate;
      if (query.endDate) where.startedAt.lte = query.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.impersonationLog.findMany({
        where,
        include: {
          superAdmin: {
            select: {
              id: true,
              email: true,
            },
          },
          targetUser: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: query.limit || 50,
        skip: query.offset || 0,
      }),
      this.prisma.impersonationLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => ({
        id: log.id,
        superAdmin: {
          id: log.superAdmin.id,
          email: log.superAdmin.email,
        },
        targetUser: {
          id: log.targetUser.id,
          email: log.targetUser.email,
          name: log.targetUser.profile
            ? `${log.targetUser.profile.firstName} ${log.targetUser.profile.lastName}`
            : log.targetUser.email,
        },
        startedAt: log.startedAt,
        endedAt: log.endedAt,
        actionsCount: log.actionsCount,
        duration: log.endedAt
          ? Math.round((log.endedAt.getTime() - log.startedAt.getTime()) / 1000)
          : null,
      })),
      meta: {
        total,
        limit: query.limit || 50,
        offset: query.offset || 0,
      },
    };
  }
}
