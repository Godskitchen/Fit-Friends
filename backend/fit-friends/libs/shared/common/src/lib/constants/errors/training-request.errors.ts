export const TrainingRequestErrors = {
  INCORRECT_REQUEST_ID_TYPE:
    'id запроса на тренировку должно быть в формате UUID строки',
  TRAINING_REQUEST_NOT_FOUND: 'Запрос на тренировку не существует',
  MODIFY_REQUEST_FORBIDDEN: 'Вы не можете менять статус у данного запроса',
  INCORRECT_REQUEST_STATUS: 'Некорректный статус запроса',
  FORBIDDEN_REQUEST_TO_YOURSELF: 'Невозможно отправить запрос самому себе',
  PENDING_REQUEST_ALREADY_EXISTS:
    'У Вас уже есть активный запрос на тренировку данному пользователю',
  RECEPIENT_IS_NOT_READY: 'На данный момент получатель не готов к тренировкам.',
};
