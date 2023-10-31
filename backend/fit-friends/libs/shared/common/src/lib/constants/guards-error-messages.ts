export const REGISTRATION_FORBIDDEN =
  'Регистрация доступна только для новых клиентов';

export const MODIFY_USER_FORBIDDEN =
  'Вы не можете изменять данный профиль пользователя';

export const INCORRECT_USER_PROFILE_TYPE =
  'Некорректный тип обновляемого профиля для данной роли пользователя';

export const FORBIDDEN_BY_ROLE = 'Недоступно для данной роли пользователя';

export const INCORRECT_TRAINING_OWNER =
  'Данный тренер не может изменять данную тренировку';

export const FORBIDDEN_ADD_FRIEND_YOURSELF =
  'Вы не можете добавить себя в друзья.';
export const FORBIDDEN_REMOVE_FRIEND_YOURSELF =
  'Вы не можете удалить себя из друзей.';

export const NOT_FRIENDS = 'Вы не друзья с данным пользователем.';
export const ALREADY_FRIENDS = 'Вы уже друзья с данным пользователем';

export const BALANCE_NOT_FOUND = 'Баланс данной тренировки не существует';
export const BALANCE_ALREADY_EXISTS = 'Баланс данной тренировки уже существует';

export const MODIFY_BALANCE_FORBIDDEN = 'Вы не можете изменять данный баланс';
export const INCORRECT_BALANCE_ID_TYPE = 'id баланса должен быть UUID строкой';
export const INCORRECT_TRAINING_ID_TYPE =
  'id тренировки должно быть целым положительным числом';

export const INCORRECT_USER_ID_TYPE =
  'id пользователя должно быть целым положительным числом';

export const MESSAGE_NOT_FOUND = 'Оповещение с таким id не найдено';
export const MODIFY_MESSAGE_FORBIDDEN =
  'Вы не можете изменять или удалять данное оповещение';

export const INCORRECT_REQUEST_ID_TYPE =
  'id запроса на тренировку должно быть в формате UUID строки';

export const TRAINING_REQUEST_NOT_FOUND = 'Запрос на тренировку не существует';
export const MODIFY_REQUEST_FORBIDDEN =
  'Вы не можете менять статус у данного запроса';
export const INCORRECT_REQUEST_STATUS = 'Некорректный статус запроса';

export const FORBIDDEN_REQUEST_TO_YOURSELF =
  'Невозможно отправить запрос самому себе';

export const PENDING_REQUEST_ALREADY_EXISTS =
  'У Вас уже есть активный запрос на тренировку данному пользователю';

export const RECEPIENT_IS_NOT_READY =
  'На данный момент получатель не готов к тренировкам.';

export const REPLY_ALREADY_EXISTS = 'Вы уже оставляли отзыв к этой тренировке';
export const CREATE_REPLY_FORBIDDEN =
  'Вы не можете оставить отзыв к этой тренировке, так как еще не приобретали ее';
