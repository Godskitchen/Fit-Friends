import { render, screen } from '@testing-library/react';
import { createTrainingMocks } from 'src/mock-constants';
import OfferList from './offer-list';
import userEvent from '@testing-library/user-event';


describe('Component: OfferList', () => {

  it('should render correctly', () => {
    render(<OfferList offers={createTrainingMocks(3)} />);

    expect(screen.getAllByText(/Горячие предложения на тренировки/i)).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-1'})).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-2'})).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-3'})).toHaveLength(3);
  });

  it('should change active slide if users clicks corresponding button', async() => {
    const user = userEvent.setup();

    render(<OfferList offers={createTrainingMocks(3)} />);
    const [activeSlide1Btn] = screen.getAllByRole('button', {name: 'слайд-1'});
    expect(activeSlide1Btn).toHaveClass('promo-slider__slider-dot--active');

    const [activeSlide2Btn] = screen.getAllByRole('button', {name: 'слайд-2'});
    expect(activeSlide2Btn).not.toHaveClass('promo-slider__slider-dot--active');

    await user.click(activeSlide2Btn);
    expect(activeSlide2Btn).toHaveClass('promo-slider__slider-dot--active');
    expect(activeSlide1Btn).not.toHaveClass('promo-slider__slider-dot--active');
  });
});
