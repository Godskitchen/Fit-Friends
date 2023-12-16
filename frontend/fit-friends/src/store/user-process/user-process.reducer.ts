import { createSlice } from '@reduxjs/toolkit';
import { UserProcess } from '../../types/state.type';
import {
  addFriendsToListAction,
  addMyTrainingsToListAction,
  checkAuthAction,
  createCoachProfileAction,
  createUserProfileAction,
  deleteNotificationAction,
  getFriendListAction,
  getMyTrainingsAction,
  getNotificationsAction,
  loginAction,
  registerAction,
  updateProfileAction
} from '../api-actions';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { HttpStatusCode } from 'src/services/server-api';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  myProfileInfo: undefined,
  notifications: [],
  myTrainingsList: undefined,
  totalMyTrainingsCount: 0,
  friendList: undefined,
  totalFriendsCount: 0,
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
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(registerAction.rejected, (state, {payload}) => {
        state.myProfileInfo = null;
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
        state.myProfileInfo = payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.myProfileInfo = null;
      })
      .addCase(checkAuthAction.fulfilled, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.myProfileInfo = payload;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.myProfileInfo = null;
      })
      .addCase(createUserProfileAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
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
        state.myProfileInfo = payload;
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
      })
      .addCase(updateProfileAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
        state.formErrors = {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.SERVER_INTERNAL]: '',
          [HttpStatusCode.BAD_REQUEST]: {},
          [HttpStatusCode.UNAUTHORIZED]: ''
        };
      })
      .addCase(getNotificationsAction.fulfilled, (state, {payload}) => {
        state.notifications = payload;
      })
      .addCase(deleteNotificationAction.fulfilled, (state, {payload}) => {
        state.notifications = payload;
      })
      .addCase(getMyTrainingsAction.fulfilled, (state, {payload}) => {
        state.myTrainingsList = payload.trainingList;
        state.totalMyTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(getMyTrainingsAction.rejected, (state) => {
        state.myTrainingsList = null;
        state.totalMyTrainingsCount = 0;
      })
      .addCase(addMyTrainingsToListAction.fulfilled, (state, {payload}) => {
        if (state.myTrainingsList) {
          state.myTrainingsList = [...state.myTrainingsList, ...payload.trainingList];
          state.totalMyTrainingsCount = payload.totalTrainingsCount;
        }
      })
      .addCase(getFriendListAction.fulfilled, (state, {payload}) => {
        state.friendList = payload.friendList;
        state.totalFriendsCount = payload.totalFriendsCount;
      })
      .addCase(getFriendListAction.rejected, (state) => {
        state.friendList = null;
        state.totalFriendsCount = 0;
      })
      .addCase(addFriendsToListAction.fulfilled, (state, {payload}) => {
        if (state.friendList) {
          state.friendList = [...state.friendList, ...payload.friendList];
          state.totalFriendsCount = payload.totalFriendsCount;
        }
      });
  },
});

export const { clearFormErrorsAction } = userProcess.actions;
