import { render, screen } from '@testing-library/react';
import DropDownList from './dropdown-list';
import { GenderFieldValue } from 'src/types/constants';
import userEvent from '@testing-library/user-event';

const clickItemHandler = jest.fn();
describe('Component: DropDownList', () => {
  it('should render correctly', () => {

    render(
      <DropDownList
        items={Object.values(GenderFieldValue)}
        clickItemHandler={clickItemHandler}
      />
    );

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    Object.values(GenderFieldValue).forEach((item) => {
      expect(screen.getByTestId(item)).toBeInTheDocument();
    });
  });

  it('should fire click event by clicking on list', async () => {

    const user = userEvent.setup();

    render(
      <DropDownList
        items={Object.values(GenderFieldValue)}
        clickItemHandler={clickItemHandler}
      />
    );

    const list = await screen.findByRole('listbox');
    await user.click(list);
    expect(clickItemHandler).toBeCalled();
  });
});
