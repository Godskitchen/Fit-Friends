import { createSlice } from '@reduxjs/toolkit';
import { UserProcess } from '../../types/state.type';
import { checkAuthAction, loginAction, registerAction } from '../api-actions';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { HttpStatusCode } from 'src/services/server-api';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userInfo: null,
  formErrors: {
    [HttpStatusCode.CONFLICT]: '',
    [HttpStatusCode.SERVER_INTERNAL]: '',
    [HttpStatusCode.BAD_REQUEST]: {},
    [HttpStatusCode.UNAUTHORIZED]: ''
  },
};

export const userProcess = createSlice({
  name: SliceNameSpace.User,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(registerAction.fulfilled, (state, {payload}) => {
        state.userInfo = payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(registerAction.rejected, (state, {payload}) => {
        state.userInfo = null;
        if (payload && payload.statusCode) {
          if (payload.statusCode === HttpStatusCode.BAD_REQUEST) {
            if (Array.isArray(payload.message)) {
              (payload.message).forEach((msg) => {
                const [property, ...description] = msg.split(':');
                state.formErrors[HttpStatusCode.BAD_REQUEST][property.trim()] = description.join(':').trim();
              });
            } else {
              state.formErrors[HttpStatusCode.BAD_REQUEST]['avatar'] = payload.message;
            }
          } else {
            state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
          }
        }
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      });
  },
});
