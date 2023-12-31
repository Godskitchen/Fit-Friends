import fileTypeChecker from 'file-type-checker';
import { VIDEO_FILE_VALIDATION_MESSAGE, VideoFormats } from './constants';

export const trainingVideoValidationHandler = async (
  video: FileList | null,
) => {
  if (!video || video.length === 0) {
    return false;
  }
  const file = video[0];

  const isValidVideo = await new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = fileTypeChecker.validateFileType(reader.result as ArrayBuffer, VideoFormats);
      resolve(result);
    };
    reader.readAsArrayBuffer(file);
  });

  if (!isValidVideo) {
    return VIDEO_FILE_VALIDATION_MESSAGE;
  }
  return isValidVideo;
};
