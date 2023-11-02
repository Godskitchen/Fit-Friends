import {
  FitnessLevel,
  Gender,
  Location,
  OrderType,
  PaymentType,
  Role,
  TrainerProfile,
  TrainingDuration,
  TrainingType,
  UserProfile,
} from '@libs/shared/app-types';
import {
  getRandomArrItem,
  getRandomNumber,
  getRandomUniqueItem,
  getUniqueRandomArrItems,
  hashPassword,
} from '@libs/shared/helpers';
import {
  ABOUT_INFO,
  ACHIEVEMENTS,
  AVATAR,
  BACK_USER_IMAGES,
  CERTIFICATES,
  NAMES,
  PASSWORD,
  TRAINER_EMAILS,
  USER_EMAILS,
} from './user.mocks';
import {
  BACK_TRAINING_IMAGES,
  DESCRIPTIONS,
  TITLES,
  TRAINING_VIDEO,
} from './training.mocks';
import { USER_PAIR_MOCKS_COUNT } from './constants';
import { TEXTS } from './reply.mocks';

type StaticUrlParams = {
  host: string;
  port: string;
  rootDir: string;
};

const getUserEmail = getRandomUniqueItem(USER_EMAILS, USER_PAIR_MOCKS_COUNT);
const getTrainerEmail = getRandomUniqueItem(
  TRAINER_EMAILS,
  USER_PAIR_MOCKS_COUNT,
);

export const createUserProfile = (): UserProfile => ({
  fitnessLevel: getRandomArrItem(Object.values(FitnessLevel)),
  trainingType: getUniqueRandomArrItems(3, Object.values(TrainingType)),
  trainingDuration: getRandomArrItem(Object.values(TrainingDuration)),
  caloriesToBurn: getRandomNumber(1000, 5000),
  dailyCaloriesIntake: getRandomNumber(1000, 5000),
  readyForWorkout: getRandomArrItem([true, false]),
});

export const createTrainerProfile = ({
  host,
  port,
  rootDir,
}: StaticUrlParams): TrainerProfile => ({
  fitnessLevel: getRandomArrItem(Object.values(FitnessLevel)),
  trainingType: getUniqueRandomArrItems(3, Object.values(TrainingType)),
  certificates: `http://${host}:${port}${rootDir}/${getRandomArrItem(
    CERTIFICATES,
  )}`,
  achievements: getRandomArrItem(ACHIEVEMENTS),
  readyForWorkout: getRandomArrItem([true, false]),
});

export const createUserData = async ({
  host,
  port,
  rootDir,
}: StaticUrlParams) => ({
  name: getRandomArrItem(NAMES),
  email: getUserEmail(),
  avatarUrl: `http://${host}:${port}${rootDir}/${AVATAR}`,
  hashPassword: await hashPassword(PASSWORD),
  gender: getRandomArrItem(Object.values(Gender)),
  role: Role.User,
  aboutInfo: getRandomArrItem(ABOUT_INFO),
  location: getRandomArrItem(Object.values(Location)),
  backgroundImage: `http://${host}:${port}${rootDir}/${getRandomArrItem(
    BACK_USER_IMAGES,
  )}`,
  userProfile: createUserProfile(),
});

export const createTrainerData = async ({
  host,
  port,
  rootDir,
}: StaticUrlParams) => ({
  name: getRandomArrItem(NAMES),
  email: getTrainerEmail(),
  avatarUrl: `http://${host}:${port}${rootDir}/${AVATAR}`,
  hashPassword: await hashPassword(PASSWORD),
  gender: getRandomArrItem(Object.values(Gender)),
  role: Role.Trainer,
  aboutInfo: getRandomArrItem(ABOUT_INFO),
  location: getRandomArrItem(Object.values(Location)),
  backgroundImage: `http://${host}:${port}${rootDir}/${getRandomArrItem(
    BACK_USER_IMAGES,
  )}`,
  trainerProfile: createTrainerProfile({ host, port, rootDir }),
});

export const createTrainingData = ({
  host,
  port,
  rootDir,
}: StaticUrlParams) => ({
  title: getRandomArrItem(TITLES),
  backgroundImage: `http://${host}:${port}${rootDir}/${getRandomArrItem(
    BACK_TRAINING_IMAGES,
  )}`,
  fitnessLevel: getRandomArrItem(Object.values(FitnessLevel)),
  trainingDuration: getRandomArrItem(Object.values(TrainingDuration)),
  trainingType: getRandomArrItem(Object.values(TrainingType)),
  price: getRandomNumber(0, 1000),
  caloriesToBurn: getRandomNumber(1000, 5000),
  description: getRandomArrItem(DESCRIPTIONS),
  gender: getRandomArrItem(Object.values(Gender)),
  rating: getRandomNumber(0, 5, 2),
  video: `http://${host}:${port}${rootDir}/${TRAINING_VIDEO}`,
  isSpecialOffer: getRandomArrItem([true, false]),
});

export const createOrderData = () => ({
  orderType: OrderType.Abonement,
  trainingCount: getRandomNumber(1, 50),
  paymentType: getRandomArrItem(Object.values(PaymentType)),
});

export const createReplyData = () => ({
  rating: getRandomNumber(1, 5),
  text: getRandomArrItem(TEXTS),
});
