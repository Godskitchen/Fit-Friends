/* eslint-disable @typescript-eslint/no-unused-vars */
import { MutableRefObject, createRef, useEffect, useRef, useState } from 'react';
import { TrainingCardType } from 'src/types/training.type';
import OfferSlide from './offer-slide';

type OfferListProps = {
  offers: TrainingCardType[];
}

export default function OfferList({offers}: OfferListProps): JSX.Element {

  const offerRefs = useRef<HTMLLIElement[]>([]);

  const addToRefs = (element: HTMLLIElement) => {
    if (element && !offerRefs.current.includes(element)) {
      offerRefs.current.push(element);
    }
  };

  const [activeSlide, setActiveSlide] = useState<HTMLLIElement | null>(null);

  useEffect(() => {
    const firstSlideRef = offerRefs.current[0];
    setActiveSlide(firstSlideRef);
  }, []);

  return (
    <ul className="special-offers__list">
      {offers.map((offer, index) => (
        <OfferSlide
          key={offer.trainingId}
          activeSlide={activeSlide}
          slideSetter={setActiveSlide}
          training={offer}
          allSlideRefs={offerRefs.current}
          addToRefs={addToRefs}
          index={index}
        />
      ))}
      {/* <li className={`${activeSlide && activeSlide === firstSlideRef.current ? 'is-active' : ''} special-offers__item`} ref={firstSlideRef}>
        <aside className="promo-slider">
          <div className="promo-slider__overlay"></div>
          <div className="promo-slider__image">
            <img src="img/content/promo-1.png" srcSet="img/content/promo-1@2x.png 2x" width="1040" height="469" alt="promo" />
          </div>
          <div className="promo-slider__header">
            <h3 className="promo-slider__title">Fitball</h3>
            <div className="promo-slider__logo">
              <svg width="74" height="74" aria-hidden="true">
                <use xlinkHref="#logotype"></use>
              </svg>
            </div>
          </div><span className="promo-slider__text">Горячие предложения на тренировки на фитболе</span>
          <div className="promo-slider__bottom-container">
            <div className="promo-slider__slider-dots">
              <button
                className={`${activeSlide && activeSlide === firstSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="первый слайд"
                onClick={() => {if (firstSlideRef.current) {setActiveSlide(firstSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === secondSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="второй слайд"
                onClick={() => {if (secondSlideRef.current) {setActiveSlide(secondSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === thirdSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="третий слайд"
                onClick={() => {if (thirdSlideRef.current) {setActiveSlide(thirdSlideRef.current);}}}
              >
              </button>
            </div>
            <div className="promo-slider__price-container">
              <p className="promo-slider__price">1600 ₽</p>
              <p className="promo-slider__sup">за занятие</p>
              <p className="promo-slider__old-price">2000 ₽</p>
            </div>
          </div>
        </aside>
      </li>
      <li className={`${activeSlide && activeSlide === secondSlideRef.current ? 'is-active' : ''} special-offers__item`} ref={secondSlideRef}>
        <aside className="promo-slider">
          <div className="promo-slider__overlay"></div>
          <div className="promo-slider__image">
            <img src="img/content/promo-2.png" srcSet="img/content/promo-2@2x.png 2x" width="1040" height="469" alt="promo" />
          </div>
          <div className="promo-slider__header">
            <h3 className="promo-slider__title">Fleksbend</h3>
            <div className="promo-slider__logo">
              <svg width="74" height="74" aria-hidden="true">
                <use xlinkHref="#logotype"></use>
              </svg>
            </div>
          </div><span className="promo-slider__text">Горячие предложения на&nbsp;Тренировки с&nbsp;резинкой для фитнеса</span>
          <div className="promo-slider__bottom-container">
            <div className="promo-slider__slider-dots">
              <button
                className={`${activeSlide && activeSlide === firstSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="первый слайд"
                onClick={() => {if (firstSlideRef.current) {setActiveSlide(firstSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === secondSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="второй слайд"
                onClick={() => {if (secondSlideRef.current) {setActiveSlide(secondSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === thirdSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="третий слайд"
                onClick={() => { if (thirdSlideRef.current) { setActiveSlide(thirdSlideRef.current);}}}
              >
              </button>
            </div>
            <div className="promo-slider__price-container">
              <p className="promo-slider__price">2400 ₽</p>
              <p className="promo-slider__sup">за занятие</p>
              <p className="promo-slider__old-price">2800 ₽</p>
            </div>
          </div>
        </aside>
      </li>
      <li className={`${activeSlide && activeSlide === thirdSlideRef.current ? 'is-active' : ''} special-offers__item`} ref={thirdSlideRef}>
        <aside className="promo-slider">
          <div className="promo-slider__overlay"></div>
          <div className="promo-slider__image">
            <img src="img/content/promo-3.png" srcSet="img/content/promo-3@2x.png 2x" width="1040" height="469" alt="promo" />
          </div>
          <div className="promo-slider__header">
            <h3 className="promo-slider__title">Full Body Stretch</h3>
            <div className="promo-slider__logo">
              <svg width="74" height="74" aria-hidden="true">
                <use xlinkHref="#logotype"></use>
              </svg>
            </div>
          </div><span className="promo-slider__text">Горячие предложения на&nbsp;Комплекс упражнений на&nbsp;растяжку всего тела для новичков</span>
          <div className="promo-slider__bottom-container">
            <div className="promo-slider__slider-dots">
              <button
                className={`${activeSlide && activeSlide === firstSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="первый слайд"
                onClick={() => {if (firstSlideRef.current) {setActiveSlide(firstSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === secondSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="второй слайд"
                onClick={() => {if (secondSlideRef.current) {setActiveSlide(secondSlideRef.current);}}}
              >
              </button>
              <button
                className={`${activeSlide && activeSlide === thirdSlideRef.current ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label="третий слайд"
                onClick={() => { if (thirdSlideRef.current) { setActiveSlide(thirdSlideRef.current);}}}
              >
              </button>
            </div>
            <div className="promo-slider__price-container">
              <p className="promo-slider__price">1800 ₽</p>
              <p className="promo-slider__sup">за занятие</p>
              <p className="promo-slider__old-price">2200 ₽</p>
            </div>
          </div>
        </aside>
      </li> */}
    </ul>
  );
}
