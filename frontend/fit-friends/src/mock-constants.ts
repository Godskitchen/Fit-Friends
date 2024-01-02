import { Gender, Location, Role, SkillLevel, Specialisation, TrainingDuration } from './types/constants';
import { OrderCardType } from './types/order.type';
import { TrainingCardType } from './types/training.type';
import { TrainerProfileInfo, UserInfo, UserProfileInfo } from './types/user.type';

export const MockUser: UserInfo = {
  userId: 1,
  name: '',
  email: '',
  gender: Gender.Male,
  aboutInfo: '',
  role: Role.User,
  birthday: '',
  avatar: '',
  backgroundImage: '',
  createdAt: '',
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: []
};

export const MockTrainer: UserInfo = {
  userId: 1,
  name: '',
  email: '',
  gender: Gender.Male,
  aboutInfo: '',
  role: Role.Trainer,
  birthday: '',
  avatar: '',
  backgroundImage: '',
  createdAt: '',
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: [],
};

export const MockUserProfile: UserProfileInfo = {
  skillLevel: SkillLevel.Beginner,
  specialisations: [Specialisation.Boxing],
  trainingDuration: TrainingDuration.TenToThirtyMinutes,
  caloriesToBurn: 1500,
  dailyCaloriesIntake: 2000,
  readyForWorkout: true
};

export const MockTrainerProfile: TrainerProfileInfo = {
  skillLevel: SkillLevel.Beginner,
  specialisations: [Specialisation.Boxing],
  certificates: 'certificate.pdf',
  description: '',
  individualTraining: true,
};


export const createUserMocks = (count: number) => {
  const mockUserList: UserInfo[] = [];
  for (let i = 1; i <= count; i++) {
    const newUser: UserInfo = {
      userId: i + 1,
      name: 'mock',
      email: `mockmail${i + 1}@mail.local`,
      gender: Gender.Female,
      aboutInfo: 'mockinfo',
      role: Role.User,
      birthday: new Date().toISOString(),
      avatar: 'path/to/avatar',
      backgroundImage: 'path/to/backimage',
      createdAt: new Date().toISOString(),
      location: Location.Petrogradskaya,
      trainingRequestsAsSender: [],
      trainingRequestsAsRecepient: [],
      userProfile: {...MockUserProfile}
    };
    mockUserList.push(newUser);
  }

  return mockUserList;
};


export const createOrderMocks = (count: number) => {
  const mockOrderList: OrderCardType[] = [];
  for (let i = 1; i <= count; i++) {
    const newOrder: OrderCardType = {
      training: {
        trainingId: i,
        title: `training${i}`,
        backgroundImage: '/path/to/image',
        skillLevel: SkillLevel.Amateur,
        trainingDuration: TrainingDuration.FiftyToEightyMinutes,
        specialisation: Specialisation.Yoga,
        price: 100,
        caloriesToBurn: 1500,
        description: 'training description',
        gender: Gender.Male,
        rating: 0,
        isSpecialOffer: false
      },
      sum: i * 100,
      trainingCount: i
    };
    mockOrderList.push(newOrder);
  }

  return mockOrderList;
};

export const createTrainingMocks = (count: number) => {
  const mockTrainingList: TrainingCardType[] = [];
  for (let i = 1; i <= count; i++) {
    const newTraining: TrainingCardType = {
      trainingId: i,
      title: `training${i}`,
      backgroundImage: '/path/to/image',
      skillLevel: SkillLevel.Amateur,
      trainingDuration: TrainingDuration.FiftyToEightyMinutes,
      specialisation: Specialisation.Yoga,
      price: 100,
      caloriesToBurn: 1500,
      description: 'training description',
      gender: Gender.Male,
      rating: 0,
      isSpecialOffer: false
    };
    mockTrainingList.push(newTraining);
  }

  return mockTrainingList;
};


export const MOCK_AVATAR = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
export const MOCK_VIDEO = [
  0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
  0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x00, 0x01,
  0x6D, 0x70, 0x34, 0x31, 0x00, 0x00, 0x00, 0x00,
];

export const MOCK_PDF = [
  0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34,
];
