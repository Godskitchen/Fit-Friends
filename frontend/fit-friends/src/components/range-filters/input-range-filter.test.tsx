import { render, screen } from '@testing-library/react';
import InputRangeFilter from './input-range-filter';
import { CALORIES_TO_BURN } from 'src/utils/validators/training/constants';
import userEvent from '@testing-library/user-event';

const mockFilterProps = {
  title: 'Калории',
  filterName: 'calories',
  className: 'gym-catalog'
};

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };

const setterMaxFieldValue = jest.fn();
const setterMaxRangeValue = jest.fn();
const setterMinFieldValue = jest.fn();
const setterMinRangeValue = jest.fn();
describe('Component: InputRangeFilter', () => {
  it('should render correctly', () => {

    render(
      <InputRangeFilter
        {...mockFilterProps}
        maxPossibleValue={CALORIES_TO_BURN.MAX}
        minPossibleValue={CALORIES_TO_BURN.MIN}
        timeoutRef={mockTimeoutRef}
        formRef={mockFormRef}
        setterMaxFieldValue={setterMaxFieldValue}
        setterMaxRangeValue={setterMaxRangeValue}
        setterMinFieldValue={setterMinFieldValue}
        setterMinRangeValue={setterMinRangeValue}
        currMinValue={CALORIES_TO_BURN.MIN}
        currMinFieldValue={''}
        currMaxValue={CALORIES_TO_BURN.MAX}
        currMaxFieldValue={''}
      />
    );

    expect(screen.getByText(mockFilterProps.title)).toBeInTheDocument();
    expect(screen.getByText(/Минимальное значение/i)).toBeInTheDocument();
    expect(screen.getByText(/Максимальное значение/i)).toBeInTheDocument();
    expect(screen.getByText(/Полоса прокрутки/i)).toBeInTheDocument();
  });

  it('should be called setters if users interact with corresponding inputs', async () => {

    const user = userEvent.setup();

    render(
      <InputRangeFilter
        {...mockFilterProps}
        maxPossibleValue={CALORIES_TO_BURN.MAX}
        minPossibleValue={CALORIES_TO_BURN.MIN}
        timeoutRef={mockTimeoutRef}
        formRef={mockFormRef}
        setterMaxFieldValue={setterMaxFieldValue}
        setterMaxRangeValue={setterMaxRangeValue}
        setterMinFieldValue={setterMinFieldValue}
        setterMinRangeValue={setterMinRangeValue}
        currMinValue={CALORIES_TO_BURN.MIN}
        currMinFieldValue={''}
        currMaxValue={CALORIES_TO_BURN.MAX}
        currMaxFieldValue={''}
      />
    );

    const minFieldInput = await screen.findByTestId(`min-${mockFilterProps.filterName}-field`);
    const maxFieldInput = await screen.findByTestId(`max-${mockFilterProps.filterName}-field`);

    await user.type(minFieldInput, '1500');
    await user.type(maxFieldInput, '2000');

    expect(setterMaxFieldValue).toHaveBeenCalled();
    expect(setterMinFieldValue).toHaveBeenCalled();
  });
});
