export const UserErrors = {
  USER_NOT_FOUND: 'Пользователь с таким id не найден',
  INCORRECT_USER_ID_TYPE:
    'id пользователя должен быть целым положительным числом',
  MODIFY_USER_FORBIDDEN: 'Вы не можете изменять данный профиль пользователя',
  INCORRECT_USER_PROFILE_TYPE:
    'Некорректный тип обновляемого профиля для данной роли пользователя',
  FORBIDDEN_BY_ROLE: 'Недоступно для данной роли пользователя',
  FORBIDDEN_ADD_REMOVE_FRIEND_YOURSELF:
    'Вы не можете добавить или удалить себя из друзей.',
  NOT_FRIENDS: 'Вы не друзья с данным пользователем.',
  ALREADY_FRIENDS: 'Вы уже друзья с данным пользователем',
};
