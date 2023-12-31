export enum AppRoute {
  Welcome = '/',
  Test = '/test',
  Main = '/main',
  Login = '/login',
  Registration = '/registration',
  QuestionnaireCoach = '/questionnaire_coach',
  QuestionnaireUser = '/questionnaire_user',
  Forbidden = '/forbidden',
  CoachAccount = '/account_coach',
  UserAccount = '/account_user',
  CreateTraining = '/create_training',
  MyTrainings = '/my_trainings',
  UsersCatalog = '/users_catalog',
  TrainingsCatalog = '/trainings_catalog',
  MyFriends = '/my_friends',
  MyPurchases = '/my_purchases',
  MyOrders = '/my_orders'
}

export enum ApiRoute {
  UploadAvatar = '/static/upload/avatar',
  UploadCertificate = '/static/upload/certificate',
  UploadTrainingVideo = 'static/upload/training-video',
  Register = '/auth/register',
  UserDetails = '/users/details',
  Login = '/auth/login',
  CheckAuth = '/auth',
  RefreshTokens = '/auth/refresh',
  Notifications = '/messages',
  CreateTraining = '/trainings/create',
  MyTrainings = '/trainings/mylist',
  TrainingList = '/trainings',
  SpecialTrainings = '/trainings/specials',
  TrainingDetails = '/trainings/details',
  UpdateTraining = '/trainings/update',
  UsersList = '/users',
  FriendsList = '/users/friends',
  CreateTrainingRequest = '/training-requests/create',
  UpdateTrainingRequest = '/training-requests/update',
  CheckSubscription = '/subscriptions/check',
  AddSubscription = '/subscriptions/add',
  RemoveSubscription = '/subscriptions/remove',
  CreateOrder = '/orders/create',
  CoachOrdersList = '/orders/mylist',
  MyListBalance = '/balance/mylist',
  UpdateBalance = '/balance/update',
  ReplyTrainingList = '/replies/list',
  CreateReply = '/replies/create'
}

export enum SliceNameSpace {
  Data = 'DATA',
  User = 'USER',
  Main = 'MAIN',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
