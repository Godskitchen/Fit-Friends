import { FileDataEntity, FileDataRepository } from '@libs/database-service';
import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ensureDir, readdir, writeFile } from 'fs-extra';
import { FILENAME_PATTERN } from './dto/constants';
import { getRandomArrItem } from '@libs/shared/helpers';
import { BackgroundImageType } from '@libs/shared/app-types';

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
    const fileNamesplit = file.originalname.split('.');
    const fileExtension = fileNamesplit[fileNamesplit.length - 1];
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
    const writedFile = await this.writeFile(file, subDirectory);
    const fileData = new FileDataEntity({
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: writedFile.path,
      fileName: writedFile.fileName,
    });

    await this.getDefaultBackgroundImage('trainings');

    const newFile = await this.fileDataRepository.create(fileData);
    return this.getFullStaticPath(newFile.path);
  }

  public async getFile(filePath: string) {
    const match = filePath.match(FILENAME_PATTERN);
    if (!match) {
      return undefined;
    }
    const fileName = match[0];
    const fileData = await this.fileDataRepository.findByFileName(fileName);
    if (!fileData) {
      return undefined;
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
    const uploadRootDir = this.configService.getOrThrow<string>(
      'static.uploadDirectory',
    );

    const defaultDir = `/default/${type}`;

    const images = await readdir(`${uploadRootDir}${defaultDir}`);
    return this.getFullStaticPath(`${defaultDir}/${getRandomArrItem(images)}`);
  }

  public async getDefaulAvatarImage() {
    const defaultAvatarLocalPath = `/default/users/avatar.png`;
    return this.getFullStaticPath(defaultAvatarLocalPath);
  }
}
