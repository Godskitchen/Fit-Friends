import { render, screen } from '@testing-library/react';
import SortFilter from './sort-filter';
import { UserSortFieldBtnValue } from 'src/types/constants';
import userEvent from '@testing-library/user-event';

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };

const setterSortValue = jest.fn();

describe('Component: SortFilter', () => {
  it('should render correctly', () => {

    render(
      <SortFilter
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        setterSortValue={setterSortValue}
        filterValues={UserSortFieldBtnValue}
        className='user-catalog'
        currentSortValue='Trainer'
      />
    );

    expect(screen.getByText(/Сортировка/i)).toBeInTheDocument();
    expect(screen.getByText(UserSortFieldBtnValue.Trainer)).toBeInTheDocument();
    expect(screen.getByText(UserSortFieldBtnValue.User)).toBeInTheDocument();
    expect(screen.getByTestId('Trainer')).toBeChecked();
  });

  it('should call setterSortValue if user clicks on button', async () => {

    const user = userEvent.setup();

    render(
      <SortFilter
        formRef={mockFormRef}
        timeoutRef={mockTimeoutRef}
        setterSortValue={setterSortValue}
        filterValues={UserSortFieldBtnValue}
        className='user-catalog'
        currentSortValue=''
      />
    );

    const trainerSortBtn = await screen.findByTestId('Trainer');
    expect(trainerSortBtn).not.toBeChecked();
    await user.click(trainerSortBtn);
    expect(setterSortValue).toBeCalledWith('Trainer');
  });
});
