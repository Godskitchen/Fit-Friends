import { LocationToServer, PaymentTypeToServer, RoleToServer } from 'src/utils/adapters/adaprters-constants';
import { NewUserDto, NewProfileDto } from 'src/utils/adapters/api-dtos/new-user.dto';
import {RegisterInfo, TrainerProfileInfo, UpdateProfileInfo, UserProfileInfo } from 'src/types/user.type';
import { UpdateUserDto } from './api-dtos/update-user.dto';
import { Role } from 'src/types/constants';
import { NewTrainingDto, UpdateTrainingDto } from './api-dtos/new-training.dto';
import { NewTrainingInfo, UpdateTrainingInfo } from 'src/types/training.type';
import { CreatePurchaseInputs, CreateReplyInputs } from 'src/types/forms.type';
import { NewOrderDto } from './api-dtos/new-order.dto';
import { NewReplyDto } from './api-dtos/new-reply.dto';


export const adaptRegisterUserToServer = (newUser: RegisterInfo): NewUserDto => ({
  name: newUser.name,
  email: newUser.email,
  password: newUser.password,
  gender: newUser.gender,
  location: LocationToServer[newUser.location],
  role: RoleToServer[newUser.role],
  birthDate: newUser.birthday,
  avatar: newUser.avatar
});


export const adaptUserProfileToServer = (newProfile: UserProfileInfo): NewProfileDto => ({
  userProfile: {
    fitnessLevel: newProfile.skillLevel,
    trainingType: newProfile.specialisations,
    caloriesToBurn: newProfile.caloriesToBurn,
    dailyCaloriesIntake: newProfile.dailyCaloriesIntake,
    readyForWorkout: newProfile.readyForWorkout,
    trainingDuration: newProfile.trainingDuration,
  }
});

export const adaptCoachProfileToServer = (newProfile: TrainerProfileInfo): NewProfileDto => ({
  trainerProfile: {
    fitnessLevel: newProfile.skillLevel,
    trainingType: newProfile.specialisations,
    certificates: newProfile.certificates,
    achievements: newProfile.description,
    readyForWorkout: newProfile.individualTraining,
  }
});

export const adaptUpdateProfiletoServer = (updateProfile: Partial<UpdateProfileInfo>, role: Role): UpdateUserDto => ({
  name: updateProfile.name,
  aboutInfo: updateProfile.aboutInfo,
  location: updateProfile.location ? LocationToServer[updateProfile.location] : undefined,
  gender: updateProfile.gender,
  avatar: updateProfile.avatar,
  userProfile: role === Role.User ? {
    fitnessLevel: updateProfile.skillLevel,
    trainingType: updateProfile.specialisations,
    readyForWorkout: updateProfile.individualTraining
  } : undefined,
  trainerProfile: role === Role.Trainer ? {
    fitnessLevel: updateProfile.skillLevel,
    trainingType: updateProfile.specialisations,
    readyForWorkout: updateProfile.individualTraining
  } : undefined
});

export const adaptNewTrainingToServer = (newTraining: NewTrainingInfo): NewTrainingDto => ({
  title: newTraining.title,
  fitnessLevel: newTraining.skillLevel,
  trainingDuration: newTraining.trainingDuration,
  trainingType: newTraining.specialisation,
  price: newTraining.price,
  caloriesToBurn: newTraining.caloriesToBurn,
  description: newTraining.description,
  gender: newTraining.gender,
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

export const adaptOrderToServer = (newOrder: CreatePurchaseInputs): NewOrderDto => ({
  trainingId: newOrder.trainingId,
  trainingCount: newOrder.trainingCount,
  paymentType: PaymentTypeToServer[newOrder.paymentType],
});

export const adaptNewReplyToClient = (newReply: CreateReplyInputs): NewReplyDto => ({
  trainingId: newReply.trainingId,
  text: newReply.text,
  rating: newReply.rating
});
