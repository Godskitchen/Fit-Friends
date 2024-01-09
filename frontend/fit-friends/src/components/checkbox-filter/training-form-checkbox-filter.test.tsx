import { render, screen } from '@testing-library/react';
import TrainingFormCheckBoxFilter from './training-form-checkbox-filter';
import { DurationFieldValue } from 'src/types/constants';
import userEvent from '@testing-library/user-event';


const defaultDurationsState: Record<string, boolean> = {
  TenToThirtyMinutes: false,
  ThirtyToFiftyMinutes: false,
  FiftyToEightyMinutes: false,
  EightyToOneHundredMinutes: false
};

const mockFilterProps = {
  title: 'Длительность',
  filterName: 'duration',
  className: 'my-training'
};

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };

const mockSetter = jest.fn();
describe('Component: TrainingFormCheckBoxFilter', () => {

  it('should render correctly', async () => {
    render(
      <TrainingFormCheckBoxFilter
        {...mockFilterProps}
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        currentCheckBoxesGroupState={defaultDurationsState}
        setterCheckboxValues={mockSetter}
        checkBoxBtnValues={DurationFieldValue}
      />
    );

    expect(await screen.findByText('Длительность')).toBeInTheDocument();
    expect(await screen.findAllByRole<HTMLInputElement>('checkbox')).toHaveLength(4);
  });

  it('should checkbox setter be called if user clicks on it', async () => {

    const user = userEvent.setup();
    const newCheckBoxesState = {...defaultDurationsState, TenToThirtyMinutes: true };

    render(
      <TrainingFormCheckBoxFilter
        {...mockFilterProps}
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        currentCheckBoxesGroupState={defaultDurationsState}
        setterCheckboxValues={mockSetter}
        checkBoxBtnValues={DurationFieldValue}
      />
    );

    const checkBoxes = await screen.findAllByRole<HTMLInputElement>('checkbox');
    expect(checkBoxes[0]).not.toBeChecked();
    await user.click(checkBoxes[0]);
    expect(mockSetter).toHaveBeenCalledWith(newCheckBoxesState);
  });
});
