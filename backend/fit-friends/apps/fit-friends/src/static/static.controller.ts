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

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
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

  @Post('/upload/certificate')
  @UseInterceptors(FileInterceptor('certificate'))
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

  @Post('/upload/training-video')
  @UseGuards(JwtAccessGuard, RoleGuard)
  @Roles(Role.Trainer)
  @UseInterceptors(FileInterceptor('training-video'))
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
