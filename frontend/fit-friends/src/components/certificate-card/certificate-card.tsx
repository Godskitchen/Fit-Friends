import { ChangeEvent, useRef, useState } from 'react';
import getPdfThumbnail from 'src/utils/pdf-thumbnailer';
import { certificateValidationHandler } from 'src/utils/validators/user/certificate';

type CertificateCardProps = {
  image: string;
  clickDeleteBtnHandler: (id: string) => void;
  cardChangeHandler: (id: string, url: string) => void;
  cardId: string;
}

export default function CertificateCard({image, clickDeleteBtnHandler, cardChangeHandler, cardId}: CertificateCardProps):JSX.Element {
  const [uploadError, setUploadError] = useState('');
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileInputChangeHandler = async ({target}: ChangeEvent<HTMLInputElement>) => {
    const isValidFile = await certificateValidationHandler(target.files);
    if (typeof isValidFile === 'string') {
      setUploadError(isValidFile);
    } else if (isValidFile === true && target.files?.length) {
      const file = target.files[0];
      const filePath = URL.createObjectURL(file);
      const thumbnailSrc = await getPdfThumbnail(filePath);
      cardChangeHandler(cardId, thumbnailSrc);
      setUploadError('');
    }
  };

  return (
    <li className="personal-account-coach__item" style={{userSelect: 'none'}}>
      <div ref={cardRef} className="certificate-card">
        <div className="certificate-card__image">
          <picture>
            <img src={image} srcSet={image} width="294" height="360" alt="Сертификат" />
          </picture>
        </div>
        <div className="certificate-card__buttons">
          <button
            className="btn-flat btn-flat--underlined certificate-card__button certificate-card__button--edit"
            type="button"
            onClick={() => {
              if (cardRef.current) {
                cardRef.current.classList.add('certificate-card--edit');
              }
            }}
          >
            <svg width="12" height="12" aria-hidden="true">
              <use xlinkHref="#icon-edit"></use>
            </svg>
            <span>Изменить</span>
          </button>
          <button
            className="btn-flat btn-flat--underlined certificate-card__button certificate-card__button--save"
            type="button"
            onClick={() => {
              if (cardRef.current) {
                setUploadError('');
                cardRef.current.classList.remove('certificate-card--edit');
              }
            }}
          >
            <svg width="12" height="12" aria-hidden="true">
              <use xlinkHref="#icon-edit"></use>
            </svg>
            <span>Сохранить</span>
          </button>
          <input
            ref={fileInputRef}
            className="visually-hidden"
            type="file"
            accept="application/pdf"
            onChange={fileInputChangeHandler}
          />
          <div className="certificate-card__controls">
            <button
              className="btn-icon certificate-card__control"
              type="button"
              aria-label="next"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <svg width="16" height="16" aria-hidden="true">
                <use xlinkHref="#icon-change"></use>
              </svg>
            </button>
            <button
              className="btn-icon certificate-card__control"
              type="button"
              aria-label="next"
              data-testid="delete-card-btn"
              onClick={() => clickDeleteBtnHandler(cardId)}
            >
              <svg width="14" height="16" aria-hidden="true">
                <use xlinkHref="#icon-trash"></use>
              </svg>
            </button>
          </div>
        </div>
        {uploadError && <span style={{color: '#e4001b', fontSize: '0.9em', display: 'block'}}>{uploadError}</span>}
      </div>
    </li>
  );
}
