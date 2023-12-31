import { FileDataEntity, FileDataRepository } from '@libs/database-service';
import * as crypto from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ensureDir, readdir, writeFile } from 'fs-extra';
import { FILENAME_PATTERN } from './dto/constants';
import { getRandomArrItem } from '@libs/shared/helpers';
import { BackgroundImageType } from '@libs/shared/app-types';
import { StaticErrors } from '@libs/shared/common';
import {
  DEFAULT_AVATAR_LOCAL_PATH,
  DEFAULT_FILES_ROOT_PATH,
} from './static.constants';

type WritedFile = {
  fileName: string;
  fileExtension?: string;
  subDirectory: string;
  path: string;
};

@Injectable()
export class StaticService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileDataRepository: FileDataRepository,
  ) {}

  private async writeFile(
    file: Express.Multer.File,
    subDirectory: string,
  ): Promise<WritedFile> {
    const uploadRootDir = this.configService.getOrThrow<string>(
      'static.uploadDirectory',
    );

    const fileUUID = crypto.randomUUID();
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${fileUUID}.${fileExtension}`;

    const uploadPath = `${uploadRootDir}/${subDirectory}`;
    const destinationFile = `${uploadPath}/${fileName}`;

    await ensureDir(uploadPath);
    await writeFile(destinationFile, file.buffer).catch((err) => {
      throw new Error(
        `[Static service]: Can't upload ${file.originalname} cause: ${err}`,
      );
    });

    return {
      fileName,
      fileExtension,
      subDirectory,
      path: `${subDirectory}/${fileName}`,
    };
  }

  public async uploadFile(file: Express.Multer.File, subDirectory: string) {
    const fileHash = this.getFileHash(file);
    const existFile = await this.fileDataRepository.findByHash(fileHash);
    if (existFile) {
      return this.getFullStaticPath(existFile.path);
    }
    const writedFile = await this.writeFile(file, subDirectory);
    const fileData = new FileDataEntity({
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: writedFile.path,
      fileName: writedFile.fileName,
      hash: fileHash,
    });

    const newFile = await this.fileDataRepository.create(fileData);
    return this.getFullStaticPath(newFile.path);
  }

  public async getFile(filePath: string) {
    const match = filePath.match(FILENAME_PATTERN);
    if (!match) {
      throw new BadRequestException(StaticErrors.FILE_NOT_EXIST);
    }
    const fileName = match[0];
    const fileData = await this.fileDataRepository.findByFileName(fileName);
    if (!fileData) {
      throw new BadRequestException(StaticErrors.FILE_NOT_EXIST);
    }
    return this.getFullStaticPath(fileData.path);
  }

  public getFullStaticPath(localPath: string) {
    const host = this.configService.getOrThrow<string>('application.host');
    const port = this.configService.getOrThrow<string>('application.port');
    const serveRoot = this.configService.getOrThrow<string>('static.serveRoot');

    return `http://${host}:${port}${serveRoot}${localPath}`;
  }

  public async getDefaultBackgroundImage(
    type: keyof typeof BackgroundImageType,
  ) {
    const backsDir = `${DEFAULT_FILES_ROOT_PATH}/${type}/backs`;

    const images = await readdir(backsDir);
    return this.getFullStaticPath(`/${type}/backs/${getRandomArrItem(images)}`);
  }

  public async getDefaulAvatarImage() {
    return this.getFullStaticPath(DEFAULT_AVATAR_LOCAL_PATH);
  }

  private getFileHash(file: Express.Multer.File): string {
    return crypto.createHash('md5').update(file.buffer).digest('hex');
  }
}
