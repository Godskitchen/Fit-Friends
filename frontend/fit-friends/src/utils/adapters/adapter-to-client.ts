import { TrainerProfileInfo, UserInfo, UserProfileInfo } from 'src/types/user.type';
import { AuthUserRdo, TrainerProfileRdo, UserProfileRdo } from './api-rdos/auth-user.rdo';
import { Gender, Location, Role, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import { RoleToServer } from './adaprters-constants';
import { TrainingListRdo, TrainingRdo } from './api-rdos/training.rdo';
import { MyTraining, Training, TrainingList } from 'src/types/training.type';

export const adaptUserToClient = (rdo: Omit<AuthUserRdo, 'accessToken'>): UserInfo => ({
  userId: rdo.userId,
  name: rdo.name,
  email: rdo.email,
  aboutInfo: rdo.aboutInfo,
  gender: Gender[rdo.gender],
  location: Location[rdo.location],
  role: rdo.role === RoleToServer.Coach ? Role.Coach : Role.Sportsman,
  birthday: rdo.birthDate,
  avatar: rdo.avatarUrl,
  createdAt: rdo.createdAt,
  backgroundImage: rdo.backgroundImage,
  userProfile: rdo.userProfile ? adaptUserProfileToClient(rdo.userProfile) : undefined,
  trainerProfile: rdo.trainerProfile ? adaptTrainerProfileToClient(rdo.trainerProfile) : undefined,
});

export const adaptUserProfileToClient = (rdo: UserProfileRdo): UserProfileInfo => ({
  skillLevel: SkillLevel[rdo.fitnessLevel],
  specialisations: rdo.trainingType.map((type) => Specialisation[type]),
  trainingDuration: TrainingDuration[rdo.trainingDuration],
  caloriesToBurn: rdo.caloriesToBurn,
  dailyCaloriesIntake: rdo.dailyCaloriesIntake,
  readyForWorkout: rdo.readyForWorkout,
});

export const adaptTrainerProfileToClient = (rdo: TrainerProfileRdo): TrainerProfileInfo => ({
  skillLevel: SkillLevel[rdo.fitnessLevel],
  specialisations: rdo.trainingType.map((type) => Specialisation[type]),
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
  skillLevel: SkillLevel[rdo.fitnessLevel],
  trainingDuration: TrainingDuration[rdo.trainingDuration],
  specialisation: Specialisation[rdo.trainingType],
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: Gender[rdo.gender],
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer
});

export const adaptTrainingToClient = (rdo: TrainingRdo): Training => ({
  trainingId: rdo.trainingId,
  title: rdo.title,
  backgroundImage: rdo.backgroundImage,
  skillLevel: SkillLevel[rdo.fitnessLevel],
  trainingDuration: TrainingDuration[rdo.trainingDuration],
  specialisation: Specialisation[rdo.trainingType],
  caloriesToBurn: rdo.caloriesToBurn,
  price: rdo.price,
  description: rdo.description,
  gender: Gender[rdo.gender],
  rating: rdo.rating,
  isSpecialOffer: rdo.isSpecialOffer,
  trainer: adaptUserToClient(rdo.trainer),
  video: rdo.video
});
