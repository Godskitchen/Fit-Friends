import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import { rootReducer } from 'src/store/root-reducer';
import browserHistory from 'src/utils/browser-history';

type Reducer = ReturnType<typeof rootReducer>;


export const redirect: Middleware<unknown, Reducer> = (_store) => (next) =>
  (action: PayloadAction<string>) => {
    if (action.type === 'app/redirectToRoute') {
      browserHistory.push(action.payload);
    }

    return next(action);
  };
