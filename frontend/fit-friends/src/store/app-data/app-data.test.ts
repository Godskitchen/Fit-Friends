import { AppData } from 'src/types/state.type';
import { appData } from './app-data.reducer';
import { addFriendsToListAction, addMyTrainingsToListAction, addOrdersToListAction, addPurchasesToListAction, addRepliesToListAction, addTrainingsToListAction, addUsersToListAction, checkAuthAction, checkUserSubscriptionAction, createOrderAction, createReplyAction, createTrainingAction, getFriendListAction, getOrderListAction, getPurchasesListAction, getReadyUsersListAction, getReplyListAction, getSpecialOffersListAction, getSpecialTrainingListAction, getTrainingDetailsAction, getTrainingListAction, getUserDetailsAction, getUsersListAction, loginAction, registerAction, updateTrainingAction } from '../api-actions';
import { LoadError } from 'src/types/constants';
import { MockTraining, MockUser, MockUserProfile, createReplyMocks, createTrainingMocks, createUserMocks } from 'src/mock-constants';
import { Training, TrainingCardType } from 'src/types/training.type';
import { UserInfo } from 'src/types/user.type';
import { Reply } from 'src/types/reply.type';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false,
  usersDownloadingStatus: false,
  repliesDownloadingStatus: false,
  trainingInfo: undefined,
  userList: undefined,
  totalUsersCount: 0,
  currentUserDetails: undefined,
  subscriptionStatus: false,
  trainingList: undefined,
  readyUsersList: undefined,
  specialOffersList: undefined,
  totalTrainingsCount: 0,
  replyList: undefined,
  totalRepliesCount: 0,
  loadingError: ''
};
describe('Reducer app-data', () => {
  it('without additional parameters should return initial state', () => {
    expect(appData.reducer(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  describe('registerAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable data uploading status if registerAction pending', () => {
      expect(appData.reducer(testState, { type: registerAction.pending.type }))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should disable data uploading status if registerAction fulfilled', () => {
      expect(appData.reducer(testState, { type: registerAction.fulfilled.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });

    it('should disable data uploading status if registerAction rejected', () => {
      expect(appData.reducer(testState, { type: registerAction.rejected.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });
  });

  describe('loginAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable data uploading status if loginAction pending', () => {
      expect(appData.reducer(testState, { type: loginAction.pending.type }))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should disable data uploading status if loginAction fulfilled', () => {
      expect(appData.reducer(testState, { type: loginAction.fulfilled.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });

    it('should disable data uploading status if loginAction rejected', () => {
      expect(appData.reducer(testState, { type: loginAction.rejected.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });
  });

  describe('checkAuthAction test', () => {
    let testState: AppData;

    it('should clear loading errors if checkAuthAction fullfilled', () => {
      testState = { ...initialState, loadingError: 'error' };

      expect(appData.reducer(testState, { type: checkAuthAction.fulfilled.type }))
        .toEqual({ ...testState, loadingError: ''});
    });

    it('should set loading error status "ERR_NETWORK" if checkAuthAction rejected due to network error', () => {
      testState = { ...initialState, loadingError: '' };

      expect(appData.reducer(testState, { type: checkAuthAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, loadingError: LoadError.NetworkError });
    });
  });

  describe('createTrainingAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable data uploading status if createTrainingAction pending', () => {
      expect(appData.reducer(testState, { type: createTrainingAction.pending.type }))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should disable data uploading status if createTrainingAction fulfilled', () => {
      expect(appData.reducer(testState, { type: createTrainingAction.fulfilled.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });

    it('should disable data uploading status if createTrainingAction rejected', () => {
      expect(appData.reducer(testState, { type: createTrainingAction.rejected.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });
  });

  describe('addMyTrainingsToListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable training downloading status if addMyTrainingsToListAction pending', () => {
      expect(appData.reducer(testState, { type: addMyTrainingsToListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable training downloading status if addMyTrainingsToListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: addMyTrainingsToListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable training downloading status if addMyTrainingsToListAction rejected', () => {
      expect(appData.reducer(testState, { type: addMyTrainingsToListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('getTrainingDetailsAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable training downloading status and update training info if getTrainingDetailsAction fullfilled', () => {
      testState = { ...initialState, loadingError: 'error' };
      const trainingInfo: Training = {...MockTraining};

      expect(appData.reducer(testState, { type: getTrainingDetailsAction.fulfilled.type, payload: trainingInfo }))
        .toEqual({ ...testState, loadingError: '', trainingsDownloadingStatus: false, trainingInfo });
    });

    it('should enable training downloading status if getTrainingDetailsAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: getTrainingDetailsAction.pending.type}))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should set loading error status "ERR_NETWORK" if getTrainingDetailsAction rejected due to network error', () => {
      testState = { ...initialState, loadingError: '' };

      expect(appData.reducer(testState, { type: getTrainingDetailsAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, loadingError: LoadError.NetworkError, trainingInfo: null, trainingsDownloadingStatus: false });
    });
  });

  describe('updateTrainingAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable data uploading status and update training info if updateTrainingAction fullfilled', () => {
      testState = { ...initialState, loadingError: 'error' };
      const trainingInfo: Training = {...MockTraining};

      expect(appData.reducer(testState, { type: updateTrainingAction.fulfilled.type, payload: trainingInfo }))
        .toEqual({ ...testState, loadingError: '', dataUploadingStatus: false, trainingInfo });
    });

    it('should enable data uploading status if updateTrainingAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: updateTrainingAction.pending.type}))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should set loading error status "ERR_NETWORK" if updateTrainingAction rejected due to network error', () => {
      testState = { ...initialState, loadingError: '' };

      expect(appData.reducer(testState, { type: updateTrainingAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, loadingError: LoadError.NetworkError, trainingInfo: null, dataUploadingStatus: false });
    });
  });

  describe('getUsersListAction test', () => {
    let testState: AppData;
    beforeEach(() => { testState = { ...initialState }; });

    it('should clear loading errors, disable users downloading status and update uesrlist if getUsersListAction fullfilled', () => {
      const userList = createUserMocks(5);

      expect(appData.reducer(testState, { type: getUsersListAction.fulfilled.type, payload: {userList, totalUsersCount: userList.length} }))
        .toEqual({ ...testState, usersDownloadingStatus: false, userList, totalUsersCount: userList.length});
    });

    it('should enable user downloading status if getUsersListAction pending', () => {
      expect(appData.reducer(testState, { type: getUsersListAction.pending.type}))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should set userlist to null if getUsersListAction rejected', () => {
      expect(appData.reducer(testState, { type: getUsersListAction.rejected.type }))
        .toEqual({ ...testState, userList: null, usersDownloadingStatus: false });
    });
  });

  describe('addUsersToListAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable users downloading status and update userlist if addUsersToListAction fullfilled', () => {
      const userList = createUserMocks(5);
      testState = {...initialState, userList: createUserMocks(5), totalUsersCount: 10, loadingError: 'error'};

      expect(appData.reducer(testState, { type: addUsersToListAction.fulfilled.type, payload: {userList, totalUsersCount: 10} }))
        .toEqual({
          ...testState,
          usersDownloadingStatus: false,
          userList: [...(testState.userList as UserInfo[]), ...userList],
          totalUsersCount: 10,
          loadingError: ''
        });
    });

    it('should enable user downloading status if addUsersToListAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: addUsersToListAction.pending.type}))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should set loading error if addUsersToListAction rejected', () => {
      testState = { ...initialState};

      expect(appData.reducer(testState, { type: addUsersToListAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, usersDownloadingStatus: false, loadingError: LoadError.NetworkError });
    });
  });

  describe('getFriendListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable user downloading status if getFriendListAction pending', () => {
      expect(appData.reducer(testState, { type: getFriendListAction.pending.type }))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should disable user downloading status if getFriendListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: getFriendListAction.fulfilled.type }))
        .toEqual({ ...testState, usersDownloadingStatus: false });
    });

    it('should disable user downloading status if getFriendListAction rejected', () => {
      expect(appData.reducer(testState, { type: getFriendListAction.rejected.type }))
        .toEqual({ ...testState, usersDownloadingStatus: false });
    });
  });

  describe('addFriendsToListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable user downloading status if addFriendsToListAction pending', () => {
      expect(appData.reducer(testState, { type: addFriendsToListAction.pending.type }))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should disable user downloading status if addFriendsToListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: addFriendsToListAction.fulfilled.type }))
        .toEqual({ ...testState, usersDownloadingStatus: false });
    });

    it('should disable user downloading status if addFriendsToListAction rejected', () => {
      expect(appData.reducer(testState, { type: addFriendsToListAction.rejected.type }))
        .toEqual({ ...testState, usersDownloadingStatus: false });
    });
  });

  describe('getUserDetailsAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable training downloading status and update training info if getUserDetailsAction fullfilled', () => {
      testState = { ...initialState, loadingError: 'error' };
      const userDetails: UserInfo = {...MockUser, userProfile: MockUserProfile};

      expect(appData.reducer(testState, { type: getUserDetailsAction.fulfilled.type, payload: userDetails }))
        .toEqual({ ...testState, loadingError: '', usersDownloadingStatus: false, currentUserDetails: userDetails });
    });

    it('should enable user downloading status if getUserDetailsAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: getUserDetailsAction.pending.type}))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should set loading error status "ERR_NETWORK" if getUserDetailsAction rejected due to network error', () => {
      testState = { ...initialState, loadingError: '' };

      expect(appData.reducer(testState, { type: getUserDetailsAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, loadingError: LoadError.NetworkError, currentUserDetails: null, usersDownloadingStatus: false });
    });
  });

  describe('checkUserSubscriptionAction test', () => {
    let testState: AppData;

    it('should update subscriptionStatus if checkUserSubscriptionAction fullfilled', () => {
      testState = { ...initialState};

      expect(appData.reducer(testState, { type: checkUserSubscriptionAction.fulfilled.type, payload: true }))
        .toEqual({ ...testState, subscriptionStatus: true });
    });
  });

  describe('getTrainingListAction test', () => {
    let testState: AppData;

    beforeEach(() => {testState = {...initialState};});

    it('should update training list if getTrainingListAction fullfilled', () => {
      const trainingList = createTrainingMocks(5);

      expect(appData.reducer(testState, { type: getTrainingListAction.fulfilled.type, payload: {trainingList, totalTrainingsCount: trainingList.length} }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false, trainingList, totalTrainingsCount: trainingList.length});
    });

    it('should enable training downloading status if getTrainingListAction pending', () => {
      expect(appData.reducer(testState, { type: getTrainingListAction.pending.type}))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should set training list to null if getTrainingListAction rejected', () => {
      expect(appData.reducer(testState, { type: getTrainingListAction.rejected.type }))
        .toEqual({ ...testState, trainingList: null, trainingsDownloadingStatus: false });
    });
  });

  describe('addTrainingsToListAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable training downloading status and update traininglist if addTrainingsToListAction fullfilled', () => {
      const trainingList = createTrainingMocks(5);
      testState = {...initialState, trainingList: createTrainingMocks(5), totalTrainingsCount: 10, loadingError: 'error'};

      expect(appData.reducer(testState, { type: addTrainingsToListAction.fulfilled.type, payload: {trainingList, totalTrainingsCount: 10} }))
        .toEqual({
          ...testState,
          trainingsDownloadingStatus: false,
          trainingList: [...(testState.trainingList as TrainingCardType[]), ...trainingList],
          totalTrainingsCount: 10,
          loadingError: ''
        });
    });

    it('should enable training downloading status if addTrainingsToListAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: addTrainingsToListAction.pending.type}))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should set loading error if addTrainingsToListAction rejected', () => {
      testState = { ...initialState};

      expect(appData.reducer(testState, { type: addTrainingsToListAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, trainingsDownloadingStatus: false, loadingError: LoadError.NetworkError });
    });
  });

  describe('createOrderAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable data uploading status if createOrderction pending', () => {
      expect(appData.reducer(testState, { type: createOrderAction.pending.type }))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should disable data uploading status if createOrderAction fulfilled', () => {
      expect(appData.reducer(testState, { type: createOrderAction.fulfilled.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });

    it('should disable data uploading status if createOrderAction rejected', () => {
      expect(appData.reducer(testState, { type: createOrderAction.rejected.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });
  });

  describe('getPurchasesListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable trainings downloading status if getPurchasesListAction pending', () => {
      expect(appData.reducer(testState, { type: getPurchasesListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable trainings downloading status if getPurchasesListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: getPurchasesListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable trainings downloading status if getPurchasesListAction rejected', () => {
      expect(appData.reducer(testState, { type: getPurchasesListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('addPurchasesToListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable trainings downloading status if addPurchasesToListAction pending', () => {
      expect(appData.reducer(testState, { type: addPurchasesToListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable trainings downloading status if addPurchasesToListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: addPurchasesToListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable trainings downloading status if addPurchasesToListAction rejected', () => {
      expect(appData.reducer(testState, { type: addPurchasesToListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('getOrderListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable trainings downloading status if getOrderListAction pending', () => {
      expect(appData.reducer(testState, { type: getOrderListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable trainings downloading status if getOrderListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: getOrderListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable trainings downloading status if getOrderListAction rejected', () => {
      expect(appData.reducer(testState, { type: getOrderListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('addOrdersToListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable trainings downloading status if addOrdersToListAction pending', () => {
      expect(appData.reducer(testState, { type: addOrdersToListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable trainings downloading status if addOrdersToListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: addOrdersToListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable trainings downloading status if addOrdersToListAction rejected', () => {
      expect(appData.reducer(testState, { type: addOrdersToListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('getReplyListAction test', () => {
    let testState: AppData;

    beforeEach(() => {testState = {...initialState};});

    it('should update reply list if getReplyListAction fullfilled', () => {
      const replyList = createReplyMocks(5);

      expect(appData.reducer(testState, { type: getReplyListAction.fulfilled.type, payload: {replyList, totalRepliesCount: replyList.length} }))
        .toEqual({ ...testState, repliesDownloadingStatus: false, replyList, totalRepliesCount: replyList.length});
    });

    it('should enable replies downloading status if getReplyListAction pending', () => {
      expect(appData.reducer(testState, { type: getReplyListAction.pending.type}))
        .toEqual({ ...testState, repliesDownloadingStatus: true });
    });

    it('should set reply list to null if getReplyListAction rejected', () => {
      expect(appData.reducer(testState, { type: getReplyListAction.rejected.type }))
        .toEqual({ ...testState, replyList: null, repliesDownloadingStatus: false });
    });
  });

  describe('addRepliesToListAction test', () => {
    let testState: AppData;

    it('should clear loading errors, disable replies downloading status and update reply list if addRepliesToListAction fullfilled', () => {
      const replyList = createReplyMocks(5);
      testState = {...initialState, replyList: createReplyMocks(5), totalRepliesCount: 10, loadingError: 'error'};

      expect(appData.reducer(testState, { type: addRepliesToListAction.fulfilled.type, payload: {replyList, totalRepliesCount: 10} }))
        .toEqual({
          ...testState,
          repliesDownloadingStatus: false,
          replyList: [...(testState.replyList as Reply[]), ...replyList],
          totalRepliesCount: 10,
          loadingError: ''
        });
    });

    it('should enable reply downloading status if addRepliesToListAction pending', () => {
      testState = {...initialState};

      expect(appData.reducer(testState, { type: addRepliesToListAction.pending.type}))
        .toEqual({ ...testState, repliesDownloadingStatus: true });
    });

    it('should set loading error if addRepliesToListAction rejected', () => {
      testState = { ...initialState};

      expect(appData.reducer(testState, { type: addTrainingsToListAction.rejected.type, error: {code: LoadError.NetworkError}}))
        .toEqual({ ...testState, repliesDownloadingStatus: false, loadingError: LoadError.NetworkError });
    });
  });

  describe('createReplyAction test', () => {
    let testState: AppData;

    it('should enable data uploading status if createReplyAction pending', () => {
      testState = {...initialState };
      expect(appData.reducer(testState, { type: createReplyAction.pending.type }))
        .toEqual({ ...testState, dataUploadingStatus: true });
    });

    it('should disable data uploading status,update reply list and total replies count if createReplyAction fulfilled', () => {
      const replyList = createReplyMocks(5);
      const [newReply] = createReplyMocks(1);
      testState = {...initialState, replyList, totalRepliesCount: 5};
      expect(appData.reducer(testState, { type: createReplyAction.fulfilled.type, payload: newReply}))
        .toEqual({ ...testState, dataUploadingStatus: false, totalRepliesCount: testState.totalRepliesCount + 1, replyList: [newReply, ...(testState.replyList as Reply[])] });
    });

    it('should disable data uploading status if createReplyAction rejected', () => {
      testState = {...initialState };
      expect(appData.reducer(testState, { type: createReplyAction.rejected.type }))
        .toEqual({ ...testState, dataUploadingStatus: false });
    });
  });

  describe('getSpecialTrainingListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable training downloading status if getSpecialTrainingListAction pending', () => {
      expect(appData.reducer(testState, { type: getSpecialTrainingListAction.pending.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable training downloading status if getSpecialTrainingListAction fulfilled', () => {
      expect(appData.reducer(testState, { type: getSpecialTrainingListAction.fulfilled.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });

    it('should disable training downloading status if getSpecialTrainingListAction rejected', () => {
      expect(appData.reducer(testState, { type: getSpecialTrainingListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false });
    });
  });

  describe('getReadyUsersListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable users downloading status if getReadyUsersListAction pending', () => {

      expect(appData.reducer(testState, { type: getReadyUsersListAction.pending.type}))
        .toEqual({ ...testState, usersDownloadingStatus: true });
    });

    it('should disable users downloading status and update readyUsersList if getReadyUsersListAction fulfilled', () => {
      const users = createUserMocks(5);
      expect(appData.reducer(testState, { type: getReadyUsersListAction.fulfilled.type, payload: {userList: users} }))
        .toEqual({ ...testState, usersDownloadingStatus: false, readyUsersList: users });
    });

    it('should set readyUsersList to null if getReadyUsersListAction rejected', () => {
      expect(appData.reducer(testState, { type: getReadyUsersListAction.rejected.type }))
        .toEqual({ ...testState, usersDownloadingStatus: false, readyUsersList: null });
    });
  });

  describe('getSpecialOffersListAction test', () => {
    let testState: AppData;

    beforeEach(() => { testState = { ...initialState }; });
    it('should enable training downloading status if getSpecialOffersListAction pending', () => {

      expect(appData.reducer(testState, { type: getSpecialOffersListAction.pending.type}))
        .toEqual({ ...testState, trainingsDownloadingStatus: true });
    });

    it('should disable training downloading status and update special offers list if getSpecialOffersListAction fulfilled', () => {
      const trainings = createTrainingMocks(5);
      expect(appData.reducer(testState, { type: getSpecialOffersListAction.fulfilled.type, payload: {trainingList: trainings} }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false, specialOffersList: trainings });
    });

    it('should set special offers list to null if getSpecialOffersListAction rejected', () => {
      expect(appData.reducer(testState, { type: getSpecialOffersListAction.rejected.type }))
        .toEqual({ ...testState, trainingsDownloadingStatus: false, specialOffersList: null });
    });
  });
});
