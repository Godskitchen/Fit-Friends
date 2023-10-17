import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { DatabaseModule, RefreshTokenRepository } from '@libs/database-service';
import { AppConfigsModule } from '@libs/config-service';

@Module({
  imports: [AppConfigsModule, DatabaseModule],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
