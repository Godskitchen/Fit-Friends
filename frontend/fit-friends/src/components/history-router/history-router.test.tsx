import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import HistoryRouter from './history-router';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { act, render, screen } from '@testing-library/react';

const mockStore = configureMockStore();
const mockHistory = createBrowserHistory();

describe('Custom history router work tests', () => {
  it('should correctly change the location', () => {
    const store = mockStore();

    const { rerender } = render(
      <Provider store={store}>
        <HistoryRouter history={mockHistory}>
          <Routes>
            <Route
              path={'/'}
              element={<h1>Start route point</h1>}
            />
            <Route
              path={'/testroute'}
              element={<h1>Test route</h1>}
            />
          </Routes>
        </HistoryRouter>
      </Provider>
    );

    expect(mockHistory.location.pathname).toEqual('/');
    expect(screen.getByText('Start route point')).toBeInTheDocument();
    expect(screen.queryByText('Test route')).not.toBeInTheDocument();

    act(() => {
      mockHistory.push('/testroute');
    });

    rerender(
      <Provider store={store}>
        <HistoryRouter history={mockHistory}>
          <Routes>
            <Route
              path={'/'}
              element={<h1>Start route point</h1>}
            />
            <Route
              path={'/testroute'}
              element={<h1>Test route</h1>}
            />
          </Routes>
        </HistoryRouter>
      </Provider>
    );

    expect(mockHistory.location.pathname).toEqual('/testroute');
    expect(screen.queryByText('Start route point')).not.toBeInTheDocument();
    expect(screen.getByText('Test route')).toBeInTheDocument();
  });
});
