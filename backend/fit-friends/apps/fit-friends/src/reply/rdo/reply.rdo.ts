import { UserRdo } from '@app/user';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ReplyRdo {
  @ApiProperty({ description: 'id отзыва', example: 4 })
  @Expose()
  replyId: number;

  @ApiProperty({ example: 'Очень хорошая тренировка, стоит своих денег' })
  @Expose()
  text: string;

  @ApiProperty({
    description: 'Дата создания отзыва',
    example: new Date().toISOString(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Автор отзыва', type: UserRdo })
  @Expose()
  @Type(() => UserRdo)
  author: UserRdo;
}
