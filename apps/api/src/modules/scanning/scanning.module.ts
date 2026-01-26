import { Module } from '@nestjs/common';
import { ScanningController } from './scanning.controller';
import { ScanningService } from './scanning.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ScanningController],
  providers: [ScanningService],
  exports: [ScanningService],
})
export class ScanningModule {}
