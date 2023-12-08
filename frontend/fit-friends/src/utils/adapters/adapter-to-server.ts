import { FitnessLevelToServer, GenderToServer, LocationToServer, RoleToServer, SpecialisationToServer, TrainingDurationToServer } from 'src/utils/adapters/adaprters-constants';
import { NewUserDto, NewProfileDto } from 'src/utils/adapters/api-dtos/new-user.dto';
import {RegisterInfo, TrainerProfileInfo, UpdateProfileInfo, UserProfileInfo } from 'src/types/user.type';
import { UpdateUserDto } from './api-dtos/update-user.dto';
import { Role } from 'src/types/constants';
import { NewTrainingDto, UpdateTrainingDto } from './api-dtos/new-training.dto';
import { NewTrainingInfo, UpdateTrainingInfo } from 'src/types/training.type';


export const adaptRegisterUserToServer = (newUser: RegisterInfo): NewUserDto => ({
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

export const adaptUpdateProfiletoServer = (updateProfile: Partial<UpdateProfileInfo>, role: Role): UpdateUserDto => ({
  name: updateProfile.name,
  aboutInfo: updateProfile.aboutInfo,
  location: updateProfile.location ? LocationToServer[updateProfile.location] : undefined,
  gender: updateProfile.gender ? GenderToServer[updateProfile.gender] : undefined,
  avatar: updateProfile.avatar,
  userProfile: role === Role.Sportsman ? {
    fitnessLevel: updateProfile.skillLevel ? FitnessLevelToServer[updateProfile.skillLevel] : undefined,
    trainingType: updateProfile.specialisations ? updateProfile.specialisations.map((value) => SpecialisationToServer[value]) : undefined,
    readyForWorkout: updateProfile.individualTraining
  } : undefined,
  trainerProfile: role === Role.Coach ? {
    fitnessLevel: updateProfile.skillLevel ? FitnessLevelToServer[updateProfile.skillLevel] : undefined,
    trainingType: updateProfile.specialisations ? updateProfile.specialisations.map((value) => SpecialisationToServer[value]) : undefined,
    readyForWorkout: updateProfile.individualTraining
  } : undefined
});

export const adaptNewTrainingToServer = (newTraining: NewTrainingInfo): NewTrainingDto => ({
  title: newTraining.title,
  fitnessLevel: FitnessLevelToServer[newTraining.skillLevel],
  trainingDuration: TrainingDurationToServer[newTraining.trainingDuration],
  trainingType: SpecialisationToServer[newTraining.specialisation],
  price: newTraining.price,
  caloriesToBurn: newTraining.caloriesToBurn,
  description: newTraining.description,
  gender: GenderToServer[newTraining.gender],
  video: newTraining.trainingVideo,
  isSpecialOffer: false,
});

export const adaptUpdateTrainingToServer = (updateTraining: UpdateTrainingInfo): UpdateTrainingDto => ({
  title: updateTraining.title,
  description: updateTraining.description,
  isSpecialOffer: updateTraining.isSpecialOffer,
  price: updateTraining.price,
  video: updateTraining.trainingVideo
});
