import {useEffect, useRef, useState } from 'react';
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
    </ul>
  );
}
