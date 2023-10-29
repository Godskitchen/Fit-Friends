import { Expose } from 'class-transformer';

export class MessageRdo {
  @Expose()
  id: string;

  @Expose()
  text: string;
}
