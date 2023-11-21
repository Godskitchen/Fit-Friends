import { UserEntity, UserRepository } from '@libs/database-service';
import { AuthErrors, UserErrors } from '@libs/shared/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQuery } from './queries/user.query';
import { StaticService } from '@app/static';
import { BackgroundImageType } from '@libs/shared/app-types';
import { MessageService } from '@app/message';
import { FriendsQuery } from './queries/friends.query';
import { createFriendRequestMessage, hashPassword } from '@libs/shared/helpers';
import { NewProfileDto } from './dto/new-profile.dto';

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
      throw new ConflictException(AuthErrors.USER_ALREADY_EXISTS);
    }

    const { password, avatar, aboutInfo, ...restData } = dto;

    const userEntity = new UserEntity({
      ...restData,
      avatarUrl: avatar
        ? await this.staticService.getFile(avatar)
        : await this.staticService.getDefaulAvatarImage(),
      backgroundImage: await this.staticService.getDefaultBackgroundImage(
        BackgroundImageType.users,
      ),
      hashPassword: await hashPassword(password),
      aboutInfo: aboutInfo ?? '',
    });

    return this.userRepository.create(userEntity);
  }

  public async createUserProfile(id: number, dto: NewProfileDto) {
    const { trainerProfile, userProfile } = dto;

    return this.userRepository.createProfile(id, {
      ...userProfile,
      trainerProfile: trainerProfile
        ? {
            ...trainerProfile,
            certificates: await this.staticService.getFile(
              trainerProfile.certificates,
            ),
          }
        : undefined,
    });
  }

  public async getDetails(userId: number) {
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
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
}
