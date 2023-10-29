import { FileData } from '@libs/shared/app-types';

export class FileDataEntity implements FileData {
  fileName: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;

  constructor(fileData: FileData) {
    this.fileName = fileData.fileName;
    this.originalName = fileData.originalName;
    this.path = fileData.path;
    this.size = fileData.size;
    this.mimetype = fileData.mimetype;
  }

  toObject() {
    return {
      fileName: this.fileName,
      originalName: this.originalName,
      path: this.path,
      size: this.size,
      mimetype: this.mimetype,
    };
  }
}
