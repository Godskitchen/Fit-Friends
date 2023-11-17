import fileTypeChecker from 'file-type-checker';
import { IMAGE_FILE_VALIDATION_MESSAGE, INCORRECT_SIZE_MESSAGE, ImageFormats, MAX_FILE_AVATAR_SIZE } from './constants';

export const avatarValidationHandler = async (
  files: FileList,
  uploaderAvatarState: (value: boolean) => void,
  pictureSetter: (value: string) => void) => {
  if (files.length === 0) {
    uploaderAvatarState(false);
    return true;
  }
  const file = files[0];
  if (file.size > MAX_FILE_AVATAR_SIZE ) {
    uploaderAvatarState(false);
    return INCORRECT_SIZE_MESSAGE;
  }
  const isValidImage: boolean = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = fileTypeChecker.validateFileType(reader.result as ArrayBuffer, ImageFormats);
      resolve(result);
    };
    reader.readAsArrayBuffer(file);
  });
  if (!isValidImage) {
    uploaderAvatarState(false);
    return IMAGE_FILE_VALIDATION_MESSAGE;
  }
  pictureSetter(URL.createObjectURL(file));
  uploaderAvatarState(true);
  return isValidImage;
};
