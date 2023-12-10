import { TrainerProfileInfo, UserInfo, UserList, UserProfileInfo } from 'src/types/user.type';
import { AuthUserRdo, TrainerProfileRdo, UserListRdo, UserProfileRdo } from './api-rdos/auth-user.rdo';
import { TrainingListRdo, TrainingRdo } from './api-rdos/training.rdo';
import { MyTraining, Training, TrainingList } from 'src/types/training.type';
import { Role, Location } from 'src/types/constants';

export const adaptUserToClient = (rdo: Omit<AuthUserRdo, 'accessToken'>): UserInfo => ({
  userId: rdo.userId,
  name: rdo.name,
  email: rdo.email,
  aboutInfo: rdo.aboutInfo,
  gender: rdo.gender,
  location: Location[rdo.location],
  role: Role[rdo.role],
  birthday: rdo.birthDate,
  avatar: rdo.avatarUrl,
  createdAt: rdo.createdAt,
  backgroundImage: rdo.backgroundImage,
  userProfile: rdo.userProfile ? adaptUserProfileToClient(rdo.userProfile) : undefined,
  trainerProfile: rdo.trainerProfile ? adaptTrainerProfileToClient(rdo.trainerProfile) : undefined,
});

export const adaptUserProfileToClient = (rdo: UserProfileRdo): UserProfileInfo => ({
  skillLevel: rdo.fitnessLevel,
  specialisations: rdo.trainingType,
  trainingDuration: rdo.trainingDuration,
  caloriesToBurn: rdo.caloriesToBurn,
  dailyCaloriesIntake: rdo.dailyCaloriesIntake,
  readyForWorkout: rdo.readyForWorkout,
});

export const adaptTrainerProfileToClient = (rdo: TrainerProfileRdo): TrainerProfileInfo => ({
  skillLevel: rdo.fitnessLevel,
  specialisations: rdo.trainingType,
  certificates: rdo.certificates,
  description: rdo.achievements,
  individualTraining: rdo.readyForWorkout,
});


export const adaptMyTrainingsListToClient = (rdo: TrainingListRdo): TrainingList => ({
  trainingList: rdo.trainingList.map((training) => adaptMyTrainingToClient(training)),
  totalTrainingsCount: rdo.totalTrainingsCount,
});


export const adaptMyTrainingToClient = (rdo: TrainingRdo): MyTraining => ({
  trainingId: rdo.trainingId,
  title: rdo.title,
  backgroundImage: rdo.backgroundImage,
  skillLevel: rdo.fitnessLevel,
  trainingDuration: rdo.trainingDuration,
  specialisation: rdo.trainingType,
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: rdo.gender,
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer
});

export const adaptTrainingToClient = (rdo: TrainingRdo): Training => ({
  trainingId: rdo.trainingId,
  title: rdo.title,
  backgroundImage: rdo.backgroundImage,
  skillLevel: rdo.fitnessLevel,
  trainingDuration: rdo.trainingDuration,
  specialisation: rdo.trainingType,
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: rdo.gender,
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer,
  trainer: adaptUserToClient(rdo.trainer),
  video: rdo.video
});

export const adaptUsersListToClient = (rdo: UserListRdo): UserList => ({
  userList: rdo.userList.map((user) => adaptUserToClient(user)),
  totalUsersCount: rdo.totalUsersCount
});
