import { UserRepository } from '@libs/database-service';
import { USER_NOT_FOUND } from '@libs/shared/common';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getDetails(userId: number) {
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return existUser;
  }
}
