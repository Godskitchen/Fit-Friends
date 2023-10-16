import { RefreshTokenData } from '@libs/shared/app-types';

export class RefreshTokenDataEntity implements RefreshTokenData {
  tokenId: string;
  userId: string;
  expiresIn: Date;

  constructor(data: RefreshTokenData) {
    this.tokenId = data.tokenId;
    this.userId = data.userId;
    this.expiresIn = data.expiresIn;
  }

  toObject() {
    return {
      tokenId: this.tokenId,
      userId: this.userId,
      expiresIn: this.expiresIn,
    };
  }
}
