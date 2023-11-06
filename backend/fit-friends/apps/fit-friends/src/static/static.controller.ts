import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StaticService } from './static.service';
import {
  FieldNames,
  MAX_FILE_AVATAR_SIZE,
  SubDirs,
  certificateExtensions,
  imageExtensions,
  videoExtensions,
} from './dto/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidator } from './validators/file-type-validator';
import { JwtAccessGuard, RoleGuard } from '@libs/shared/guards';
import { Roles } from '@libs/shared/common';
import { Role } from '@libs/shared/app-types';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AvatarDTO, CertificateDTO, TrainingVideoDTO } from './dto/static.dto';

@ApiTags('static')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @ApiCreatedResponse({
    description:
      'Изображение успешно загружено. Возвращен статический путь для его скачивания',
    type: String,
  })
  @ApiBadRequestResponse({
    description: `Некорректный формат изображения, доступные форматы: ${imageExtensions.join(
      ',',
    )}. Превышен допустимый размер аватара - 1MB. Параметр fieldName у input должен быть равен ${
      FieldNames.AVATAR
    }`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Изображение аватара', type: AvatarDTO })
  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor(FieldNames.AVATAR))
  public async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            maxSize: MAX_FILE_AVATAR_SIZE,
            extensions: imageExtensions,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const avatarPath = await this.staticService.uploadFile(
      file,
      SubDirs.Avatars,
    );
    return avatarPath;
  }

  @ApiCreatedResponse({
    description:
      'Сертификат успешно загружен. Возвращен статический путь для его скачивания',
    type: String,
  })
  @ApiBadRequestResponse({
    description: `Некорректный формат сертификата, доступные форматы: ${certificateExtensions.join(
      ',',
    )}. Параметр fieldName у input должен быть равен ${FieldNames.CERTIFICATE}`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Файл сертификата', type: CertificateDTO })
  @Post('/upload/certificate')
  @UseInterceptors(FileInterceptor(FieldNames.CERTIFICATE))
  public async uploadCertificate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            extensions: certificateExtensions,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const certificatePath = await this.staticService.uploadFile(
      file,
      SubDirs.Certificates,
    );
    return certificatePath;
  }

  @ApiCreatedResponse({
    description:
      'Видео тренировки успешно загружено. Возвращен статический путь для его скачивания',
    type: String,
  })
  @ApiBadRequestResponse({
    description: `Некорректный формат видео, доступные форматы: ${videoExtensions.join(
      ',',
    )}. Параметр fieldName у input должен быть равен ${
      FieldNames.TRAINING_VIDEO
    }`,
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь неавторизован',
  })
  @ApiForbiddenResponse({
    description: 'Загружать тренировки могут только "тренера"',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Видео тренировки', type: TrainingVideoDTO })
  @Post('/upload/training-video')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Roles(Role.Trainer)
  @UseInterceptors(FileInterceptor(FieldNames.TRAINING_VIDEO))
  public async uploadTrainingVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            extensions: videoExtensions,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const videoPath = await this.staticService.uploadFile(
      file,
      SubDirs.TrainingVideos,
    );
    return videoPath;
  }
}
