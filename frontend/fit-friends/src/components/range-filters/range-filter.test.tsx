/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen } from '@testing-library/react';
import { CALORIES_TO_BURN } from 'src/utils/validators/training/constants';
import userEvent from '@testing-library/user-event';
import RangeFilter from './range-filter';

const mockFilterProps = {
  title: 'Рейтинг',
  filterName:'raiting',
  className:'gym-catalog'
};

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };

const setterMaxRangeValue = jest.fn();
const setterMinRangeValue = jest.fn();
describe('Component: RangeFilter', () => {
  it('should render correctly', () => {

    render(
      <RangeFilter
        {...mockFilterProps}
        maxPossibleValue={CALORIES_TO_BURN.MAX}
        minPossibleValue={CALORIES_TO_BURN.MIN}
        timeoutRef={mockTimeoutRef}
        formRef={mockFormRef}
        setterMaxRangeValue={setterMaxRangeValue}
        setterMinRangeValue={setterMinRangeValue}
        currMinValue={CALORIES_TO_BURN.MIN}
        currMaxValue={CALORIES_TO_BURN.MAX}
      />
    );

    expect(screen.getByText(mockFilterProps.title)).toBeInTheDocument();
    expect(screen.getByText(/Минимальное значение/i)).toBeInTheDocument();
    expect(screen.getByText(/Максимальное значение/i)).toBeInTheDocument();
    expect(screen.getByText(/Полоса прокрутки/i)).toBeInTheDocument();
  });
});
