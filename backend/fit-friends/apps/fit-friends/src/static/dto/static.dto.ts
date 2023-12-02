import { ApiProperty } from '@nestjs/swagger';
import { FieldNames } from './constants';

export class AvatarDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: FieldNames.AVATAR,
  })
  file: string;
}

export class CertificateDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: FieldNames.CERTIFICATE,
  })
  file: string;
}

export class TrainingVideoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: FieldNames.TRAINING_VIDEO,
  })
  file: string;
}
