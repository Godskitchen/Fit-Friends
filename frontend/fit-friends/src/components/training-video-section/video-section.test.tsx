/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import userEvent from '@testing-library/user-event';
import { MockTraining, MockUser, MockUserProfile } from 'src/mock-constants';
import VideoSection from './video-section';
import MockAdapter from 'axios-mock-adapter';
import { updateTrainingAmountAction } from 'src/store/api-actions';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const trainingInfo = {...MockTraining};
const setLoadVideoMode = jest.fn();

const history = createBrowserHistory();

describe('Page: VideoSection', () => {

  let store: ReturnType<typeof mockStore>;
  let initialState;
  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
    window.HTMLMediaElement.prototype.load = jest.fn();
  });

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        trainingInfo,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <VideoSection
            videoLink={trainingInfo.video}
            poster={trainingInfo.backgroundImage}
            isLoadVideoMode={false}
            setLoadVideoMode={setLoadVideoMode}
            trainingId={trainingInfo.trainingId}
            trainingAmount={0}
            myRole={MockUser.role}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Видео/i)).toBeInTheDocument();
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
    expect(screen.getByTestId('video-player')).toHaveAttribute('src', trainingInfo.video);
    expect(screen.getByTestId('video-player')).toHaveAttribute('poster', trainingInfo.backgroundImage);
    expect(screen.getByRole('button', {name: 'Приступить'})).toBeDisabled();
  });

  it('"begin" button should be enabled if training amount > 0. Click on this button dispatches updateTrainingAmountAction and render "end" button"', async () => {
    mockAPI
      .onPatch(ApiRoute.UpdateBalance)
      .reply(200, {balanceId: 'mockId', training: trainingInfo, remainingAmout: 0});

    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        trainingInfo,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <VideoSection
            videoLink={trainingInfo.video}
            poster={trainingInfo.backgroundImage}
            isLoadVideoMode={false}
            setLoadVideoMode={setLoadVideoMode}
            trainingId={trainingInfo.trainingId}
            trainingAmount={1}
            myRole={MockUser.role}
          />
        </HistoryRouter>
      </Provider>
    );

    const beginBtn = await screen.findByRole('button', {name: 'Приступить'});
    expect(beginBtn).toBeEnabled();
    await user.click(beginBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);

      expect(actions).toEqual([
        updateTrainingAmountAction.pending.type,
        updateTrainingAmountAction.fulfilled.type
      ]);
    });

    expect(await screen.findByRole('button', {name: 'Закончить'})).toBeVisible();
  });

  it('"play" button should be enabled only if user clicked on "start" btn', async () => {
    mockAPI
      .onPatch(ApiRoute.UpdateBalance)
      .reply(200, {balanceId: 'mockId', training: trainingInfo, remainingAmout: 1});

    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        trainingInfo,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
      },
    };

    store = mockStore(initialState);

    const {rerender} = render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <VideoSection
            videoLink={trainingInfo.video}
            poster={trainingInfo.backgroundImage}
            isLoadVideoMode={false}
            setLoadVideoMode={setLoadVideoMode}
            trainingId={trainingInfo.trainingId}
            trainingAmount={1}
            myRole={MockUser.role}
          />
        </HistoryRouter>
      </Provider>
    );

    const beginBtn = await screen.findByRole('button', {name: 'Приступить'});
    const playVideoBtn = await screen.findByTestId('playback-btn');
    expect(beginBtn).toBeEnabled();
    expect(playVideoBtn).toBeDisabled();
    await user.click(beginBtn);

    rerender(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <VideoSection
            videoLink={trainingInfo.video}
            poster={trainingInfo.backgroundImage}
            isLoadVideoMode={false}
            setLoadVideoMode={setLoadVideoMode}
            trainingId={trainingInfo.trainingId}
            trainingAmount={1}
            myRole={MockUser.role}
          />
        </HistoryRouter>
      </Provider>
    );

    const videoElement: HTMLVideoElement = screen.getByTestId('video-player');
    const playSpy = jest.spyOn(videoElement, 'play');

    expect(playVideoBtn).toBeEnabled();
    expect(playSpy).not.toHaveBeenCalled();
    await user.click(playVideoBtn);
    expect(playSpy).toHaveBeenCalledTimes(1);
    await user.click(playVideoBtn);
    expect(await screen.findByRole('button', {name: 'Закончить'})).toBeVisible();

    playSpy.mockRestore();
  });
});
