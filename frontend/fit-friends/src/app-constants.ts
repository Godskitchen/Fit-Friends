export enum AppRoute {
  Welcome = '/',
  Main = '/main',
  Login = '/login',
  Registration = '/registration',
  QuestionnaireCoach = '/questionnaire_coach',
  QuestionnaireUser = '/questionnaire_user',
  NotFound = '/404'
}

export enum ApiRoute {
  UploadAvatar = '/static/upload/avatar',
  UploadCertificate = '/static/upload/certificate',
  Register = '/auth/register',
  UserDetails = '/users/details',
  Login = '/auth/login',
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
