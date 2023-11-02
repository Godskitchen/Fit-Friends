import {
  FitnessLevel,
  Role,
  TrainerProfile,
  TrainingDuration,
  TrainingType,
  User,
  UserProfile,
} from '@libs/shared/app-types';
import {
  getRandomArrItem,
  getRandomNumber,
  getUniqueRandomArrItems,
} from '@libs/shared/helpers';
import { ACHIEVEMENTS, CERTIFICATES, EMAILS, NAMES } from './user.mocks';

type StaticUrlParams = {
  host: string;
  port: string;
  rootDir: string;
};

export const createUserProfile = (): UserProfile => {
  return {
    fitnessLevel: getRandomArrItem(Object.values(FitnessLevel)),
    trainingType: getUniqueRandomArrItems(3, Object.values(TrainingType)),
    trainingDuration: getRandomArrItem(Object.values(TrainingDuration)),
    caloriesToBurn: getRandomNumber(1000, 5000),
    dailyCaloriesIntake: getRandomNumber(1000, 5000),
    readyForWorkout: getRandomArrItem([true, false]),
  };
};

export const createTrainerProfile = ({
  host,
  port,
  rootDir,
}: StaticUrlParams): TrainerProfile => {
  return {
    fitnessLevel: getRandomArrItem(Object.values(FitnessLevel)),
    trainingType: getUniqueRandomArrItems(3, Object.values(TrainingType)),
    certificates: `http://${host}:${port}${rootDir}/${getRandomArrItem(
      CERTIFICATES,
    )}`,
    achievements: getRandomArrItem(ACHIEVEMENTS),
    readyForWorkout: getRandomArrItem([true, false]),
  };
};

export const createUser = (): User => {
  const role = getRandomArrItem(Object.values(Role));

  return {
    name: getRandomArrItem(NAMES),
    email: getRandomArrItem(EMAILS),
  }
}
