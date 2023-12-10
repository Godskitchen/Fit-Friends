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
  UsersCatalog = '/users_catalog'
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
  TrainingDetails = '/trainings/details',
  UpdateTraining = '/trainings/update',
  UsersList = '/users'
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
