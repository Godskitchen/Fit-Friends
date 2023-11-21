import { TrainerProfileInfo, UserInfo, UserProfileInfo } from 'src/types/user.type';
import { AuthUserRdo, TrainerProfileRdo, UserProfileRdo } from './api-rdos/auth-user.rdo';
import { Gender, Location, Role, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import { RoleToServer } from './adaprters-constants';

export const adaptNewUserToClient = (rdo: Omit<AuthUserRdo, 'accessToken'>): UserInfo => ({
  userId: rdo.userId,
  name: rdo.name,
  email: rdo.email,
  gender: Gender[rdo.gender],
  location: Location[rdo.location],
  role: rdo.role === RoleToServer.Coach ? Role.Coach : Role.Sportsman,
  birthday: rdo.birthDate,
  avatar: rdo.avatarUrl,
  createdAt: rdo.createdAt,
  backgroundImage: rdo.backgroundImage,
  userProfile: rdo.userProfile ? adaptUserProfileToClient(rdo.userProfile) : undefined,
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
