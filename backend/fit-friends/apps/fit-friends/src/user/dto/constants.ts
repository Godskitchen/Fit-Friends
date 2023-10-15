import {
  FitnessLevel,
  Gender,
  Location,
  Role,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';

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

export const MAX_DATE_STRING_LENGTH = 10;
export enum TRAINING_TYPE_COUNT {
  MIN = 1,
  MAX = 3,
}

export const ImageFormats = ['jpg', 'png'];

export const NAME_PATTERN = RegExp(
  `^[a-zA-Zа-яА-Я]{${NAME_LENGTH.MIN},${NAME_LENGTH.MAX}}$`,
);

export const IMAGE_FILE_NAME_PATTERN = RegExp(
  `\.(${ImageFormats.join('|')})$`,
  'i',
);

export const CERTIFICATES_FILE_NAME_PATTERN = RegExp(`\.pdf$`, 'i');

export const NAME_VALIDATION_MESSAGE = `$property: Имя должно иметь длину от ${NAME_LENGTH.MIN} до ${NAME_LENGTH.MAX} символов русского/английского алфавита`;
export const EMAIL_VALIDATION_MESSAGE =
  '$property: Должен быть валидный email пользователя';
export const PASSWORD_VALIDATION_MESSAGE = `$property: Пароль должен иметь длину от ${PASSWORD_LENGTH.MIN} до ${PASSWORD_LENGTH.MAX}`;
export const IMAGE_FILE_VALIDATION_MESSAGE = `$property: Изображения должны иметь один из следующих форматов: ${ImageFormats.join(
  ', ',
)}`;
export const GENDER_VALIDATION_MESSAGE = `$property: Пол пользователя может принимать только следующие значения: ${Object.values(
  Gender,
).join(', ')}`;

export const ROLE_VALIDATION_MESSAGE = `$property: Роль пользователя может принимать только следующие значения: ${Object.values(
  Role,
).join(', ')}`;

export const LOCATION_VALIDATION_MESSAGE = `$property: Расположение пользователя может принимать только следующие значения: ${Object.values(
  Location,
).join(', ')}`;

export const ABOUT_INFO_VALIDATION_MESSAGE = `$property: Описание должно иметь длину от ${ABOUT_INFO_LENGTH.MIN} до ${ABOUT_INFO_LENGTH.MAX} символов`;
export const BIRTH_DATE_VALIDATION_MESSAGE = `$property: Дата рождения должна иметь формат 'YYYY-MM-DD' и не может быть больше текущей даты`;
export const CALORIES_TO_BURN_VALIDATION_MESSAGE = `$property: Количество калорий для сброса должно быть целым числом от ${CALORIES_TO_BURN.MIN} до ${CALORIES_TO_BURN.MAX}`;
export const DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE = `$property: Количество ежедневно затрачиваемых калорий должно быть целым числом от ${DAILY_CALORIES_INTAKE.MIN} до ${DAILY_CALORIES_INTAKE.MAX}`;
export const ACHIEVEMENTS_VALIDATION_MESSAGE = `$property: Описание тренерских заслуг должно иметь длину от ${ACHIEVEMENTS.MIN} до ${ACHIEVEMENTS.MAX} символов`;
export const FITNESS_LEVEL_VALIDATION_MESSAGE = `$property: Уровень подготовки может принимать только следующие значения: ${Object.values(
  FitnessLevel,
).join(', ')}`;

export const TRAINING_TYPE_COUNT_VALIDATION_MESSAGE = `$property: Количество типов тренировки должно быть от ${TRAINING_TYPE_COUNT.MIN} до ${TRAINING_TYPE_COUNT.MAX}`;
export const TRAINING_TYPE_VALIDATION_MESSAGE = `$property: Тип тренировки может принимать только следующие значения: ${Object.values(
  TrainingType,
).join(', ')}`;

export const TRAINING_DURATION_VALIDATION_MESSAGE = `$property: Длительность тренировки может принимать только следующие значения: ${Object.values(
  TrainingDuration,
).join(', ')}`;

export const READY_FOR_WORKOUT_VALIDATION_MESSAGE =
  '$property: Должно быть булевым значением';

export const CERTIFICATES_VALIDATION_MESSAGE =
  '$property: Файл сертификата должен иметь формат "pdf"';
