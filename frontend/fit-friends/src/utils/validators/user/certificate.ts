import fileTypeChecker from 'file-type-checker';
import { CERTIFICATES_FORMAT_MESSAGE, CertificateFormats } from './constants';

export const certificateValidationHandler = async (
  certificate: FileList | null,
) => {
  if (!certificate || certificate.length === 0) {
    return false;
  }
  const file = certificate[0];

  const isValidCertificate = await new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = fileTypeChecker.validateFileType(reader.result as ArrayBuffer, CertificateFormats);
      resolve(result);
    };
    reader.readAsArrayBuffer(file);
  });

  if (!isValidCertificate) {
    return CERTIFICATES_FORMAT_MESSAGE;
  }
  return isValidCertificate;
};

