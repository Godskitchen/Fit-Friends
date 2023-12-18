import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { PaymentMethodValue } from 'src/types/constants';

const LogoParams: Record<PaymentMethodValue, {width: string; height: string}> = {
  [PaymentMethodValue.Visa]: {width: '58', height: '20'},
  [PaymentMethodValue.Mir]: {width: '66', height: '20'},
  [PaymentMethodValue.UMoney]: {width: '106', height: '24'}
};

type PaymentMethodListProps = {
  paymentMethod: string;
  methodSetter: Dispatch<SetStateAction<PaymentMethodValue>>;
}

export default function PaymentMethodList({paymentMethod, methodSetter}: PaymentMethodListProps): JSX.Element {

  const handlePaymentMethodBtnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    methodSetter(evt.target.value as PaymentMethodValue);
  };

  return (
    <ul className="payment-method__list">
      {
        Object.values(PaymentMethodValue).map((method) => (
          <li className="payment-method__item" key={method}>
            <div className="btn-radio-image">
              <label>
                <input
                  type="radio"
                  name="payment-purchases"
                  aria-label={method}
                  value={method}
                  checked={paymentMethod === method}
                  onChange={handlePaymentMethodBtnChange}
                />
                <span className="btn-radio-image__image">
                  <svg
                    width={LogoParams[method].width}
                    height={LogoParams[method].height}
                    aria-hidden="true"
                  >
                    <use xlinkHref={`#${method}-logo`}></use>
                  </svg>
                </span>
              </label>
            </div>
          </li>
        ))
      }
    </ul>
  );
}
