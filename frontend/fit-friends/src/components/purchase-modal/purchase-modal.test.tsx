import { render, screen, waitFor } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import PurchaseModal from './purchase-modal';
import { createTrainingMocks } from 'src/mock-constants';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { SliceNameSpace } from 'src/app-constants';
import { createAPI } from 'src/services/server-api';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createOrderAction } from 'src/store/api-actions';

const mockBtnRef = { current: null as HTMLButtonElement | null };
const closeModal = jest.fn();
const [mockTraining] = createTrainingMocks(1);

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: PurchaseModal', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false
      },
    };

    store = mockStore(initialState);
  });
  it('should render correctly', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <PurchaseModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            training={mockTraining}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByTestId('purchase-modal')).toBeInTheDocument();
    expect(await screen.findByText(/Купить тренировку/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'close'})).toBeInTheDocument();
    expect(await screen.findByText(/Количество/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'minus'})).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'plus'})).toBeInTheDocument();
    expect(await screen.findByText(/Выберите способ оплаты/i)).toBeInTheDocument();
    expect(await screen.findByText(/Итого/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'Купить'})).toBeInTheDocument();
  });

  it('should change training count for purchase if user clicks on "minus" or "plus" buttons. Total price should change too', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <PurchaseModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            training={mockTraining}
          />
        </HistoryRouter>
      </Provider>
    );

    const countInput = await screen.findByTestId<HTMLInputElement>('trainings-count');
    const price = await screen.findByTestId('sum');
    const minusBtn = await screen.findByRole('button', {name: 'minus'});
    const plusBtn = await screen.findByRole('button', {name: 'plus'});

    expect(countInput.value).toEqual('1');
    expect(price).toHaveTextContent(`${mockTraining.price}`);

    await user.click(minusBtn);
    expect(countInput.value).toEqual('1');
    await user.click(plusBtn);
    expect(countInput.value).toEqual('2');
    expect(price).toHaveTextContent(`${mockTraining.price * 2}`);
    await user.click(minusBtn);
    expect(countInput.value).toEqual('1');
    expect(price).toHaveTextContent(`${mockTraining.price}`);
  });

  it('should dispatch createOrderAction if user clicks on "buy" button', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <PurchaseModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            training={mockTraining}
          />
        </HistoryRouter>
      </Provider>
    );

    const buyBtn = await screen.findByRole('button', {name: 'Купить'});
    await user.click(buyBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(createOrderAction.pending.type)).toBeTruthy();
    });
  });

  it('should call closeModal if user clicks on "close" button', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <PurchaseModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            training={mockTraining}
          />
        </HistoryRouter>
      </Provider>
    );

    const closeBtn = await screen.findByRole('button', {name: 'close'});
    await user.click(closeBtn);
    expect(closeModal).toBeCalled();
  });
});
