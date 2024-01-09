/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentMethodList from './payment-method-list';
import { SetStateAction } from 'react';
import { PaymentMethodValue } from 'src/types/constants';
import userEvent from '@testing-library/user-event';

const methodSetter = jest.fn();
describe('Component: PaymentMethodList', () => {
  it('should render correctly', () => {

    render(
      <PaymentMethodList
        paymentMethod={PaymentMethodValue.UMoney}
        methodSetter={methodSetter}
      />
    );

    expect(screen.getByTestId(PaymentMethodValue.Mir)).toBeInTheDocument();
    expect(screen.getByTestId(PaymentMethodValue.Visa)).toBeInTheDocument();
    expect(screen.getByTestId(PaymentMethodValue.UMoney)).toBeInTheDocument();

    expect(screen.getByTestId(PaymentMethodValue.UMoney)).toBeChecked();
  });

  it('should fire method setter if user clicks on radio button', async () => {
    const user = userEvent.setup();
    render(
      <PaymentMethodList
        paymentMethod={PaymentMethodValue.UMoney}
        methodSetter={methodSetter}
      />
    );
    const mirBtn = await screen.findByTestId(PaymentMethodValue.Mir);
    await user.click(mirBtn);
    expect(methodSetter).toBeCalledWith(PaymentMethodValue.Mir);
  });
});
