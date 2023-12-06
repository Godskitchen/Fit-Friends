export enum TITLE_LENGTH {
  MIN = 1,
  MAX = 15,
}

export enum TRAINING_DESCRIPTION_LENGTH {
  MIN = 10,
  MAX = 140,
}

export enum CALORIES_TO_BURN {
  MIN = 1000,
  MAX = 5000,
}

export enum PRICE {
  MIN = 0,
  MAX = 10000,
}

export enum RATING {
  MIN = 0,
  MAX = 5,
}

export const VideoFormats = ['mov', 'avi', 'mp4'];

export const VIDEO_FILE_NAME_PATTERN = `\\.(${VideoFormats.join('|')})$`;

export const TITLE_VALIDATION_MESSAGE = `Наименование должно иметь длину от ${TITLE_LENGTH.MIN} до ${TITLE_LENGTH.MAX} символов`;
// export const FITNESS_LEVEL_VALIDATION_MESSAGE = `$property: Уровень подготовки может принимать только следующие значения: ${Object.values(
//   FitnessLevel,
// ).join(', ')}`;

// export const TRAINING_DURATION_VALIDATION_MESSAGE = `$property: Длительность тренировки может принимать только следующие значения: ${Object.values(
//   TrainingDuration,
// ).join(', ')}`;

// export const TRAINING_TYPE_VALIDATION_MESSAGE = `$property: Тип тренировки может принимать только следующие значения: ${Object.values(
//   TrainingType,
// ).join(', ')}`;

export const PRICE_VALIDATION_MESSAGE = `Стоимость тренировки должна быть целым неотрицательным числом от ${PRICE.MIN} до ${PRICE.MAX}`;
export const DESCRIPTION_VALIDATION_MESSAGE = `Описание тренировки должно иметь длину от ${TRAINING_DESCRIPTION_LENGTH.MIN} до ${TRAINING_DESCRIPTION_LENGTH.MAX} символов`;

// export const GENDER_VALIDATION_MESSAGE = `$property: Пол пользователя, для которого предназначена тренировка, может принимать только следующие значения: ${Object.values(
//   Gender,
// ).join(', ')}`;

export const VIDEO_FILE_VALIDATION_MESSAGE = 'Некорректный формат видеофайла';

export const CALORIES_TO_BURN_VALIDATION_MESSAGE = `Калории должно быть целым числом от ${CALORIES_TO_BURN.MIN} до ${CALORIES_TO_BURN.MAX}`;
export const SPECIAL_OFFER_VALIDATION_MESSAGE = '$property: Должно быть булевым значением';
