import { UserRdo } from '@app/user';
import {
  FitnessLevel,
  Gender,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TrainingRdo {
  @ApiProperty({ example: 1 })
  @Expose()
  trainingId: number;

  @ApiProperty({ example: 'Energy' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'static/path/to/background/image.png' })
  @Expose()
  backgroundImage: string;

  @ApiProperty({ enum: FitnessLevel, example: FitnessLevel.Amateur })
  @Expose()
  fitnessLevel: FitnessLevel;

  @ApiProperty({
    enum: TrainingDuration,
    example: TrainingDuration.FiftyToEightyMinutes,
  })
  @Expose()
  trainingDuration: TrainingDuration;

  @ApiProperty({
    enum: TrainingType,
    example: TrainingType.Boxing,
  })
  @Expose()
  trainingType: TrainingType;

  @ApiProperty({ example: 500 })
  @Expose()
  price: number;

  @ApiProperty({ example: 1000 })
  @Expose()
  caloriesToBurn: number;

  @ApiProperty({
    example: 'Очень эффективная тренировка для проработки всех частей тела',
  })
  @Expose()
  description: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.Female,
  })
  @Expose()
  gender: Gender;

  @ApiProperty({
    description:
      'Рейтинг тренировки, рассчитывается автоматически на основании оставленных отзывов. По умолчанию 0',
  })
  @Expose()
  rating: number;

  @ApiProperty({
    example: 'static/path/to/video.mov',
  })
  @Expose()
  video: string;

  @ApiProperty({ type: UserRdo })
  @Expose()
  @Type(() => UserRdo)
  trainer: UserRdo;

  @ApiProperty({ example: false })
  @Expose()
  isSpecialOffer: boolean;
}
