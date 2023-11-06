import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenRdo {
  @ApiProperty({ example: 'newAccessToken' })
  accessToken: string;
}
