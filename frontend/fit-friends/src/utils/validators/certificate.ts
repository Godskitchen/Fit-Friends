import fileTypeChecker from 'file-type-checker';
import { CERTIFICATES_FORMAT_MESSAGE, CertificateFormats } from './constants';

export const certificateValidationHandler = async (
  certificate: FileList,
  stateChanger: (value: boolean) => void,
) => {
  if (certificate.length === 0) {
    stateChanger(false);
    return false;
  }
  const file = certificate[0];

  const isValidCertificate: boolean = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = fileTypeChecker.validateFileType(reader.result as ArrayBuffer, CertificateFormats);
      resolve(result);
    };
    reader.readAsArrayBuffer(file);
  });
  if (!isValidCertificate) {
    stateChanger(false);
    return CERTIFICATES_FORMAT_MESSAGE;
  }
  stateChanger(true);
  return isValidCertificate;
};

