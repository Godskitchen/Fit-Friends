import fileTypeChecker from 'file-type-checker';
import { CERTIFICATES_FORMAT_MESSAGE, CertificateFormats } from './constants';
import { MOCK_PDF } from 'src/mock-constants';

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

  const tmp = await new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    const blob = new Blob([new Uint8Array(MOCK_PDF)], { type: 'application/pdf' });
    const mockPdf = new File([blob], 'mock.pdf', {type: 'application/pdf'});

    reader.onload = () => {
      const result = fileTypeChecker.validateFileType(reader.result as ArrayBuffer, CertificateFormats);
      resolve(result);
    };
    reader.readAsArrayBuffer(mockPdf);
  });

  // eslint-disable-next-line no-console
  console.log(tmp);

  if (!isValidCertificate) {
    return CERTIFICATES_FORMAT_MESSAGE;
  }
  return isValidCertificate;
};

