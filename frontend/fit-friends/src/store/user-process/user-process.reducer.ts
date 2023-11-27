import { createSlice } from '@reduxjs/toolkit';
import { UserProcess } from '../../types/state.type';
import { checkAuthAction, createCoachProfileAction, createUserProfileAction, loginAction, registerAction } from '../api-actions';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { HttpStatusCode } from 'src/services/server-api';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userInfo: undefined,
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
  reducers: {
    clearFormErrorsAction: (state) => {
      state.formErrors = {
        [HttpStatusCode.CONFLICT]: '',
        [HttpStatusCode.SERVER_INTERNAL]: '',
        [HttpStatusCode.BAD_REQUEST]: {},
        [HttpStatusCode.UNAUTHORIZED]: ''
      };
    }
  },
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
      .addCase(loginAction.fulfilled, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(checkAuthAction.fulfilled, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userInfo = payload;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userInfo = null;
      })
      .addCase(createUserProfileAction.fulfilled, (state, {payload}) => {
        state.userInfo = payload;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(createUserProfileAction.rejected, (state, {payload}) => {
        if (payload && payload.statusCode) {
          if (payload.statusCode === HttpStatusCode.BAD_REQUEST) {
            if (Array.isArray(payload.message)) {
              (payload.message).forEach((msg) => {
                const [property, ...description] = msg.split(':');
                state.formErrors[HttpStatusCode.BAD_REQUEST][property.trim()] = description.join(':').trim();
              });
            }
          } else {
            state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
          }
        }
      })
      .addCase(createCoachProfileAction.fulfilled, (state, {payload}) => {
        state.userInfo = payload;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(createCoachProfileAction.rejected, (state, {payload}) => {
        if (payload && payload.statusCode) {
          if (payload.statusCode === HttpStatusCode.BAD_REQUEST) {
            if (Array.isArray(payload.message)) {
              (payload.message).forEach((msg) => {
                const [property, ...description] = msg.split(':');
                state.formErrors[HttpStatusCode.BAD_REQUEST][property.trim()] = description.join(':').trim();
              });
            } else {
              state.formErrors[HttpStatusCode.BAD_REQUEST]['certificates'] = payload.message;
            }
          } else {
            state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
          }
        }
      });

  },
});

export const {clearFormErrorsAction} = userProcess.actions;
