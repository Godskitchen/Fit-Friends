import { Dispatch, SetStateAction } from 'react';
import { TrainingCardType } from 'src/types/training.type';

type OfferSlideProps = {
  activeSlide: HTMLLIElement | null;
  addToRefs: (element: HTMLLIElement) => void;
  slideSetter: Dispatch<SetStateAction<HTMLLIElement | null>>;
  allSlideRefs: HTMLLIElement[];
  training: TrainingCardType;
  index: number;
}

export default function OfferSlide({activeSlide, addToRefs, slideSetter, allSlideRefs, training, index}: OfferSlideProps): JSX.Element {

  let idCounter = 0;
  return (
    <li className={`${activeSlide && activeSlide === allSlideRefs[index] ? 'is-active' : ''} special-offers__item`} ref={addToRefs}>
      <aside className="promo-slider">
        <div className="promo-slider__overlay"></div>
        <div className="promo-slider__image">
          <img src={training.backgroundImage} width="1040" height="469" alt="promo" />
        </div>
        <div className="promo-slider__header">
          <h3 className="promo-slider__title">{training.title}</h3>
          <div className="promo-slider__logo">
            <svg width="74" height="74" aria-hidden="true">
              <use xlinkHref="#logotype"></use>
            </svg>
          </div>
        </div>
        <span className="promo-slider__text">Горячие предложения на тренировки</span>
        <div className="promo-slider__bottom-container">
          <div className="promo-slider__slider-dots">
            {allSlideRefs.map((_val, i) => (
              <button
                key={idCounter++}
                className={`${activeSlide && activeSlide === allSlideRefs[i] ? 'promo-slider__slider-dot--active' : ''} promo-slider__slider-dot`}
                aria-label={`слайд-${i + 1}`}
                onClick={() => {slideSetter(allSlideRefs[i]);}}
              >
              </button>
            ))}
          </div>
          <div className="promo-slider__price-container">
            <p className="promo-slider__price">{`${(training.price - training.price * 0.1).toFixed()} ₽`}</p>
            <p className="promo-slider__sup">за занятие</p>
            <p className="promo-slider__old-price">{`${training.price} ₽`}</p>
          </div>
        </div>
      </aside>
    </li>
  );
}
