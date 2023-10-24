import { Transform, Type } from 'class-transformer';
import { IsPositive, IsInt, IsOptional, IsEnum } from 'class-validator';
import { MAX_USERS_LIMIT } from './query.constants';
import {
  FitnessLevel,
  Location,
  Role,
  TrainingType,
} from '@libs/shared/app-types';

export class UserQuery {
  @Transform(({ value }) =>
    +value && +value < MAX_USERS_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_USERS_LIMIT,
  )
  @IsInt()
  @IsOptional()
  public limit: number = MAX_USERS_LIMIT;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @IsEnum(Location, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public location?: Location[];

  @IsEnum(FitnessLevel, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public fitnessLevel?: FitnessLevel[];

  @IsEnum(TrainingType, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public trainingType?: TrainingType[];

  @IsEnum(Role)
  @IsOptional()
  public sort?: Role;
}