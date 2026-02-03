import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ImpersonationService } from './impersonation.service';
import { DatabaseModule } from '../../database/database.module';
import { PlanLimitsService } from '../../common/services/plan-limits.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, ImpersonationService, PlanLimitsService],
  exports: [AdminService, ImpersonationService, PlanLimitsService],
})
export class AdminModule {}
