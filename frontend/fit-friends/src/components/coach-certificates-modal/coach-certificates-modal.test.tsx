import { render, screen } from '@testing-library/react';
import CoachCertificatesModal from './coach-certificates-modal';
import userEvent from '@testing-library/user-event';

const mockBtnRef = { current: null as HTMLButtonElement | null };
const closeModal = jest.fn();
describe('Component: CoachCertificatesModal', () => {
  it('should render correctly', async () => {

    render(
      <CoachCertificatesModal
        isModalOpen
        closeModalBtnRef={mockBtnRef}
        closeModal={closeModal}
      />
    );

    expect(await screen.findByText(/Слайдер с сертификатами./i)).toBeInTheDocument();
    expect(await screen.findByText(/Сертификаты/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'prev'})).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'next'})).toBeInTheDocument();
    expect(await screen.findAllByAltText('сертификат')).toHaveLength(6);
  });

  it('should change slider offset on "next" or "prev" btn if it is not disabled', async () => {

    const user = userEvent.setup();

    render(
      <CoachCertificatesModal
        isModalOpen
        closeModalBtnRef={mockBtnRef}
        closeModal={closeModal}
      />
    );
    const slider = await screen.findByTestId('slider');
    const nextBtn = await screen.findByRole('button', {name: 'next'});
    const prevBtn = await screen.findByRole('button', {name: 'prev'});
    expect(slider).toHaveStyle('transform: translateX(0px)');
    await user.click(nextBtn);
    expect(slider).toHaveStyle('transform: translateX(-354px)');
    await user.click(prevBtn);
    expect(slider).toHaveStyle('transform: translateX(0px)');
    expect(prevBtn).toBeDisabled();
  });

  it('should call closeModal if user clicks on "close" button', async () => {
    const user = userEvent.setup();

    render(
      <CoachCertificatesModal
        isModalOpen
        closeModalBtnRef={mockBtnRef}
        closeModal={closeModal}
      />
    );

    const closeBtn = await screen.findByRole('button', {name: 'close'});
    await user.click(closeBtn);
    expect(closeModal).toBeCalled();
  });
});
