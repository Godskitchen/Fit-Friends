/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';
import { createTrainingMocks } from 'src/mock-constants';
import OfferSlide from './offer-slide';

let [training] = createTrainingMocks(1);
training = {...training, isSpecialOffer: true};

const addToRefs = jest.fn();
const slideSetter = jest.fn();

describe('Component: OfferSlide', () => {

  it('should render correctly', async () => {

    render(
      <OfferSlide
        training={training}
        activeSlide={null}
        addToRefs={addToRefs}
        slideSetter={slideSetter}
        allSlideRefs={[]}
        index={0}
      />
    );

    expect(addToRefs).toHaveBeenCalled();
    expect(await screen.findByAltText('promo')).toBeInTheDocument();
    expect(await screen.findByText(training.title)).toBeInTheDocument();
    expect(await screen.findByText(/Горячие предложения на тренировки/i)).toBeInTheDocument();
    expect(await screen.findByText(`${training.price} ₽`)).toBeInTheDocument();
    expect(await screen.findByText(`${(training.price - training.price * 0.1).toFixed()} ₽`)).toBeInTheDocument();
  });
});
