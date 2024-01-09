/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMapLocationModal from './user-map-location-modal';
import { Location } from 'src/types/constants';

const mockBtnRef = { current: null as HTMLButtonElement | null };
const closeModal = jest.fn();
describe('Component: UserMapLocationModal', () => {
  it('should render correctly', async () => {

    render(
      <UserMapLocationModal
        isModalOpen
        userName="mockName"
        userLocation={Location.Pionerskaya}
        closeModalBtnRef={mockBtnRef}
        closeModal={closeModal}
      />
    );

    expect(await screen.findByText('mockName')).toBeInTheDocument();
    expect(await screen.findByText(`м. ${Location.Pionerskaya}`)).toBeInTheDocument();
    expect(await screen.findByTestId('map')).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'close'})).toBeInTheDocument();
  });

  it('should call closeModal if user clicks on "close" button', async () => {
    const user = userEvent.setup();

    render(
      <UserMapLocationModal
        isModalOpen
        userName="mockName"
        userLocation={Location.Pionerskaya}
        closeModalBtnRef={mockBtnRef}
        closeModal={closeModal}
      />
    );

    const closeBtn = await screen.findByRole('button', {name: 'close'});
    await user.click(closeBtn);
    expect(closeModal).toBeCalled();
  });
});
