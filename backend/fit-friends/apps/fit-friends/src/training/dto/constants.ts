export enum TITLE_LENGTH {
  MIN = 1,
  MAX = 15,
}

export enum TRAINING_DESCRIPTION {
  MIN = 10,
  MAX = 140,
}

export enum CALORIES_TO_BURN {
  MIN = 1000,
  MAX = 5000,
}

export const PRICE_MIN = 0;

export const ImageFormats = ['jpg', 'png'];

export const IMAGE_FILE_NAME_PATTERN = RegExp(
  `\.(${ImageFormats.join('|')})$`,
  'i',
);

export const VideoFormats = ['mov', 'avi', 'mp4'];

export const VIDEO_FILE_NAME_PATTERN = RegExp(
  `\.(${VideoFormats.join('|')})$`,
  'i',
);
