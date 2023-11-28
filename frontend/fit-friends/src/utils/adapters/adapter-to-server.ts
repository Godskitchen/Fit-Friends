import { FitnessLevelToServer, GenderToServer, LocationToServer, RoleToServer, SpecialisationToServer, TrainingDurationToServer } from 'src/utils/adapters/adaprters-constants';
import { NewUserDto, NewProfileDto } from 'src/utils/adapters/api-dtos/new-user.dto';
import { RegisterData, TrainerProfileInfo, UpdateProfileInfo, UserProfileInfo } from 'src/types/user.type';
import { UpdateUserDto } from './api-dtos/update-user.dto';
import { Role } from 'src/types/constants';

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


export const adaptUserProfileToServer = (newProfile: UserProfileInfo): NewProfileDto => ({
  userProfile: {
    fitnessLevel: FitnessLevelToServer[newProfile.skillLevel],
    trainingType: newProfile.specialisations.map((value) => SpecialisationToServer[value]),
    caloriesToBurn: newProfile.caloriesToBurn,
    dailyCaloriesIntake: newProfile.dailyCaloriesIntake,
    readyForWorkout: newProfile.readyForWorkout,
    trainingDuration: TrainingDurationToServer[newProfile.trainingDuration],
  }
});

export const adaptCoachProfileToServer = (newProfile: TrainerProfileInfo): NewProfileDto => ({
  trainerProfile: {
    fitnessLevel: FitnessLevelToServer[newProfile.skillLevel],
    trainingType: newProfile.specialisations.map((value) => SpecialisationToServer[value]),
    certificates: newProfile.certificates,
    achievements: newProfile.description,
    readyForWorkout: newProfile.individualTraining,
  }
});

export const adaptUpdateProfiletoServer = (updateProfile: UpdateProfileInfo, role: Role): UpdateUserDto => ({
  name: updateProfile.name,
  aboutInfo: updateProfile.aboutInfo ? updateProfile.aboutInfo : undefined,
  location: LocationToServer[updateProfile.location],
  gender: GenderToServer[updateProfile.gender],
  avatar: updateProfile.avatar,
  userProfile: role === Role.Sportsman ? {
    fitnessLevel: FitnessLevelToServer[updateProfile.skillLevel],
    trainingType: updateProfile.specialisations.map((value) => SpecialisationToServer[value]),
    readyForWorkout: updateProfile.individualTraining
  } : undefined,
  trainerProfile: role === Role.Coach ? {
    fitnessLevel: FitnessLevelToServer[updateProfile.skillLevel],
    trainingType: updateProfile.specialisations.map((value) => SpecialisationToServer[value]),
    readyForWorkout: updateProfile.individualTraining
  } : undefined
});


