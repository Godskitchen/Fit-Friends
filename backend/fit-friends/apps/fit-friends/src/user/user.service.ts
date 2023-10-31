import { UserEntity, UserRepository } from '@libs/database-service';
import {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  createFriendRequestMessage,
} from '@libs/shared/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';
import { genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from '@app/auth';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQuery } from './queries/user.query';
import { StaticService } from '@app/static';
import { BackgroundImageType } from '@libs/shared/app-types';
import { MessageService } from '@app/message';
import { FriendsQuery } from './queries/friends.query';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly staticService: StaticService,
    private readonly messageService: MessageService,
  ) {}

  public async create(dto: NewUserDto) {
    const existUser = await this.userRepository.findByEmail(dto.email);

    if (existUser) {
      throw new ConflictException(USER_ALREADY_EXISTS);
    }

    const { password, userProfile, trainerProfile, avatar, ...restData } = dto;

    let certificatePath = '';
    if (trainerProfile?.certificates) {
      const { certificates } = trainerProfile;
      certificatePath = (await this.staticService.getFile(certificates)) ?? '';
    }

    const userEntity = new UserEntity({
      ...restData,
      avatarUrl: avatar ? await this.staticService.getFile(avatar) : undefined,
      backgroundImage: await this.staticService.getDefaultBackgroundImage(
        BackgroundImageType.users,
      ),
      hashPassword: await this.setPassword(password),
      userProfile,
      trainerProfile: trainerProfile
        ? { ...trainerProfile, certificates: certificatePath }
        : undefined,
    });

    return this.userRepository.create(userEntity);
  }

  public async getDetails(userId: number) {
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return existUser;
  }

  public async getByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  public async updateData(id: number, dto: UpdateUserDto) {
    const { avatar, trainerProfile, ...restData } = dto;

    let certificatePath: string | undefined;
    if (trainerProfile?.certificates) {
      const { certificates } = trainerProfile;
      certificatePath = await this.staticService.getFile(certificates);
    }

    return this.userRepository.update(id, {
      ...restData,
      avatarUrl: avatar ? await this.staticService.getFile(avatar) : undefined,
      trainerProfile: trainerProfile
        ? { ...trainerProfile, certificates: certificatePath }
        : undefined,
    });
  }

  public async getMany(userQuery: UserQuery) {
    return this.userRepository.find(userQuery);
  }

  public async addFriend(userId: number, userName: string, friendId: number) {
    await this.userRepository.addFriend(userId, friendId);

    await this.messageService.createMessage({
      recepientId: friendId,
      text: createFriendRequestMessage(userName),
    });
  }

  public async removeFriend(userId: number, friendId: number) {
    await this.userRepository.removeFriend(userId, friendId);
  }

  public async getFriendList(userId: number, query: FriendsQuery) {
    return this.userRepository.getFriends(userId, query);
  }

  private async setPassword(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }
}
