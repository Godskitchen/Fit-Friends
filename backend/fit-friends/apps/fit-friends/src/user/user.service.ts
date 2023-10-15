import { UserRepository } from '@libs/database-service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getDetails(id: number) {
    const existUser = await this.userRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException();
    }

    return existUser;
  }
}
