import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigDbModule } from '@libs/config-service';

@Module({
  imports: [ConfigDbModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
