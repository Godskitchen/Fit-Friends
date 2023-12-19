import { FriendList, TrainerProfileInfo, UserInfo, UserList, UserProfileInfo } from 'src/types/user.type';
import { FriendListRdo, TrainerProfileRdo, UserListRdo, UserProfileRdo, UserRdo } from './api-rdos/user.rdo';
import { TrainingListRdo, TrainingRdo } from './api-rdos/training.rdo';
import { Training, TrainingCardType, TrainingList } from 'src/types/training.type';
import { Role, Location } from 'src/types/constants';
import { BalanceListRdo, BalanceRdo } from './api-rdos/balance.rdo';
import { OrderListRdo, OrderTrainingRdo } from './api-rdos/order.rdo';
import { OrderCardType, OrderList } from 'src/types/order.type';

export const adaptUserToClient = (rdo: UserRdo): UserInfo => ({
  userId: rdo.userId,
  name: rdo.name,
  email: rdo.email,
  aboutInfo: rdo.aboutInfo,
  gender: rdo.gender,
  location: Location[rdo.location],
  role: Role[rdo.role],
  birthday: rdo.birthDate,
  avatar: rdo.avatarUrl,
  createdAt: rdo.createdAt,
  backgroundImage: rdo.backgroundImage,
  userProfile: rdo.userProfile ? adaptUserProfileToClient(rdo.userProfile) : undefined,
  trainerProfile: rdo.trainerProfile ? adaptTrainerProfileToClient(rdo.trainerProfile) : undefined,
  isFriend: rdo.isFriend,
  trainingRequestsAsRecepient: rdo.trainingRequestsAsRecepient,
  trainingRequestsAsSender: rdo.trainingRequestsAsSender
});

export const adaptUserProfileToClient = (rdo: UserProfileRdo): UserProfileInfo => ({
  skillLevel: rdo.fitnessLevel,
  specialisations: rdo.trainingType,
  trainingDuration: rdo.trainingDuration,
  caloriesToBurn: rdo.caloriesToBurn,
  dailyCaloriesIntake: rdo.dailyCaloriesIntake,
  readyForWorkout: rdo.readyForWorkout,
});

export const adaptTrainerProfileToClient = (rdo: TrainerProfileRdo): TrainerProfileInfo => ({
  skillLevel: rdo.fitnessLevel,
  specialisations: rdo.trainingType,
  certificates: rdo.certificates,
  description: rdo.achievements,
  individualTraining: rdo.readyForWorkout,
});


export const adaptTrainingsListToClient = (rdo: TrainingListRdo): TrainingList => ({
  trainingList: rdo.trainingList.map((training) => adaptTrainingCardToClient(training)),
  totalTrainingsCount: rdo.totalTrainingsCount,
});


export const adaptTrainingCardToClient = (rdo: TrainingRdo): TrainingCardType => ({
  trainingId: rdo.trainingId,
  title: rdo.title,
  backgroundImage: rdo.backgroundImage,
  skillLevel: rdo.fitnessLevel,
  trainingDuration: rdo.trainingDuration,
  specialisation: rdo.trainingType,
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: rdo.gender,
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer
});

export const adaptTrainingToClient = (rdo: TrainingRdo): Training => ({
  trainingId: rdo.trainingId,
  title: rdo.title,
  backgroundImage: rdo.backgroundImage,
  skillLevel: rdo.fitnessLevel,
  trainingDuration: rdo.trainingDuration,
  specialisation: rdo.trainingType,
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: rdo.gender,
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer,
  trainer: adaptUserToClient(rdo.trainer),
  video: rdo.video
});

export const adaptUsersListToClient = (rdo: UserListRdo): UserList => ({
  userList: rdo.userList.map((user) => adaptUserToClient(user)),
  totalUsersCount: rdo.totalUsersCount
});


export const adaptFriendListToClient = (rdo: FriendListRdo): FriendList => ({
  friendList: rdo.friendList.map((friend) => adaptUserToClient(friend)),
  totalFriendsCount: rdo.totalFriendsCount
});

export const adaptTrainingAmountToClient = (rdo: BalanceRdo): number => rdo.remainingAmount;

export const adaptBalanceListToClient = (rdo: BalanceListRdo): TrainingList => ({
  trainingList: rdo.balanceList.map(({training}) => adaptTrainingCardToClient(training)),
  totalTrainingsCount: rdo.totalTrainingsCount
});

export const adaptOrderListToClient = (rdo: OrderListRdo): OrderList => ({
  orderList: rdo.orderList.map((order) => adaptOrderToClient(order)),
  totalOrdersCount: rdo.totalOrdersCount
});

export const adaptOrderToClient = (rdo: OrderTrainingRdo): OrderCardType => ({
  training: adaptTrainingCardToClient(rdo.training),
  sum: rdo.sum,
  trainingCount: rdo.trainingCount,
});
