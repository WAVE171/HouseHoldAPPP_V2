import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto, RegisterDto, TokenResponseDto, UserResponseDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      return null;
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          lockedUntil:
            user.failedLoginAttempts >= 4
              ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
              : null,
        },
      });
      return null;
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    return user;
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user, profile, and optionally household in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create household if name provided (or create default)
      const household = await tx.household.create({
        data: {
          name: registerDto.householdName || `${registerDto.firstName}'s Household`,
          creator: {
            create: {
              email: registerDto.email,
              password: hashedPassword,
              role: (registerDto.role as Role) || Role.ADMIN,
            },
          },
        },
        include: {
          creator: true,
        },
      });

      // Create user profile linked to household
      const profile = await tx.userProfile.create({
        data: {
          userId: household.creatorId,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          householdId: household.id,
        },
        include: {
          user: true,
          household: true,
        },
      });

      return {
        user: profile.user,
        profile,
        household,
      };
    });

    this.logger.log(`New user registered: ${result.user.email}`);

    return this.generateTokens({
      ...result.user,
      profile: result.profile,
    });
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
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

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    // In a more complete implementation, we would invalidate the refresh token
    // For now, we just log the logout
    this.logger.log(`User logged out: ${userId}`);
    return { success: true };
  }

  private generateTokens(user: {
    id: string;
    email: string;
    role: Role;
    profile?: {
      firstName: string;
      lastName: string;
      avatar?: string | null;
      householdId?: string | null;
      household?: { name: string; status?: string } | null;
    } | null;
  }): TokenResponseDto {
    const householdStatus = user.profile?.household?.status || 'ACTIVE';

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      householdId: user.profile?.householdId,
      householdStatus: householdStatus,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'fallback-secret',
      expiresIn: 900, // 15 minutes in seconds
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'fallback-refresh-secret',
        expiresIn: 604800, // 7 days in seconds
      },
    );

    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      avatar: user.profile?.avatar || undefined,
      householdId: user.profile?.householdId || undefined,
      householdName: user.profile?.household?.name || undefined,
      householdStatus: householdStatus,
    };

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: userResponse,
    };
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Find user by email - don't reveal if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Generate secure random token
      const rawToken = crypto.randomBytes(32).toString('hex');

      // Hash token before storing
      const hashedToken = await bcrypt.hash(rawToken, 10);

      // Set expiration (1 hour from now)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Save to database
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpiresAt: expiresAt,
        },
      });

      // Log reset link to console (development mode)
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

      console.log('\n========================================');
      console.log('PASSWORD RESET REQUEST');
      console.log('========================================');
      console.log(`Email: ${email}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log(`Token expires: ${expiresAt.toISOString()}`);
      console.log('========================================\n');

      this.logger.log(`Password reset requested for: ${email}`);
    }

    // Always return generic message - don't reveal if user exists
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password, confirmPassword } = resetPasswordDto;

    // Validate passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find users with non-expired reset tokens
    const users = await this.prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    // Find the user with the matching token
    let matchedUser: typeof users[number] | null = null;
    for (const user of users) {
      if (user.passwordResetToken) {
        const isValidToken = await bcrypt.compare(token, user.passwordResetToken);
        if (isValidToken) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    this.logger.log(`Password reset successful for: ${matchedUser.email}`);

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
  }
}
