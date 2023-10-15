import { UserRepository } from '@libs/database-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getDetails(id: number) {
    return this.userRepository.findById(id);
  }
}
