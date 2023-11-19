import fileTypeChecker from 'file-type-checker';
import { IMAGE_FILE_VALIDATION_MESSAGE, INCORRECT_SIZE_MESSAGE, ImageFormats, MAX_FILE_AVATAR_SIZE } from './constants';

export const avatarValidationHandler = async (
  avatar: FileList,
  stateChanger: (value: boolean) => void,
  pictureSetter: (value: string) => void,
) => {
  if (avatar.length === 0) {
    stateChanger(false);
    return false;
  }

  const file = avatar[0];
  if (file.size > MAX_FILE_AVATAR_SIZE ) {
    stateChanger(false);
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
    stateChanger(false);
    return IMAGE_FILE_VALIDATION_MESSAGE;
  }
  pictureSetter(URL.createObjectURL(file));
  stateChanger(true);
  return isValidImage;
};
