import { ApiProperty } from '@nestjs/swagger';
import { FieldNames } from './constants';

export class AvatarDTO {
  @ApiProperty({ type: 'string', format: 'binary', name: FieldNames.AVATAR })
  file: string;
}

export class CertificateDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: FieldNames.CERTIFICATE,
  })
  file: string;
}

export class TrainingVideoDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    name: FieldNames.TRAINING_VIDEO,
  })
  file: string;
}
