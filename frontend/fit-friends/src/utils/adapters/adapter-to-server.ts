import { FitnessLevelToServer, GenderToServer, LocationToServer, RoleToServer, SpecialisationToServer, TrainingDurationToServer } from 'src/utils/adapters/adaprters-constants';
import { NewTrainerProfileDto, NewUserDto, NewUserProfileDto } from 'src/utils/adapters/api-dtos/new-user.dto';
import { RegisterData, TrainerProfileInfo, UserProfileInfo } from 'src/types/user.type';

export const adaptRegisterUserToServer = (newUser: RegisterData): NewUserDto => ({
  name: newUser.name,
  email: newUser.email,
  password: newUser.password,
  gender: GenderToServer[newUser.gender],
  location: LocationToServer[newUser.location],
  role: RoleToServer[newUser.role],
  birthDate: newUser.birthday,
  avatar: newUser.avatar
});

export const adaptUserProfileToServer = (newProfile: UserProfileInfo): NewUserProfileDto => ({
  fitnessLevel: FitnessLevelToServer[newProfile.skillLevel],
  trainingType: newProfile.specialisations.map((value) => SpecialisationToServer[value]),
  caloriesToBurn: newProfile.caloriesToBurn,
  dailyCaloriesIntake: newProfile.dailyCaloriesIntake,
  readyForWorkout: newProfile.readyForWorkout,
  trainingDuration: TrainingDurationToServer[newProfile.trainingDuration],
});

export const adaptCoachProfileToServer = (newProfile: TrainerProfileInfo): NewTrainerProfileDto => ({
  fitnessLevel: FitnessLevelToServer[newProfile.skillLevel],
  trainingType: newProfile.specialisations.map((value) => SpecialisationToServer[value]),
  certificates: newProfile.certificates,
  achievements: newProfile.description,
  readyForWorkout: newProfile.individualTraining,
});


