import { AuthorizationStatus } from 'src/app-constants';
import { HttpStatusCode } from 'src/services/server-api';
import { UserProcess } from 'src/types/state.type';
import { clearFormErrorsAction, userProcess } from './user-process.reducer';
import { addFriendsToListAction, addMyTrainingsToListAction, addOrdersToListAction, addPurchasesToListAction, checkAuthAction, createReplyAction, createUserProfileAction, deleteNotificationAction, getFriendListAction, getMyTrainingsAction, getNotificationsAction, getOrderListAction, getPurchasesListAction, getSpecialTrainingListAction, getTrainingAmountAction, loginAction, registerAction, updateProfileAction, updateTrainingAmountAction } from '../api-actions';
import { MockTrainer, MockTrainerProfile, MockUser, MockUserProfile, createNotificiationMocks, createOrderMocks, createTrainingMocks, createUserMocks } from 'src/mock-constants';
import { Message } from 'src/types/message.type';
import { TrainingCardType } from 'src/types/training.type';
import { UserInfo } from 'src/types/user.type';
import { OrderCardType } from 'src/types/order.type';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  myProfileInfo: undefined,
  notifications: [],
  myTrainingsList: undefined,
  totalMyTrainingsCount: 0,
  friendList: undefined,
  totalFriendsCount: 0,
  remainingTrainingAmount: 0,
  orderList: undefined,
  totalOrdersCount: 0,
  specialTrainingList: undefined,
  formErrors: {
    [HttpStatusCode.CONFLICT]: '',
    [HttpStatusCode.UNAUTHORIZED]: ''
  },
};

describe('Reducer user-process', () => {
  it('without additional parameters should return initial state', () => {
    expect(userProcess.reducer(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  describe('clearFormErrorsAction test', () => {
    const testState: UserProcess = {
      ...initialState,
      formErrors: {
        [HttpStatusCode.CONFLICT]: 'Conflict mock error',
        [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized mock error'
      }
    };
    it('should clear form errors', () => {
      expect(userProcess.reducer(testState, clearFormErrorsAction()))
        .toEqual(initialState);
    });
  });

  describe('registerAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update user authorization status to AUTH and update myProfileInfo if registerAction fulfilled', () => {
      const myProfileInfo = {...MockUser};
      expect(userProcess.reducer(testState, { type: registerAction.fulfilled.type, payload: myProfileInfo }))
        .toEqual({ ...testState, authorizationStatus: AuthorizationStatus.Auth, myProfileInfo});
    });

    it('should set myProfileInfo to null and set formError if registerAction rejected with conflict error', () => {
      expect(userProcess.reducer(testState, { type: registerAction.rejected.type, payload: {statusCode: HttpStatusCode.CONFLICT, message: 'Conflict mock error'} }))
        .toEqual({
          ...testState,
          myProfileInfo: null,
          formErrors: {
            [HttpStatusCode.CONFLICT]: 'Conflict mock error',
            [HttpStatusCode.UNAUTHORIZED]: ''
          }
        });
    });
  });

  describe('loginAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update user authorization status to AUTH and update myProfileInfo if loginAction fulfilled', () => {
      const myProfileInfo = {...MockUser};
      expect(userProcess.reducer(testState, { type: loginAction.fulfilled.type, payload: myProfileInfo }))
        .toEqual({ ...testState, authorizationStatus: AuthorizationStatus.Auth, myProfileInfo});
    });

    it('should set myProfileInfo to null, update user authorization status to NO_AUTH and set formError if loginAction rejected with unauthorized error', () => {
      expect(userProcess.reducer(testState, { type: loginAction.rejected.type, payload: {statusCode: HttpStatusCode.UNAUTHORIZED, message: 'Unauthorized mock error'} }))
        .toEqual({
          ...testState,
          myProfileInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
          formErrors: {
            [HttpStatusCode.CONFLICT]: '',
            [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized mock error'
          }
        });
    });
  });

  describe('checkAuthAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update user authorization status to AUTH and update myProfileInfo if checkAuthAction fulfilled', () => {
      const myProfileInfo = {...MockUser};
      expect(userProcess.reducer(testState, { type: checkAuthAction.fulfilled.type, payload: myProfileInfo }))
        .toEqual({ ...testState, authorizationStatus: AuthorizationStatus.Auth, myProfileInfo});
    });

    it('should set myProfileInfo to null, update user authorization status to NO_AUTH if checkAuthAction rejected', () => {
      expect(userProcess.reducer(testState, { type: checkAuthAction.rejected.type}))
        .toEqual({
          ...testState,
          myProfileInfo: null,
          authorizationStatus: AuthorizationStatus.NoAuth,
        });
    });
  });

  describe('createUserProfileAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update userProfile property in myProfileInfo if createUserProfileAction fulfilled', () => {
      const myProfileInfo = {...MockUser};
      expect(userProcess.reducer({...testState, myProfileInfo}, { type: createUserProfileAction.fulfilled.type, payload: {...myProfileInfo, userProfile: MockUserProfile} }))
        .toEqual({ ...testState, myProfileInfo: {...myProfileInfo, userProfile: MockUserProfile}});
    });
  });

  describe('createTrainerProfileAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update trainerProfile property in myProfileInfo if createTrainerProfileAction fulfilled', () => {
      const myProfileInfo = {...MockTrainer};
      expect(userProcess.reducer({...testState, myProfileInfo}, { type: createUserProfileAction.fulfilled.type, payload: {...myProfileInfo, trainerProfile: MockTrainerProfile} }))
        .toEqual({ ...testState, myProfileInfo: {...myProfileInfo, trainerProfile: MockTrainerProfile}});
    });
  });

  describe('updateProfileAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update myProfileInfo if updateProfileAction fulfilled', () => {
      const myProfileInfo = {...MockTrainer, trainerProfile: MockTrainerProfile};
      expect(userProcess.reducer({...testState, myProfileInfo}, { type: updateProfileAction.fulfilled.type, payload: {...myProfileInfo, name: 'updatedName'} }))
        .toEqual({ ...testState, myProfileInfo: {...myProfileInfo, name: 'updatedName'}});
    });
  });

  describe('getNotificationsAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update notifications if getNotificationsAction fulfilled', () => {
      const notifications: Message[] = createNotificiationMocks(10);
      expect(userProcess.reducer(testState, { type: getNotificationsAction.fulfilled.type, payload: notifications }))
        .toEqual({ ...testState, notifications});
    });
  });

  describe('deleteNotificationAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update notifications if deleteNotificationAction fulfilled', () => {
      const notifications: Message[] = createNotificiationMocks(10);
      const updatedNotifications: Message[] = createNotificiationMocks(9);
      expect(userProcess.reducer({...testState, notifications}, { type: deleteNotificationAction.fulfilled.type, payload: updatedNotifications }))
        .toEqual({ ...testState, notifications: updatedNotifications});
    });
  });

  describe('getMyTrainingsAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should update "my trainings" list and total my trainings count if getMyTrainingsAction fulfilled', () => {
      const myTrainingsList = createTrainingMocks(5);
      expect(userProcess.reducer(testState, { type: getMyTrainingsAction.fulfilled.type, payload: {trainingList: myTrainingsList, totalTrainingsCount: myTrainingsList.length} }))
        .toEqual({ ...testState, myTrainingsList, totalMyTrainingsCount: myTrainingsList.length});
    });

    it('should set "my trainings" list to null if getMyTrainingsAction rejected', () => {
      expect(userProcess.reducer(testState, { type: getMyTrainingsAction.rejected.type }))
        .toEqual({ ...testState, myTrainingsList: null});
    });
  });

  describe('addMyTrainingsToListAction test', () => {
    let testState: UserProcess;

    it('should update "my trainings" list if addMyTrainingsToListAction fulfilled', () => {
      const myTrainingsList = createTrainingMocks(6);
      const newTrainings = createTrainingMocks(6);

      testState = {...initialState, myTrainingsList};
      expect(userProcess.reducer(testState, { type: addMyTrainingsToListAction.fulfilled.type, payload: {trainingList: newTrainings, totalTrainingsCount: 20} }))
        .toEqual({ ...testState, myTrainingsList: [...(testState.myTrainingsList as TrainingCardType[]), ...newTrainings], totalMyTrainingsCount: 20});
    });
  });

  describe('getFriendListAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });
    it('should update friend list and total friends count if getFriendListAction fulfilled', () => {
      const friends = createUserMocks(6);

      expect(userProcess.reducer(testState, { type: getFriendListAction.fulfilled.type, payload: {friendList: friends, totalFriendsCount: friends.length}}))
        .toEqual({ ...testState, friendList: friends, totalFriendsCount: friends.length});
    });

    it('should set friend list to null if getFriendListAction rejected', () => {

      expect(userProcess.reducer(testState, { type: getFriendListAction.rejected.type }))
        .toEqual({ ...testState, friendList: null});
    });
  });

  describe('addFriendsToListAction test', () => {
    let testState: UserProcess;

    it('should update friends list if addFriendsToListAction fulfilled', () => {
      const friendList = createUserMocks(6);
      const newFriends = createUserMocks(6);

      testState = {...initialState, friendList};
      expect(userProcess.reducer(testState, { type: addFriendsToListAction.fulfilled.type, payload: {friendList: newFriends, totalFriendsCount: 20} }))
        .toEqual({ ...testState, friendList: [...(testState.friendList as UserInfo[]), ...newFriends], totalFriendsCount: 20});
    });
  });

  describe('getTrainingAmountAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });
    it('should update remaining training amount count if getTrainingAmountAction fulfilled', () => {

      expect(userProcess.reducer(testState, { type: getTrainingAmountAction.fulfilled.type, payload: 5}))
        .toEqual({ ...testState, remainingTrainingAmount: 5});
    });

    it('should set remaining training amount count to -1 if getTrainingAmountAction rejected', () => {

      expect(userProcess.reducer(testState, { type: getTrainingAmountAction.rejected.type}))
        .toEqual({ ...testState, remainingTrainingAmount: -1});
    });
  });

  describe('updateTrainingAmountAction test', () => {
    let testState: UserProcess;

    it('should update remaining training amount count if updateTrainingAmountAction fulfilled', () => {
      testState = {...initialState, remainingTrainingAmount: 4};
      expect(userProcess.reducer(testState, { type: updateTrainingAmountAction.fulfilled.type, payload: 3}))
        .toEqual({ ...testState, remainingTrainingAmount: 3});
    });
  });

  describe('getPurchasesListAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });
    it('should update purchases list and total my trainings count if getPurchasesListAction fulfilled', () => {
      const myTrainingsList = createTrainingMocks(5);
      expect(userProcess.reducer(testState, { type: getPurchasesListAction.fulfilled.type, payload: {trainingList: myTrainingsList, totalTrainingsCount: myTrainingsList.length} }))
        .toEqual({ ...testState, myTrainingsList, totalMyTrainingsCount: myTrainingsList.length});
    });

    it('should set purchases list to null if getPurchasesListAction rejected', () => {
      expect(userProcess.reducer(testState, { type: getPurchasesListAction.rejected.type }))
        .toEqual({ ...testState, myTrainingsList: null});
    });
  });

  describe('addPurchasesToListAction test', () => {
    let testState: UserProcess;

    it('should update purchases list if addPurchasesToListAction fulfilled', () => {
      const myTrainingsList = createTrainingMocks(6);
      const newTrainings = createTrainingMocks(6);

      testState = {...initialState, myTrainingsList};
      expect(userProcess.reducer(testState, { type: addPurchasesToListAction.fulfilled.type, payload: {trainingList: newTrainings, totalTrainingsCount: 20} }))
        .toEqual({ ...testState, myTrainingsList: [...(testState.myTrainingsList as TrainingCardType[]), ...newTrainings], totalMyTrainingsCount: 20});
    });
  });

  describe('getOrderListAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });
    it('should update orders list and total orders count if getOrderListAction fulfilled', () => {
      const orders = createOrderMocks(5);
      expect(userProcess.reducer(testState, { type: getOrderListAction.fulfilled.type, payload: {orderList: orders, totalOrdersCount: orders.length} }))
        .toEqual({ ...testState, orderList: orders, totalOrdersCount: orders.length});
    });

    it('should set orders list to null if getOrderListAction rejected', () => {
      expect(userProcess.reducer(testState, { type: getOrderListAction.rejected.type }))
        .toEqual({ ...testState, orderList: null});
    });
  });

  describe('addOrdersToListAction test', () => {
    let testState: UserProcess;

    it('should update orders list if addOrdersToListAction fulfilled', () => {
      const orderList = createOrderMocks(6);
      const newOrders = createOrderMocks(6);

      testState = {...initialState, orderList};
      expect(userProcess.reducer(testState, { type: addOrdersToListAction.fulfilled.type, payload: {orderList: newOrders, totalOrdersCount: 20} }))
        .toEqual({ ...testState, orderList: [...(testState.orderList as OrderCardType[]), ...newOrders], totalOrdersCount: 20});
    });
  });

  describe('createReplyAction', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });

    it('should set form error if createReplyAction rejected', () => {
      expect(userProcess.reducer(testState, { type: createReplyAction.rejected.type, payload: {statusCode: HttpStatusCode.CONFLICT, message: 'Conflict mock error'}}))
        .toEqual({
          ...testState,
          formErrors: {
            [HttpStatusCode.CONFLICT]: 'Conflict mock error',
            [HttpStatusCode.UNAUTHORIZED]: ''
          }
        });
    });
  });

  describe('getSpecialTrainingListAction test', () => {
    let testState: UserProcess;

    beforeEach(() => { testState = { ...initialState }; });
    it('should update special training list if getSpecialTrainingListAction fulfilled', () => {
      const trainings = createTrainingMocks(5);
      expect(userProcess.reducer(testState, { type: getSpecialTrainingListAction.fulfilled.type, payload: trainings}))
        .toEqual({ ...testState, specialTrainingList: trainings});
    });

    it('should set special training list to null if getSpecialTrainingListAction rejected', () => {
      expect(userProcess.reducer(testState, { type: getSpecialTrainingListAction.rejected.type }))
        .toEqual({ ...testState, specialTrainingList: null});
    });
  });
});
