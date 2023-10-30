import { TrainingRequest, TrainingRequestStatus } from '@libs/shared/app-types';

export const createNewRequestMessage = ({ id, recepientId }: TrainingRequest) =>
  `Заявка ${id} на тренировку успешно отправлена пользователю id ${recepientId}`;

export const createUpdateStatusMessage = ({
  status,
  senderId,
}: TrainingRequest) =>
  `Вы ${
    status === TrainingRequestStatus.Accepted ? 'приняли' : 'отклонили'
  } заявку на тренировку от пользователя id ${senderId}`;
