import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { TrainingCardType } from 'src/types/training.type';
import { formatNumber, handleKeyDown } from 'src/utils/helpers';
import PaymentMethodList from '../payment-method-list/payment-method-list';
import { ORDER_ITEMS_COUNT } from 'src/utils/validators/training/constants';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getDataUploadingStatus } from 'src/store/app-data/app-data.selectors';
import { CreatePurchaseInputs } from 'src/types/forms.type';
import { PaymentMethodValue } from 'src/types/constants';
import { createOrderAction, getTrainingAmountAction } from 'src/store/api-actions';
import BlockUI from '../block-UI/block-UI';

type NewOrderModalProps = {
  isModalOpen: boolean;
  training: TrainingCardType;
  closeModalBtnRef: MutableRefObject<HTMLButtonElement | null>;
  closeModal: () => void;
}

const INITIAL_ITEMS_COUNT = 1;

export default function PurchaseModal({isModalOpen, closeModal, training, closeModalBtnRef}: NewOrderModalProps) : JSX.Element {
  const dispatch = useAppDispatch();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const {title, price, isSpecialOffer, backgroundImage} = training;

  const currentPrice = isSpecialOffer ? Number((price - (price * 0.1)).toFixed()) : price;

  const [itemsCount, setItemsCount] = useState(INITIAL_ITEMS_COUNT);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>(PaymentMethodValue.Mir);

  const keyDownModalHandler = useCallback(
    ((evt: globalThis.KeyboardEvent) => handleKeyDown(evt, modalRef, closeModal)), [closeModal]
  );

  const isDataUploading = useAppSelector(getDataUploadingStatus);

  const handleIncreaseCountBtnClick = () => {
    setItemsCount((count) => Math.min(ORDER_ITEMS_COUNT.MAX, count + 1));
  };

  const handleDecreaseCountBtnClick = () => {
    setItemsCount((count) => Math.max(ORDER_ITEMS_COUNT.MIN, count - 1));
  };

  const handleBuyBtnClick = () => {
    const purchase: CreatePurchaseInputs = {
      trainingId: training.trainingId,
      trainingCount: itemsCount,
      paymentType: paymentMethod,
    };

    dispatch(createOrderAction(purchase))
      .then((result) => {
        if (createOrderAction.fulfilled.match(result)) {
          dispatch(getTrainingAmountAction(training.trainingId));
          closeModal();
        }
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', keyDownModalHandler);
    }
    return () => {
      document.removeEventListener('keydown', keyDownModalHandler);
    };
  }, [closeModal, isModalOpen, keyDownModalHandler]);

  const orderSum = formatNumber(currentPrice * itemsCount);

  return (
    <div
      ref={modalRef}
      className={`modal modal--success modal--no-scale modal--fit-content ${isModalOpen ? 'is-active' : ''}`}
      data-testid="purchase-modal"
    >
      <div className="modal__wrapper">
        <div className="popup-form popup-form--buy">
          <section className="popup" style={{background: 'none'}}>
            <div className="popup__wrapper" style={{position: 'relative'}}>
              {isDataUploading && <BlockUI />}
              <div className="popup-head">
                <h2 className="popup-head__header">Купить тренировку</h2>
                <button
                  className="btn-icon btn-icon--outlined btn-icon--big"
                  type="button"
                  aria-label="close"
                  ref={closeModalBtnRef}
                  onClick={() => closeModal()}
                >
                  <svg width="20" height="20" aria-hidden="true">
                    <use xlinkHref="#icon-cross"></use>
                  </svg>
                </button>
              </div>
              <div className="popup__content popup__content--purchases">
                <div className="popup__product">
                  <div className="popup__product-image">
                    <picture>
                      <img src={backgroundImage}
                        width="98"
                        height="80"
                        alt=""
                      />
                    </picture>
                  </div>
                  <div className="popup__product-info">
                    <h3 className="popup__product-title">{title}</h3>
                    <p className="popup__product-price">{`${currentPrice} ₽`}</p>
                  </div>
                  <div className="popup__product-quantity">
                    <p className="popup__quantity">Количество</p>
                    <div className="input-quantity">
                      <button
                        className="btn-icon btn-icon--quantity"
                        type="button"
                        aria-label="minus"
                        onClick={handleDecreaseCountBtnClick}
                      >
                        <svg width="12" height="12" aria-hidden="true">
                          <use xlinkHref="#icon-minus"></use>
                        </svg>
                      </button>
                      <div className="input-quantity__input">
                        <label>
                          <input
                            type="number"
                            value={itemsCount}
                            size={2}
                            readOnly
                          />
                        </label>
                      </div>
                      <button
                        className="btn-icon btn-icon--quantity"
                        type="button"
                        aria-label="plus"
                        onClick={handleIncreaseCountBtnClick}
                      >
                        <svg width="12" height="12" aria-hidden="true">
                          <use xlinkHref="#icon-plus"></use>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <section className="payment-method">
                  <h4 className="payment-method__title">Выберите способ оплаты</h4>
                  <PaymentMethodList
                    paymentMethod={paymentMethod}
                    methodSetter={setPaymentMethod}
                  />
                </section>
                <div className="popup__total">
                  <p className="popup__total-text">Итого</p>
                  <svg className="popup__total-dash" width="310" height="2" aria-hidden="true">
                    <use xlinkHref="#dash-line"></use>
                  </svg>
                  <p className="popup__total-price">{orderSum}&nbsp;₽</p>
                </div>
                <div className="popup__button">
                  <button
                    className="btn"
                    type="button"
                    disabled={isDataUploading}
                    onClick={handleBuyBtnClick}
                  >
                      Купить
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
