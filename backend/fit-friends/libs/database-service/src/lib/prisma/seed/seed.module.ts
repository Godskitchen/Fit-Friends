import { AppConfigsModule } from '@libs/config-service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigsModule],
})
export class SeedModule {}
