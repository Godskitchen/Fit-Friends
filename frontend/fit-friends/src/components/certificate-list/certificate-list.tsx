import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CertificateCard from '../certificate-card/certificate-card';
import { certificateValidationHandler } from 'src/utils/validators/user/certificate';
import getPdfThumbnail from 'src/utils/pdf-thumbnailer';
import { useAppSelector } from 'src/hooks';
import { getCoachCertificates } from 'src/store/user-process/user-process.selectors';
import LoadingScreen from '../loading-components/loading-screen';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 10);

type CoachCertificate = {
  id: string;
  url: string;
}

const CARD_WIDTH = 334;
const CARD_GAP = 20;
const DESK_WIDTH = 1042;

export default function CertificateSlider(): JSX.Element {
  const certificate = useAppSelector(getCoachCertificates);
  const [cards, setCards] = useState<CoachCertificate[]>([]);
  const [uploadError, setUploadError] = useState('');
  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const loadThumbnail = async () => {
      if (certificate) {
        const thumbnailSrc = await getPdfThumbnail(certificate);
        setCards([{id: nanoid(), url: thumbnailSrc}]);
      }
    };

    loadThumbnail();
  }, [certificate]);

  const [offSet, setOffset] = useState(0);
  const minOffset = 0;
  const maxOffset = -(CARD_WIDTH * cards.length + CARD_GAP * (cards.length - 1) - DESK_WIDTH);

  const handleLeftArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset + (CARD_WIDTH + CARD_GAP);
      return newOffset;
    });
  };

  const handleRightArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset - (CARD_WIDTH + CARD_GAP);
      return newOffset;
    });
  };

  const onMainBtnFileInputChange = async ({target}: ChangeEvent<HTMLInputElement>) => {
    const isValidFile = await certificateValidationHandler(target.files);
    if (typeof isValidFile === 'string') {
      setUploadError(isValidFile);
    } else if (isValidFile === true && target.files?.length) {
      const file = target.files[0];
      const filePath = URL.createObjectURL(file);
      const thumbnailSrc = await getPdfThumbnail(filePath);
      setCards((currentCards) => ([{id: nanoid(), url: thumbnailSrc}, ...currentCards]));
      setOffset(minOffset);
      setUploadError('');
    }
  };

  const cardFileChangeHandler = (id: string, url: string) => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, url } : card
    );
    setCards(updatedCards);
  };

  const deleteCardHandler = (id: string) => {
    const newCards = cards.filter((card) => card.id !== id);
    setCards(newCards);
    if (newCards.length <= 3) {
      setOffset(minOffset);
    }
  };

  if (!certificate) {
    return <LoadingScreen />;
  }

  return (
    <div className="personal-account-coach__additional-info">
      <div className="personal-account-coach__label-wrapper">
        <h2 className="personal-account-coach__label">Дипломы и сертификаты</h2>
        <input ref={mainFileInputRef}
          type="file"
          className="visually-hidden"
          accept=".pdf"
          onChange={onMainBtnFileInputChange}
        />
        <button
          className="btn-flat btn-flat--underlined personal-account-coach__button"
          type="button"
          onClick={() => {
            if (mainFileInputRef.current) {
              mainFileInputRef.current.click();
            }
          }}
        >
          <svg width="14" height="14" aria-hidden="true">
            <use xlinkHref="#icon-import"></use>
          </svg>
          <span>Загрузить</span>
        </button>
        {uploadError && <span style={{color: '#e4001b', fontSize: '0.9em'}}>{uploadError}</span>}
        <div className="personal-account-coach__controls">
          <button
            className="btn-icon personal-account-coach__control"
            type="button" aria-label="previous"
            onClick={handleLeftArrowClick}
            disabled={offSet === minOffset || cards.length <= 3}
          >
            <svg width="16" height="14" aria-hidden="true">
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </button>
          <button
            className="btn-icon personal-account-coach__control"
            type="button"
            aria-label="next"
            onClick={handleRightArrowClick}
            disabled={offSet === maxOffset || cards.length <= 3}
          >
            <svg width="16" height="14" aria-hidden="true">
              <use xlinkHref="#arrow-right"></use>
            </svg>
          </button>
        </div>
      </div>
      <ul className="personal-account-coach__list">
        <div style={{transform: `translateX(${offSet}px)`, display: 'flex', transition: 'transform 300ms ease-in-out'}}>
          {
            cards.map(({id, url}) => (
              <CertificateCard
                key={id}
                image={url}
                cardId={id}
                clickDeleteBtnHandler={deleteCardHandler}
                cardChangeHandler={cardFileChangeHandler}
              />
            ))
          }
        </div>
      </ul>
    </div>
  );
}
