import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from 'src/services/server-api';
import { rootReducer } from './root-reducer';
import { redirect } from 'src/middlewares/redirect.middleware';

export const serverApi = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: serverApi } }).concat(redirect)
});
