import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageRdo {
  @ApiProperty({ example: '123' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Текст сообщения' })
  @Expose()
  text: string;

  @ApiProperty({ example: 'Дата создания сообщения' })
  @Expose()
  createdAt: string;
}
