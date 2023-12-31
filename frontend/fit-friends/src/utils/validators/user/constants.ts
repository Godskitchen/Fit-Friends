import { Gender, Role, Location } from 'src/types/constants';

export enum NAME_LENGTH {
  MIN = 1,
  MAX = 15,
}

export enum PASSWORD_LENGTH {
  MIN = 6,
  MAX = 12,
}

export enum ABOUT_INFO_LENGTH {
  MIN = 10,
  MAX = 140,
}

export enum CALORIES_TO_BURN {
  MIN = 1000,
  MAX = 5000,
}

export enum DAILY_CALORIES_INTAKE {
  MIN = 1000,
  MAX = 5000,
}

export enum ACHIEVEMENTS {
  MIN = 10,
  MAX = 140,
}

export enum TRAINING_TYPE_COUNT {
  MIN = 1,
  MAX = 3,
}

export const ImageFormats = ['jpeg', 'png'];
export const CertificateFormats = ['pdf'];
export const MAX_FILE_AVATAR_SIZE = 1048576;

export const NAME_PATTERN = `^[a-zA-Zа-яА-Я]{${NAME_LENGTH.MIN},${NAME_LENGTH.MAX}}$`;
export const EMAIL_PATTERN = '^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';


export const NAME_VALIDATION_MESSAGE = `Имя должно иметь длину от ${NAME_LENGTH.MIN} до ${NAME_LENGTH.MAX} символов русского/английского алфавита`;
export const EMAIL_VALIDATION_MESSAGE = 'Некорректный формат email';
export const PASSWORD_VALIDATION_MESSAGE = `Пароль должен иметь длину от ${PASSWORD_LENGTH.MIN} до ${PASSWORD_LENGTH.MAX} символов`;
export const IMAGE_FILE_VALIDATION_MESSAGE = 'Некорректный формат изображения';
export const INCORRECT_SIZE_MESSAGE = 'Размер изображения не должен превышать 1 MB';
export const GENDER_VALIDATION_MESSAGE = `Пол пользователя может принимать только следующие значения: ${Object.values(
  Gender,
).join(', ')}`;

export const ROLE_VALIDATION_MESSAGE = `Роль пользователя может принимать только следующие значения: ${Object.values(
  Role,
).join(', ')}`;

export const LOCATION_VALIDATION_MESSAGE = `Расположение пользователя может принимать только следующие значения: ${Object.values(
  Location,
).join(', ')}`;

export const ABOUT_INFO_VALIDATION_MESSAGE = `Описание должно иметь длину от ${ABOUT_INFO_LENGTH.MIN} до ${ABOUT_INFO_LENGTH.MAX} символов`;
export const BIRTH_DATE_VALIDATION_MESSAGE = 'Дата рождения должна иметь формат "YYYY-MM-DD" и не может быть больше текущей даты';
export const CALORIES_TO_BURN_VALIDATION_MESSAGE = `Калории должно быть целым числом от ${CALORIES_TO_BURN.MIN} до ${CALORIES_TO_BURN.MAX}`;
export const DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE = `Калории должно быть целым числом от ${DAILY_CALORIES_INTAKE.MIN} до ${DAILY_CALORIES_INTAKE.MAX}`;
export const ACHIEVEMENTS_VALIDATION_MESSAGE = `Описание тренерских заслуг должно иметь длину от ${ACHIEVEMENTS.MIN} до ${ACHIEVEMENTS.MAX} символов`;

export const TRAINING_TYPE_COUNT_VALIDATION_MESSAGE = `Укажите от ${TRAINING_TYPE_COUNT.MIN} до ${TRAINING_TYPE_COUNT.MAX} видов тренировок`;

export const CERTIFICATES_FORMAT_MESSAGE = 'Некорректный формат файла';

