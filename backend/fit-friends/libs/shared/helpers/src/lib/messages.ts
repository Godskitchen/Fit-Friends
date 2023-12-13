import { Role, TrainingRequestStatus } from '@libs/shared/app-types';

export const createaddFriendMessage = (userName: string) =>
  `Пользователь ${userName} добавил вас в друзья`;

export const createRemoveFriendMessage = (userName: string) =>
  `Пользователь ${userName} удалил вас из друзей`;

export const createTrainingRequestMessage = (userName: string) =>
  `Пользователь ${userName} отправил Вам приглашение на тренировку`;

export const createAnsweredTrainingRequestMessage = (
  senderName: string,
  senderRole: Role,
  status: TrainingRequestStatus,
) =>
  `Пользователь ${senderName} ${
    status === TrainingRequestStatus.Accepted ? 'принял' : 'отклонил'
  } приглашение на ${
    senderRole === Role.Trainer ? 'персональную' : 'совместную'
  } тренировку`;

export const createAddSubscriptionMessage = (trainerId: number) =>
  `Вы успешно подписались на тренера ${trainerId}`;

export const createRemoveSubscriptionMessage = (trainerId: number) =>
  `Вы успешно отписались от тренера ${trainerId}`;
