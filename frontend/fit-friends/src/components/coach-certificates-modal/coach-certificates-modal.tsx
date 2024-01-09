import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { handleKeyDown } from 'src/utils/helpers';

type CoachCertificatesProps = {
  isModalOpen: boolean;
  closeModalBtnRef: MutableRefObject<HTMLButtonElement | null>;
  closeModal: () => void;
}

const certificateMockImages = [
  '/img/content/certificates-and-diplomas/certificate-1.webp',
  '/img/content/certificates-and-diplomas/certificate-2.webp',
  '/img/content/certificates-and-diplomas/certificate-3.webp',
  '/img/content/certificates-and-diplomas/certificate-4.webp',
  '/img/content/certificates-and-diplomas/certificate-5.webp',
  '/img/content/certificates-and-diplomas/certificate-6.webp',
];

const CARD_WIDTH = 334;
const CARD_GAP = 20;
const DESK_WIDTH = CARD_WIDTH;

export default function CoachCertificatesModal({isModalOpen, closeModalBtnRef, closeModal}: CoachCertificatesProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const keyDownModalHandler = useCallback(
    ((evt: globalThis.KeyboardEvent) => handleKeyDown(evt, modalRef, closeModal)), [closeModal]
  );

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', keyDownModalHandler);
    }
    return () => {
      document.removeEventListener('keydown', keyDownModalHandler);
    };
  }, [closeModal, isModalOpen, keyDownModalHandler]);

  const [offset, setOffset] = useState(0);
  const minOffset = 0;
  const maxOffset = -(CARD_WIDTH * certificateMockImages.length + CARD_GAP * (certificateMockImages.length - 1) - DESK_WIDTH);

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

  return (
    <div ref={modalRef} className={`modal modal--success modal--no-scale modal--fit-content ${isModalOpen ? 'is-active' : ''}`}>
      <div className="modal__wrapper">
        <section className="popup" style={{background: 'none'}}>
          <h2 className="visually-hidden">Слайдер с сертификатами.</h2>
          <div className="popup__wrapper">
            <div className="popup-head">
              <h2 className="popup-head__header">Сертификаты</h2>
              <button
                className="btn-icon btn-icon--outlined btn-icon--big"
                type="button" aria-label="close"
                ref={closeModalBtnRef}
                onClick={() => closeModal()}
              >
                <svg width="20" height="20" aria-hidden="true">
                  <use xlinkHref="#icon-cross"></use>
                </svg>
              </button>
            </div>
            <div className="popup__content popup__content--certificates">
              <div className="popup__slider-buttons">
                <button
                  className="btn-icon popup__slider-btn popup__slider-btn--prev"
                  type="button"
                  aria-label="prev"
                  onClick={handleLeftArrowClick}
                  disabled={offset === minOffset}
                >
                  <svg width="16" height="14" aria-hidden="true">
                    <use xlinkHref="#arrow-left"></use>
                  </svg>
                </button>
                <button
                  className="btn-icon popup__slider-btn popup__slider-btn--next"
                  type="button"
                  aria-label="next"
                  onClick={handleRightArrowClick}
                  disabled={offset === maxOffset}
                >
                  <svg width="16" height="14" aria-hidden="true">
                    <use xlinkHref="#arrow-right"></use>
                  </svg>
                </button>
              </div>
              <ul className="popup__slider-list" style={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden'
              }}
              >
                <div
                  style=
                    {{
                      transform: `translateX(${offset}px)`,
                      display: 'flex',
                      transition: 'transform 400ms ease-in-out'
                    }}
                  data-testid="slider"
                >
                  {
                    certificateMockImages.map((image, index, array) => (
                      <li
                        className="popup__slide popup__slide--current"
                        key={image}
                        style={{marginRight: index < array.length - 1 ? '20px' : '0px'}}
                      >
                        <div className="popup__slide-img" style={{minWidth: '334px'}}>
                          <picture>
                            <source type="image/webp" srcSet={image} />
                            <img
                              src={image}
                              width="294"
                              height="360"
                              alt="сертификат"
                            />
                          </picture>
                        </div>
                      </li>
                    ))
                  }
                </div>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
