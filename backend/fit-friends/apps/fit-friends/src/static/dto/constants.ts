export const MAX_FILE_AVATAR_SIZE = 1048576;

export const imageExtensions = ['jpeg', 'jpg', 'png'];
export const certificateExtensions = ['pdf'];
export const videoExtensions = ['mov', 'avi', 'mp4'];

export const EXTENSION_PATTERN = /\.[0-9a-z]+$/i;
export const FILENAME_PATTERN = /[^/\\]+$/;

export const getIncorrectFormatMessage = (formats: string[]) =>
  `Некорректный формат файла. Допустимые расширения: ${formats.join(', ')}`;

export const INCORRECT_SIZE_MESSAGE =
  'Размер изображения не должен превышать 1 MB';

export const INCORRECT_FILE_DATA = 'Некорректный файл';

export const SubDirs = {
  Avatars: '/avatars',
  Certificates: '/certificates',
  TrainingVideos: '/training-videos',
} as const;
