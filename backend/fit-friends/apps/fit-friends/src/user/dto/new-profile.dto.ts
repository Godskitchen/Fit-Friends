import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { TrainerProfileDto } from './trainer-profile.dto';
import { UserProfileDto } from './user-profile.dto';

export class NewProfileDto {
  @ApiPropertyOptional({
    description: `Опросник для пользователя. Свойство допускается только для пользователя с ролью ${Role.User}`,
    type: UserProfileDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => UserProfileDto)
  @IsOptional()
  userProfile?: UserProfileDto;

  @ApiPropertyOptional({
    description: `Опросник для тренера. Свойство допускается только для пользователя с ролью ${Role.Trainer}`,
    type: TrainerProfileDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => TrainerProfileDto)
  @IsOptional()
  trainerProfile?: TrainerProfileDto;
}
