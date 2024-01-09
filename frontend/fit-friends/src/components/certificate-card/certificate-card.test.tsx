import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CertificateCard from './certificate-card';
import userEvent from '@testing-library/user-event';

const mockCertificateCard = {
  cardId: '1',
  image: 'http://localhost:4000/static/users/backs/user-3.png'
};

const cardChangeHandler = jest.fn();
const clickDeleteBtnHandler = jest.fn();


jest.mock('src/utils/pdf-thumbnailer',
  () => (_cert: string) => 'http://localhost:4000/static/users/backs/user-3.png'
);

describe('Component: CertificateCard', () => {
  afterEach(() => {
    cleanup();
  });
  it('should render correctly', async () => {
    render(
      <MemoryRouter>
        <CertificateCard
          {...mockCertificateCard}
          cardChangeHandler={cardChangeHandler}
          clickDeleteBtnHandler={clickDeleteBtnHandler}
        />
      </MemoryRouter>
    );

    expect(await screen.findByAltText('Сертификат')).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'Изменить'})).toBeInTheDocument();
  });

  it('should toogle button name from "change" to "save" if user clicks on it', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CertificateCard
          {...mockCertificateCard}
          cardChangeHandler={cardChangeHandler}
          clickDeleteBtnHandler={clickDeleteBtnHandler}
        />
      </MemoryRouter>
    );

    expect(await screen.findByAltText('Сертификат')).toBeInTheDocument();
    const changeBtn = await screen.findByRole('button', {name: 'Изменить'});
    expect(changeBtn).toBeInTheDocument();
    await user.click(changeBtn);
    const saveBtn = await screen.findByRole('button', {name: 'Сохранить'});
    expect(saveBtn).toBeInTheDocument();
    await user.click(saveBtn);
    expect(changeBtn).toBeInTheDocument();
  });

  it('should be fired clickEvent by click on delete card button', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CertificateCard
          {...mockCertificateCard}
          cardChangeHandler={cardChangeHandler}
          clickDeleteBtnHandler={clickDeleteBtnHandler}
        />
      </MemoryRouter>
    );

    expect(await screen.findByAltText('Сертификат')).toBeInTheDocument();
    const changeBtn = await screen.findByRole('button', {name: 'Изменить'});
    await user.click(changeBtn);
    const deleteBtn = await screen.findByTestId('delete-card-btn');
    await user.click(deleteBtn);
    expect(clickDeleteBtnHandler).toHaveBeenCalledTimes(1);
  });
});
