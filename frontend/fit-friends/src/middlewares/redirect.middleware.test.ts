import { configureMockStore } from '@jedmao/redux-mock-store';
import { AnyAction } from '@reduxjs/toolkit';
import { redirectAction } from 'src/store/redirect.action';
import { AppRoute } from 'src/app-constants';
import { State } from 'src/types/state.type';
import { redirect } from './redirect.middleware';

const fakeHistory = {
  location: { pathname: '' },
  push(path: string) {
    this.location.pathname = path;
  },
};

jest.mock('src/utils/browser-history', () => fakeHistory);


const middlewares = [redirect];
const mockStore = configureMockStore<State, AnyAction>(middlewares);
const store = mockStore();

describe('Middleware: redirect', () => {
  beforeEach(() => {
    fakeHistory.push('');
  });

  it('should be redirect to /login', () => {
    store.dispatch(redirectAction(AppRoute.Login));

    expect(fakeHistory.location.pathname).toBe(AppRoute.Login);
    expect(store.getActions()).toEqual([
      redirectAction(AppRoute.Login),
    ]);
  });

  it('shouldn\'t be redirect because bad action', () => {
    store.dispatch({ type: 'UNKNOWN_ACTION', payload: '/anyroute' });
    expect(fakeHistory.location.pathname).not.toBe('/anyroute');
  });
});
