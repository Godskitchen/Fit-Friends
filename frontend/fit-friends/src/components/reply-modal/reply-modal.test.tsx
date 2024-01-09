/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import { createTrainingMocks } from 'src/mock-constants';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { SliceNameSpace } from 'src/app-constants';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import ReplyModal from './reply-modal';
import { createReplyAction } from 'src/store/api-actions';

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
describe('Component: ReplyModal', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false
      },
      [SliceNameSpace.User]: {
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: ''
        }
      },
    };

    store = mockStore(initialState);
  });
  it('should render correctly', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReplyModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            trainingId={mockTraining.trainingId}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Оставить отзыв/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'close'})).toBeInTheDocument();
    expect(await screen.findByText(/Оцените тренировку/i)).toBeInTheDocument();
    expect(await screen.findByText(/Поделитесь своими впечатлениями о тренировке/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'Продолжить'})).toBeInTheDocument();
  });

  it('should dispatch createReplyAction if user clicks on "continue" button', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReplyModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            trainingId={mockTraining.trainingId}
          />
        </HistoryRouter>
      </Provider>
    );

    const nextBtn = await screen.findByRole('button', {name: 'Продолжить'});
    const textField = screen.getByTestId<HTMLTextAreaElement>('text-field');
    const MOCK_TEXT = 'Veeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooooooooooooooooooooong review input for pass validation!';
    expect(nextBtn).toBeDisabled();

    const ratingBtn = await screen.findByTestId('rating-4');
    await user.click(ratingBtn);
    expect(ratingBtn).toBeChecked();

    fireEvent.change(textField, {target: {value: MOCK_TEXT}});

    await waitFor(() => { expect(nextBtn).toBeEnabled();});

    await user.click(nextBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(createReplyAction.pending.type)).toBeTruthy();
    });
  });

  it('should call closeModal if user clicks on "close" button', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReplyModal
            isModalOpen
            closeModalBtnRef={mockBtnRef}
            closeModal={closeModal}
            trainingId={mockTraining.trainingId}
          />
        </HistoryRouter>
      </Provider>
    );

    const closeBtn = await screen.findByRole('button', {name: 'close'});
    await user.click(closeBtn);
    expect(closeModal).toBeCalled();
  });
});
