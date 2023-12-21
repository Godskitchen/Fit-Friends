import {
  FitnessLevel,
  MAX_ITEMS_LIMIT,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class SpecialTrainingQuery {
  @ApiProperty({
    description: 'Количество тренировок, по которым нужно получить информацию.',
    default: MAX_ITEMS_LIMIT,
    maximum: MAX_ITEMS_LIMIT,
  })
  @Transform(({ value }) =>
    +value && +value < MAX_ITEMS_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_ITEMS_LIMIT,
  )
  @IsInt()
  public limit: number = MAX_ITEMS_LIMIT;

  @ApiProperty({
    description: `Фильтр тренировок по типу. Значения передаются через ",". Доступные варианты ${Object.values(
      TrainingType,
    ).join(',')}`,
    type: String,
    example: `${TrainingType.Aerobics},${TrainingType.Boxing}`,
  })
  @IsEnum(TrainingType, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  public trainingType: TrainingType[];

  @ApiProperty({
    description: `Фильтр тренировок по длительности. Доступные варианты ${Object.values(
      TrainingDuration,
    ).join(',')}`,
    type: String,
    example: `${TrainingDuration.EightyToOneHundredMinutes}`,
  })
  @IsEnum(TrainingDuration)
  public trainingDuration: TrainingDuration;

  @ApiProperty({
    description: `Фильтр по уровню фитнес-подготовки пользователя. Доступные варианты: ${Object.values(
      FitnessLevel,
    )}.`,
    type: String,
    example: `${FitnessLevel.Pro}`,
  })
  @IsEnum(FitnessLevel)
  public fitnessLevel: FitnessLevel;
}
