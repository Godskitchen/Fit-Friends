import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import {
  DatabaseModule,
  TrainingRepository,
  UserRepository,
} from '@libs/database-service';
import { StaticModule } from '@app/static';

@Module({
  imports: [DatabaseModule, StaticModule],
  providers: [TrainingService, TrainingRepository, UserRepository],
  controllers: [TrainingController],
  exports: [],
})
export class TrainingModule {}
