import { UserBalance } from '@libs/shared/app-types';

export class UserBalanceEntity implements Omit<UserBalance, 'balanceId'> {
  userId: number;
  trainingId: number;
  remainingAmount: number;

  constructor(balance: Omit<UserBalance, 'balanceId'>) {
    this.userId = balance.userId;
    this.trainingId = balance.trainingId;
    this.remainingAmount = balance.remainingAmount;
  }

  toObject() {
    return {
      userId: this.userId,
      trainingId: this.trainingId,
      remainingAmount: this.remainingAmount,
    };
  }
}
