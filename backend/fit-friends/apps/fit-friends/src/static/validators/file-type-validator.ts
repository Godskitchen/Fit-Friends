import { BadRequestException, FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import {
  EXTENSION_PATTERN,
  INCORRECT_FILE_DATA,
  INCORRECT_SIZE_MESSAGE,
  getIncorrectFormatMessage,
} from '../dto/constants';

type validationOptions = {
  maxSize?: number;
  extensions: string[];
};

export class FileTypeValidator extends FileValidator<validationOptions> {
  constructor({ maxSize, extensions }: validationOptions) {
    super({ maxSize, extensions });
  }
  async isValid(file: Express.Multer.File): Promise<boolean> {
    if (
      this.validationOptions.maxSize &&
      file.size > this.validationOptions.maxSize
    ) {
      throw new BadRequestException(INCORRECT_SIZE_MESSAGE);
    }

    const fileInfo = await fromBuffer(file.buffer);
    if (!fileInfo) {
      return false;
    }

    const extension = file.originalname.match(EXTENSION_PATTERN);
    if (
      !extension ||
      !this.validationOptions.extensions.includes(fileInfo.ext)
    ) {
      throw new BadRequestException(
        getIncorrectFormatMessage(this.validationOptions.extensions),
      );
    }

    return true;
  }

  buildErrorMessage(_file: Express.Multer.File): string {
    throw new BadRequestException(INCORRECT_FILE_DATA);
  }
}
