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
  CreateTraining = '/create_training',
  UserAccount = '/account_user'
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
  MyTrainings = '/trainings/mylist'
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
