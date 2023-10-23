import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

@Module({
  imports: [],
  providers: [TrainingService],
  controllers: [TrainingController],
  exports: [],
})
export class TrainingModule {}
