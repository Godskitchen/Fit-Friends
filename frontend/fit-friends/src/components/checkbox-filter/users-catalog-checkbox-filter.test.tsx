import { render, screen } from '@testing-library/react';
import { SpecialisationFieldValue } from 'src/types/constants';
import userEvent from '@testing-library/user-event';
import UsersCatalogCheckBoxFilter from './users-catalog-checkbox-filter';

const mockFilterProps = {
  title: 'Специализация',
  filterName: 'spezialization',
};

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };

const mockCheckboxSetter = jest.fn();

const defaultSpecialisationState: Record<string, boolean> = {
  Yoga: false,
  Running: false,
  Power: false,
  Aerobics: false,
  Crossfit: false,
  Boxing: false,
  Pilates: false,
  Stretching: false,
};
describe('Component: UserCatalogCheckboxFilter', () => {

  it('should render correctly', async () => {
    render(
      <UsersCatalogCheckBoxFilter
        {...mockFilterProps}
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        currentCheckBoxesGroupState={defaultSpecialisationState}
        setterCheckboxValues={mockCheckboxSetter}
        checkBoxBtnValues={SpecialisationFieldValue}
      />
    );

    expect(await screen.findByText('Специализация')).toBeInTheDocument();
    expect(await screen.findAllByRole<HTMLInputElement>('checkbox')).toHaveLength(8);
    expect(await screen.findByRole('button', {name: 'Посмотреть все'})).toBeInTheDocument();
  });

  it('should hide all checkboxes after 5th if group length more then 5. "watch all" button showes all checkboxes', async () => {
    const user = userEvent.setup();

    render(
      <UsersCatalogCheckBoxFilter
        {...mockFilterProps}
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        currentCheckBoxesGroupState={defaultSpecialisationState}
        setterCheckboxValues={mockCheckboxSetter}
        checkBoxBtnValues={SpecialisationFieldValue}
      />
    );

    const checkBoxes = await screen.findAllByTestId<HTMLInputElement>('checkbox-filter');
    expect(checkBoxes).toHaveLength(8);
    expect(checkBoxes[0]).not.toHaveClass('visually-hidden');
    expect(checkBoxes[5]).toHaveClass('visually-hidden');


    const watchAllbtn = await screen.findByRole('button', {name: 'Посмотреть все'});
    await user.click(watchAllbtn);

    expect(checkBoxes[0]).not.toHaveClass('visually-hidden');
    expect(checkBoxes[5]).not.toHaveClass('visually-hidden');

    expect(watchAllbtn).toHaveClass('visually-hidden');
  });

  it('should checkbox setter be called if user clicks on it', async () => {

    const user = userEvent.setup();
    const newCheckBoxesState = {...defaultSpecialisationState, Yoga: true };

    render(
      <UsersCatalogCheckBoxFilter
        {...mockFilterProps}
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        currentCheckBoxesGroupState={defaultSpecialisationState}
        setterCheckboxValues={mockCheckboxSetter}
        checkBoxBtnValues={SpecialisationFieldValue}
      />
    );

    const checkBoxes = await screen.findAllByRole<HTMLInputElement>('checkbox');
    expect(checkBoxes[0]).not.toBeChecked();
    await user.click(checkBoxes[0]);
    expect(mockCheckboxSetter).toHaveBeenCalledWith(newCheckBoxesState);
  });
});
