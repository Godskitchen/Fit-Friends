import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { FileData } from '@libs/shared/app-types';
import { FileDataEntity } from '../entities/file-data.entity';

@Injectable()
export class FileDataRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: FileDataEntity): Promise<FileData> {
    const data = item.toObject();
    return this.prismaConnector.fileData.create({ data });
  }

  public async findByFileName(fileName: string): Promise<FileData | null> {
    return this.prismaConnector.fileData.findUnique({
      where: { fileName },
    });
  }
}
